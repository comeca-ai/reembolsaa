import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Modelo principal: Kimi (Moonshot, API direta). Fallback: OpenRouter (Gemini).
const MOONSHOT_KEY = Deno.env.get("MOONSHOT_API_KEY") ?? "";
const MOONSHOT_MODEL = Deno.env.get("MOONSHOT_MODEL") || "kimi-k2.6";
const MOONSHOT_URL = (Deno.env.get("MOONSHOT_BASE_URL") || "https://api.moonshot.ai/v1") + "/chat/completions";

const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const MODEL = Deno.env.get("OPENROUTER_ANALYSIS_MODEL") || Deno.env.get("OPENROUTER_MODEL") || "google/gemini-2.0-flash-001";
const FALLBACK = (Deno.env.get("OPENROUTER_FALLBACKS") || "google/gemini-flash-1.5,openai/gpt-4o-mini").split(",").map((s) => s.trim()).filter(Boolean);
const MODELS = [...new Set([MODEL, ...FALLBACK])];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function politicasTexto(politicas: any[]): string {
  if (!Array.isArray(politicas) || !politicas.length) return "";
  return politicas.map((p) => {
    const lims = [p.diario_brl ? `diário R$ ${p.diario_brl}` : null, p.por_noite_brl ? `por noite R$ ${p.por_noite_brl}` : null, p.teto_mes_brl ? `teto mês R$ ${p.teto_mes_brl}` : null].filter(Boolean).join(", ") || "sem limite numérico";
    const r = p.restricoes || (p.documento && p.documento !== "Política padrão" ? p.documento : "");
    return `- ${p.categoria}: ${lims}.${r ? ` Restrições: ${r}` : ""}`;
  }).join("\n");
}
function buildPrompt(despesa: any, politicaTexto: string, politicas: any[]): string {
  const itens = Array.isArray(despesa?.itens) && despesa.itens.length
    ? despesa.itens.map((it: any) => `  • ${it.nome}${it.valor != null ? ` (R$ ${it.valor})` : ""}`).join("\n")
    : "  (itens não detalhados)";
  const regras = [politicaTexto, politicasTexto(politicas)].filter(Boolean).join("\n\n") || "(Política não cadastrada.)";
  return `Você é um AGENTE DE ANÁLISE DE POLÍTICA DE REEMBOLSO, rigoroso e criterioso.
Decida se a despesa pode ser APROVADA automaticamente ou precisa ir para ANÁLISE humana (revisar).
RACIOCÍNIO (inferência): se a política proíbe uma CLASSE de item (ex.: bebidas alcoólicas), itens específicos dessa classe (caipirinha, cerveja, chopp, vinho, drink, whisky) também são proibidos mesmo sem citar o nome. Considere limites de valor, nota fiscal, itens pessoais. Na dúvida, "revisar".
=== POLÍTICA DA EMPRESA ===
${regras}
=== DESPESA ===
Fornecedor: ${despesa?.fornecedor || "-"}
Categoria: ${despesa?.categoria || "-"}
Valor total: R$ ${despesa?.valor_brl ?? "-"}
Descrição: ${despesa?.descricao || "-"}
Itens:
${itens}
Responda SOMENTE JSON: {"status":"aprovar"|"revisar","motivos":["..."],"raciocinio":"1-2 frases"}`;
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function parse(text: string) {
  let t = (text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim();
  const s = t.indexOf("{"); const e = t.lastIndexOf("}"); if (s >= 0 && e > s) t = t.slice(s, e + 1);
  try {
    const o = JSON.parse(t);
    return { status: o.status === "revisar" ? "revisar" : "aprovar", motivos: Array.isArray(o.motivos) ? o.motivos.filter((m: any) => typeof m === "string").slice(0, 8) : [], raciocinio: typeof o.raciocinio === "string" ? o.raciocinio.slice(0, 400) : "" };
  } catch (_) { return null; }
}

// Tenta o Kimi (Moonshot) primeiro. Retorna { content, model } ou null para cair no fallback.
async function callMoonshot(messages: any[]): Promise<{ content: string; model: string } | null> {
  if (!MOONSHOT_KEY) return null;
  try {
    const r = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${MOONSHOT_KEY}`, "Content-Type": "application/json" },
      // k2.6 é modelo de reasoning: temperature precisa ser 1 e max_tokens precisa ser folgado
      // (o raciocínio consome tokens antes da resposta em `content`).
      body: JSON.stringify({ model: MOONSHOT_MODEL, messages, temperature: 1, max_tokens: 4096 }),
    });
    if (!r.ok) { console.error(`Moonshot ${r.status}: ${(await r.text()).slice(0, 200)}`); return null; }
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return content ? { content, model: MOONSHOT_MODEL } : null;
  } catch (e) {
    console.error("Moonshot erro:", String((e as Error)?.message || e));
    return null;
  }
}

// Fallback: OpenRouter (Gemini + cadeia de fallbacks).
async function callOpenRouter(prompt: string): Promise<{ content: string; model: string } | null> {
  if (!OPENROUTER_KEY) return null;
  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://reembolsaa.vercel.app", "X-Title": "Reembolsaai" },
      body: JSON.stringify({ model: MODEL, models: MODELS, messages: [{ role: "user", content: prompt }] }),
    });
    if (r.ok) { const data = await r.json(); return { content: data?.choices?.[0]?.message?.content ?? "", model: MODEL }; }
    if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
    console.error(`OpenRouter ${r.status}`);
    return null;
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);
  if (!MOONSHOT_KEY && !OPENROUTER_KEY) return json({ error: "Nenhum provedor de IA configurado (MOONSHOT_API_KEY/OPENROUTER_API_KEY)" }, 500);
  try {
    const { despesa, politica_texto, politicas } = await req.json();
    if (!despesa) return json({ error: "despesa ausente" }, 400);
    const prompt = buildPrompt(despesa, politica_texto || "", politicas || []);

    // Kimi primeiro; OpenRouter como fallback.
    const result = (await callMoonshot([{ role: "user", content: prompt }])) || (await callOpenRouter(prompt));
    if (!result) return json({ status: "revisar", motivos: ["Não foi possível analisar automaticamente"], raciocinio: "" });

    const parsed = parse(result.content);
    if (!parsed) return json({ status: "revisar", motivos: ["Não foi possível analisar automaticamente"], raciocinio: "", model: result.model });
    return json({ ...parsed, model: result.model });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
