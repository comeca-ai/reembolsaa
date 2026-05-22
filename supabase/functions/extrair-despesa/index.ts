import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Modelo principal p/ FOTO: Kimi (Moonshot, visão). PDF e fallback: OpenRouter.
const MOONSHOT_KEY = Deno.env.get("MOONSHOT_API_KEY") ?? "";
const MOONSHOT_MODEL = Deno.env.get("MOONSHOT_MODEL") || "kimi-k2.6";
const MOONSHOT_URL = (Deno.env.get("MOONSHOT_BASE_URL") || "https://api.moonshot.ai/v1") + "/chat/completions";

const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const MODEL = Deno.env.get("OPENROUTER_MODEL") || "google/gemini-2.0-flash-001";
const FALLBACK = (Deno.env.get("OPENROUTER_FALLBACKS") || "google/gemini-flash-1.5,openai/gpt-4o-mini").split(",").map((s) => s.trim()).filter(Boolean);
const MODELS = [...new Set([MODEL, ...FALLBACK])];
const ALLOWED = ["Alimentação", "Transporte", "Hospedagem", "KM", "Outros"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PROMPT = `Você é um assistente de OCR de despesas. Analise o comprovante/nota fiscal/cupom anexado e extraia os dados.
Retorne SOMENTE JSON válido:
{"colaborador":"nome do funcionário se aparecer escrito no comprovante, senão null","fornecedor":"estabelecimento ou null","valor_brl":valor_total_em_reais_numero_ou_null,"data":"YYYY-MM-DD ou null","categoria":"uma de: Alimentação, Transporte, Hospedagem, KM, Outros","descricao":"breve","itens":[{"nome":"item","valor":numero_ou_null}]}
Extraia TODOS os itens consumíveis visíveis (cada bebida, prato, produto). valor_brl é o TOTAL. Se faltar um campo, use null. Não invente.`;

function numOrNull(v: unknown): number | null {
  if (typeof v === "string") v = v.replace(/[^0-9.,]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null;
}
function parse(text: string) {
  let t = (text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim();
  const s = t.indexOf("{"); const e = t.lastIndexOf("}"); if (s >= 0 && e > s) t = t.slice(s, e + 1);
  try {
    const o = JSON.parse(t);
    const categoria = ALLOWED.includes(o.categoria) ? o.categoria : "Outros";
    const data = typeof o.data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.data) ? o.data : null;
    const itens = Array.isArray(o.itens) ? o.itens.slice(0, 40).map((it: any) => ({ nome: typeof it?.nome === "string" ? it.nome.slice(0, 120) : String(it?.nome || "").slice(0, 120), valor: numOrNull(it?.valor) })).filter((it: any) => it.nome) : [];
    return { colaborador: typeof o.colaborador === "string" ? o.colaborador.slice(0, 120) : null, fornecedor: typeof o.fornecedor === "string" ? o.fornecedor.slice(0, 120) : null, valor_brl: numOrNull(o.valor_brl), data, categoria, descricao: typeof o.descricao === "string" ? o.descricao.slice(0, 200) : null, itens };
  } catch (_) { return null; }
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

// Kimi (Moonshot) com visão — usado para FOTOS (imagens). Retorna conteúdo ou null.
async function callMoonshotVision(dataUrl: string): Promise<{ content: string; model: string } | null> {
  if (!MOONSHOT_KEY) return null;
  try {
    const r = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${MOONSHOT_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MOONSHOT_MODEL,
        messages: [{ role: "user", content: [{ type: "text", text: PROMPT }, { type: "image_url", image_url: { url: dataUrl } }] }],
        temperature: 1, max_tokens: 4096,
      }),
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

// OpenRouter — usado para PDF (Mistral OCR) e como fallback das fotos.
async function callOpenRouter(dataUrl: string, isPdf: boolean): Promise<{ content: string; model: string } | null> {
  if (!OPENROUTER_KEY) return null;
  const userContent: any[] = [{ type: "text", text: PROMPT }];
  const body: any = { model: MODEL, models: MODELS, messages: [{ role: "user", content: userContent }] };
  if (isPdf) { userContent.push({ type: "file", file: { filename: "comprovante.pdf", file_data: dataUrl } }); body.plugins = [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }]; }
  else userContent.push({ type: "image_url", image_url: { url: dataUrl } });

  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://reembolsaa.vercel.app", "X-Title": "Reembolsaai" },
      body: JSON.stringify(body),
    });
    if (r.ok) { const data = await r.json(); return { content: data?.choices?.[0]?.message?.content ?? "", model: MODEL }; }
    if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
    console.error(`OpenRouter ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return null;
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);
  if (!MOONSHOT_KEY && !OPENROUTER_KEY) return json({ error: "Nenhum provedor de IA configurado" }, 500);
  try {
    const { fileBase64, mime } = await req.json();
    if (!fileBase64) return json({ error: "fileBase64 ausente" }, 400);
    const isPdf = String(mime || "").includes("pdf") || String(fileBase64).startsWith("data:application/pdf");
    const dataUrl = String(fileBase64).startsWith("data:") ? fileBase64 : `data:${mime || "image/jpeg"};base64,${fileBase64}`;

    // Foto: Kimi (visão) primeiro, OpenRouter como fallback. PDF: OpenRouter (Mistral OCR).
    let result: { content: string; model: string } | null = null;
    if (!isPdf) result = await callMoonshotVision(dataUrl);
    if (!result) result = await callOpenRouter(dataUrl, isPdf);
    if (!result) return json({ error: "Falha ao chamar o provedor de IA" }, 502);

    const parsed = parse(result.content);
    if (!parsed) return json({ error: "Não consegui ler o comprovante", raw: result.content.slice(0, 300) }, 422);
    return json({ ...parsed, model: result.model });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
