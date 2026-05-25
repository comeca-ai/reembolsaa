import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

const PROMPT = `Você é um analista de compliance de despesas corporativas, MUITO criterioso.
Leia INTEGRALMENTE o documento anexado.
Retorne:
1) "rules": limites por categoria. Use EXATAMENTE: "Alimentação", "Transporte", "Hospedagem", "KM", "Outros".
   Para cada categoria mencionada: diario_brl (número|null), por_noite_brl (número|null), teto_mes_brl (número|null), observacao (resumo curto), restricoes (proibições/exigências: itens não reembolsáveis como bebida alcoólica, exigência de nota fiscal, aprovação prévia, ou null).
2) "politica_texto": RESUMO FIEL e COMPLETO de TODAS as regras em texto corrido (markdown), sem omitir nenhuma proibição, exigência, limite ou exceção.
3) "is_politica_reembolso": true SOMENTE se o documento for de fato uma POLÍTICA/NORMA DE REEMBOLSO OU DE DESPESAS corporativas (regras de gastos, limites, reembolso). false para qualquer outra coisa (contrato, nota fiscal, currículo, apresentação, recibo, etc.).
4) "confianca": número 0..1 da sua certeza no item 3.
5) "empresa_detectada": o NOME e o CNPJ da empresa DONA da política, exatamente como aparecem no documento (cabeçalho, rodapé, logotipo, "razão social"). Use null em cada campo que não encontrar. NÃO invente.
Responda SOMENTE com JSON válido:
{"rules":[{"categoria":"...","diario_brl":null,"por_noite_brl":null,"teto_mes_brl":null,"observacao":"...","restricoes":"..."}],"resumo":"2-3 frases","politica_texto":"...","is_politica_reembolso":true,"confianca":0.0,"empresa_detectada":{"nome":null,"cnpj":null}}
Não invente valores nem regras. Não omita regras presentes no documento.`;

function numOrNull(v: unknown): number | null { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; }
function strOrNull(v: unknown, max = 500): string | null { return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null; }

