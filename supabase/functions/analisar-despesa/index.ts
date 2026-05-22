import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);
  if (!OPENROUTER_KEY) return json({ error: "OPENROUTER_API_KEY não configurada" }, 500);
  try {
    const { despesa, politica_texto, politicas } = await req.json();
    if (!despesa) return json({ error: "despesa ausente" }, 400);
    const content = buildPrompt(despesa, politica_texto || "", politicas || []);

    let raw = ""; let lastErr = "";
    for (let i = 0; i < 3; i++) {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://reembolsaa.vercel.app", "X-Title": "Reembolsaai" },
        body: JSON.stringify({ model: MODEL, models: MODELS, messages: [{ role: "user", content }] }),
      });
      if (r.ok) { const data = await r.json(); raw = data?.choices?.[0]?.message?.content ?? ""; break; }
      lastErr = `OpenRouter ${r.status}`; if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
      return json({ error: lastErr }, 502);
    }
    const parsed = parse(raw);
    if (!parsed) return json({ status: "revisar", motivos: ["Não foi possível analisar automaticamente"], raciocinio: "" });
    return json({ ...parsed, model: MODEL });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