// --- helpers de comparação empresa (doc x cadastro) ---
function soDigitos(v: unknown): string { return String(v ?? "").replace(/\D/g, ""); }
// Normaliza razão social: minúsculo, sem acento, sem sufixo societário, sem pontuação.
function normalizarNome(v: unknown): string {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // tira acentos
    .replace(/\b(ltda|s\.?\s?a\.?|sa|me|epp|eireli|mei|cia|companhia|industria|comercio|tecnologia|servicos)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim().replace(/\s+/g, " ");
}
function nomesBatem(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;
  const ta = new Set(a.split(" ").filter((t) => t.length >= 4));
  const tb = b.split(" ").filter((t) => t.length >= 4);
  return tb.some((t) => ta.has(t)); // compartilham ao menos um token significativo
}

type EmpresaCtx = { nome?: string | null; cnpj?: string | null } | null;
function validar(parsed: { rules: any[]; politica_texto: string; is_pol: boolean; confianca: number; empresa_detectada: { nome: string | null; cnpj: string | null } }, empresa: EmpresaCtx) {
  const avisos: string[] = [];

  // (1) É política de reembolso? Combina o veredito do LLM com marcadores concretos.
  const temValor = parsed.rules.some((r) => r.diario_brl != null || r.por_noite_brl != null || r.teto_mes_brl != null);
  const txt = (parsed.politica_texto || "").toLowerCase();
  const temPalavras = /(reembolso|despesa|di[áa]ria|limite|reembols)/.test(txt);
  const ehPolitica = (parsed.is_pol && parsed.confianca >= 0.5) || temValor || (parsed.rules.length > 0 && temPalavras);
  if (!ehPolitica) {
    avisos.push("Este PDF não parece ser uma política de reembolso de despesas. Confira o arquivo antes de salvar.");
  }

  // (2) A empresa do documento bate com a cadastrada?
  let empresa_match: "match" | "mismatch" | "desconhecida" = "desconhecida";
  const detCnpj = soDigitos(parsed.empresa_detectada?.cnpj);
  const cadCnpj = soDigitos(empresa?.cnpj);
  const detNome = normalizarNome(parsed.empresa_detectada?.nome);
  const cadNome = normalizarNome(empresa?.nome);

  if (cadCnpj.length === 14 && detCnpj.length === 14) {
    // CNPJ é autoritativo quando os dois existem.
    empresa_match = cadCnpj === detCnpj ? "match" : "mismatch";
  } else if (cadNome && detNome) {
    empresa_match = nomesBatem(cadNome, detNome) ? "match" : "mismatch";
  } else {
    empresa_match = "desconhecida"; // não deu pra detectar a empresa no doc
  }
  if (empresa_match === "mismatch") {
    const det = strOrNull(parsed.empresa_detectada?.nome) || (detCnpj.length === 14 ? detCnpj : "outra empresa");
    avisos.push(`Detectamos "${det}" no documento, mas sua empresa cadastrada é "${empresa?.nome ?? "—"}". Confirme se é a política certa.`);
  }
  if (cadCnpj.length !== 14 && empresa_match !== "match") {
    avisos.push("Cadastre o CNPJ da empresa para validar a política com mais segurança.");
  }

  return {
    is_politica_reembolso: ehPolitica,
    confianca: parsed.confianca,
    empresa_detectada: parsed.empresa_detectada,
    empresa_match,
    avisos,
  };
}

function parseRules(text: string) {
  let t = (text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim();
  const start = t.indexOf("{"); const end = t.lastIndexOf("}"); if (start >= 0 && end > start) t = t.slice(start, end + 1);
  try {
    const obj = JSON.parse(t);
    const rules = (obj.rules || []).filter((r: any) => ALLOWED.includes(r?.categoria)).map((r: any) => ({
      categoria: r.categoria, diario_brl: numOrNull(r.diario_brl), por_noite_brl: numOrNull(r.por_noite_brl), teto_mes_brl: numOrNull(r.teto_mes_brl), observacao: strOrNull(r.observacao, 300), restricoes: strOrNull(r.restricoes, 600),
    }));
    const conf = Number(obj.confianca);
    return {
      rules,
      resumo: strOrNull(obj.resumo, 600) || "",
      politica_texto: strOrNull(obj.politica_texto, 6000) || "",
      is_pol: obj.is_politica_reembolso === true,
      confianca: Number.isFinite(conf) ? Math.min(1, Math.max(0, conf)) : 0,
      empresa_detectada: {
        nome: strOrNull(obj.empresa_detectada?.nome, 200),
        cnpj: strOrNull(obj.empresa_detectada?.cnpj, 20),
      },
    };
  } catch (_) {
    return { rules: [], resumo: "", politica_texto: "", is_pol: false, confianca: 0, empresa_detectada: { nome: null, cnpj: null } };
  }
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);
  if (!OPENROUTER_KEY) return json({ error: "OPENROUTER_API_KEY não configurada" }, 500);
  try {
    const { fileBase64, filename, empresa } = await req.json();
    if (!fileBase64) return json({ error: "fileBase64 ausente" }, 400);
    const dataUrl = String(fileBase64).startsWith("data:") ? fileBase64 : `data:application/pdf;base64,${fileBase64}`;
    const body = {
      model: MODEL, models: MODELS,
      plugins: [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }],
      messages: [{ role: "user", content: [ { type: "text", text: PROMPT }, { type: "file", file: { filename: filename || "politica.pdf", file_data: dataUrl } } ] }],
    };
    let content = ""; let lastErr = "";
    for (let i = 0; i < 3; i++) {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://reembolsaa.vercel.app", "X-Title": "Reembolsaai" },
        body: JSON.stringify(body),
      });
      if (r.ok) { const data = await r.json(); content = data?.choices?.[0]?.message?.content ?? ""; break; }
      lastErr = `OpenRouter ${r.status}: ${(await r.text()).slice(0, 300)}`;
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
      return json({ error: lastErr }, 502);
    }
    const parsed = parseRules(content);
    const validacao = validar(parsed, (empresa && typeof empresa === "object") ? empresa : null);
    return json({ rules: parsed.rules, resumo: parsed.resumo, politica_texto: parsed.politica_texto, validacao, model: MODEL });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
