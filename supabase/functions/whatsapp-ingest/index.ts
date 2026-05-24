import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const MODEL = Deno.env.get("OPENROUTER_MODEL") || "google/gemini-2.0-flash-001";
const FALLBACK = (Deno.env.get("OPENROUTER_FALLBACKS") || "google/gemini-flash-1.5,openai/gpt-4o-mini").split(",").map((s) => s.trim()).filter(Boolean);
const MODELS = [...new Set([MODEL, ...FALLBACK])];
const GEMINI_ONLY = MODELS.filter((m) => m.includes("gemini"));
const VISION_OK = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED = ["Alimentação", "Transporte", "Hospedagem", "KM", "Outros"];

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function json(obj: unknown, status = 200) { return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
function numOrNull(v: unknown): number | null { if (typeof v === "string") v = v.replace(/[^0-9.,]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", "."); const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; }
function grabJson(text: string): any | null { let t = (text || "").trim(); const f = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (f) t = f[1].trim(); const s = t.indexOf("{"); const e = t.lastIndexOf("}"); if (s >= 0 && e > s) t = t.slice(s, e + 1); try { return JSON.parse(t); } catch (_) { return null; } }
function sniffMime(b: Uint8Array): string | null {
  if (!b || b.length < 12) return null;
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  if (b[0] === 0x42 && b[1] === 0x4D) return "image/bmp";
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return "image/heic";
  return null;
}
// Aceita: binário puro, multipart, JSON, form-urlencoded
async function parseBody(req: Request): Promise<any> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("multipart/form-data")) { const fd = await req.formData(); const o: any = {}; for (const [k, v] of fd.entries()) { if (v instanceof File) { o.__file = new Uint8Array(await v.arrayBuffer()); } else o[k] = v; } return o; }
  if (ct.includes("application/json")) { const raw = await req.text(); if (!raw) return {}; try { return JSON.parse(raw); } catch (_) { return {}; } }
  if (ct.includes("x-www-form-urlencoded")) { const raw = await req.text(); const p = new URLSearchParams(raw); const o: any = {}; for (const [k, v] of p) o[k] = v; return o; }
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.length && sniffMime(buf)) return { __file: buf };
  if (buf.length) { const raw = new TextDecoder().decode(buf); try { return JSON.parse(raw); } catch (_) { /* */ } if (raw.includes("=")) { const p = new URLSearchParams(raw); const o: any = {}; for (const [k, v] of p) o[k] = v; if (Object.keys(o).length) return o; } if (raw.trim()) return { __maybeBase64: raw.trim() }; }
  return {};
}
async function openrouter(messages: any[], plugins?: any[], modelsList?: string[]) {
  const list = (modelsList && modelsList.length) ? modelsList : MODELS;
  const body: any = { model: list[0], models: list, messages }; if (plugins) body.plugins = plugins;
  let lastErr = "";
  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://reembolsaa.vercel.app", "X-Title": "Reembolsaai" }, body: JSON.stringify(body) });
    if (r.ok) { const data = await r.json(); return data?.choices?.[0]?.message?.content ?? ""; }
    lastErr = `OpenRouter ${r.status}: ${(await r.text()).slice(0, 220)}`;
    if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
    throw new Error(lastErr);
  }
  throw new Error(lastErr);
}

const OCR_PROMPT = `Você é um OCR de comprovantes de despesa. Leia a imagem e extraia os dados. O valor total geralmente aparece como TOTAL/VALOR ou é a soma dos itens. SEMPRE tente retornar valor_brl.
Responda SOMENTE JSON:
{"colaborador":"nome do funcionário se escrito, senão null","fornecedor":"estabelecimento ou null","valor_brl":numero_total_ou_null,"data":"YYYY-MM-DD ou null","categoria":"Alimentação|Transporte|Hospedagem|KM|Outros","descricao":"breve","itens":[{"nome":"item","valor":numero_ou_null}]}
Não invente.`;
function limiteCategoria(p: any): number | null { return p ? (p.diario_brl ?? p.por_noite_brl ?? p.teto_mes_brl ?? null) : null; }
function politicasTexto(politicas: any[]): string { if (!Array.isArray(politicas) || !politicas.length) return ""; return politicas.map((p) => { const lims = [p.diario_brl ? `diário R$ ${p.diario_brl}` : null, p.por_noite_brl ? `por noite R$ ${p.por_noite_brl}` : null, p.teto_mes_brl ? `teto mês R$ ${p.teto_mes_brl}` : null].filter(Boolean).join(", ") || "sem limite"; const r = p.restricoes || (p.documento && p.documento !== "Política padrão" ? p.documento : ""); return `- ${p.categoria}: ${lims}.${r ? ` Restrições: ${r}` : ""}`; }).join("\n"); }
function analysisPrompt(d: any, politicaTexto: string, politicas: any[]): string { const itens = (d.itens || []).map((it: any) => `  • ${it.nome}${it.valor != null ? ` (R$ ${it.valor})` : ""}`).join("\n") || "  (sem itens)"; const regras = [politicaTexto, politicasTexto(politicas)].filter(Boolean).join("\n\n") || "(sem política)"; return `Você é um AGENTE DE ANÁLISE DE POLÍTICA, criterioso. Decida APROVAR ou REVISAR.
Infira casos implícitos: se a política proíbe bebida alcoólica, então caipirinha/cerveja/vinho/drink/chopp também são proibidos. Considere limites, nota fiscal, itens não reembolsáveis. Na dúvida, "revisar".
=== POLÍTICA ===
${regras}
=== DESPESA ===
Categoria: ${d.categoria} | Valor: R$ ${d.valor_brl} | Fornecedor: ${d.fornecedor || "-"}
Itens:
${itens}
Responda SOMENTE JSON: {"status":"aprovar"|"revisar","motivos":["..."],"raciocinio":"1-2 frases"}`; }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Método não suportado" }, 405);
  if (!OPENROUTER_KEY) return json({ ok: false, error: "OPENROUTER_API_KEY não configurada" }, 500);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const u = new URL(req.url);
  let urlToken = u.searchParams.get("token") || "";
  if (!urlToken) { const parts = u.pathname.split("/").filter(Boolean); const idx = parts.indexOf("whatsapp-ingest"); if (idx >= 0 && parts[idx + 1]) urlToken = decodeURIComponent(parts[idx + 1]); }
  try {
    const payload = await parseBody(req);
    const token = String(payload.token || urlToken || "").replace(/\s+/g, "");
    const empresaNome = payload.empresa; const telefone = payload.telefone;
    const colaboradorOverride = typeof payload.colaborador === "string" ? payload.colaborador.trim() : "";
    const fileBase64 = payload.fileBase64 || payload.base64 || payload.__maybeBase64; const imageUrl = payload.imageUrl || payload.url;
    if (!token) return json({ ok: false, error: "token ausente (na URL ou no corpo)" }, 401);
    const { data: empresas } = await supabase.from("empresa").select("id, nome, politica_texto").eq("webhook_token", token).limit(1);
    const empresa = empresas?.[0];
    if (!empresa) return json({ ok: false, error: "token inválido" }, 401);
    if (empresaNome && String(empresaNome).trim().toLowerCase() !== String(empresa.nome).trim().toLowerCase()) return json({ ok: false, error: "nome da empresa não confere com o token" }, 401);

    let bytes: Uint8Array;
    if (payload.__file && payload.__file.length) { bytes = payload.__file; }
    else if (fileBase64) { const raw = String(fileBase64).startsWith("data:") ? String(fileBase64).split(",")[1] : String(fileBase64); try { bytes = decodeBase64(raw.replace(/\s/g, "")); } catch (_) { return json({ ok: false, error: "base64 inválido" }, 400); } }
    else if (imageUrl) { const ir = await fetch(imageUrl); if (!ir.ok) return json({ ok: false, error: "não consegui baixar a imagem" }, 400); bytes = new Uint8Array(await ir.arrayBuffer()); }
    else return json({ ok: false, error: "envie o arquivo binário no corpo, ou fileBase64/imageUrl" }, 400);

    const detected = sniffMime(bytes);
    const imgMime = detected || "image/jpeg";
    const isPdf = imgMime === "application/pdf";
    const dataUrl = `data:${imgMime};base64,${encodeBase64(bytes)}`;
    const diag = { detectedMime: detected, bytes: bytes.length, head: Array.from(bytes.slice(0, 4)).map((x) => x.toString(16).padStart(2, "0")).join("") };

    const ocrContent: any[] = [{ type: "text", text: OCR_PROMPT }];
    let plugins: any[] | undefined; let ocrModels = MODELS;
    if (isPdf) { ocrContent.push({ type: "file", file: { filename: "comprovante.pdf", file_data: dataUrl } }); plugins = [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }]; }
    else { ocrContent.push({ type: "image_url", image_url: { url: dataUrl } }); if (!VISION_OK.includes(imgMime)) ocrModels = GEMINI_ONLY.length ? GEMINI_ONLY : MODELS; }

    let o: any = null;
    try { o = grabJson(await openrouter([{ role: "user", content: ocrContent }], plugins, ocrModels)); }
    catch (err) { return json({ ok: false, error: "falha ao ler a imagem na IA", diagnostico: diag, detalhe: String((err as Error)?.message || err).slice(0, 220) }, 502); }
    if (!o) return json({ ok: false, error: "não consegui interpretar o comprovante", diagnostico: diag }, 422);

    const d: any = { colaborador: typeof o.colaborador === "string" ? o.colaborador.slice(0, 120) : null, fornecedor: typeof o.fornecedor === "string" ? o.fornecedor.slice(0, 120) : null, valor_brl: numOrNull(o.valor_brl), data: typeof o.data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.data) ? o.data : null, categoria: ALLOWED.includes(o.categoria) ? o.categoria : "Outros", descricao: typeof o.descricao === "string" ? o.descricao.slice(0, 200) : null, itens: Array.isArray(o.itens) ? o.itens.slice(0, 40).map((it: any) => ({ nome: String(it?.nome || "").slice(0, 120), valor: numOrNull(it?.valor) })).filter((it: any) => it.nome) : [] };
    if (d.valor_brl == null) { const soma = d.itens.reduce((s: number, it: any) => s + (it.valor || 0), 0); if (soma > 0) d.valor_brl = Math.round(soma * 100) / 100; }
    if (d.valor_brl == null) return json({ ok: false, error: "não consegui ler o valor do comprovante", diagnostico: diag, lido: { fornecedor: d.fornecedor, categoria: d.categoria, descricao: d.descricao, itens: d.itens } }, 422);

    const { data: politicas } = await supabase.from("politica").select("*").eq("empresa_id", empresa.id);
    let verdict = { status: "revisar", motivos: [] as string[], raciocinio: "" };
    try { const a = grabJson(await openrouter([{ role: "user", content: analysisPrompt(d, empresa.politica_texto || "", politicas || []) }])); if (a) verdict = { status: a.status === "revisar" ? "revisar" : "aprovar", motivos: Array.isArray(a.motivos) ? a.motivos.filter((m: any) => typeof m === "string").slice(0, 8) : [], raciocinio: typeof a.raciocinio === "string" ? a.raciocinio.slice(0, 400) : "" }; } catch (_) { /* */ }

    const pol = (politicas || []).find((p: any) => p.categoria === d.categoria);
    const limite = limiteCategoria(pol);
    const acima = limite != null && Number(d.valor_brl) > Number(limite);
    const precisaRevisar = acima || verdict.status === "revisar";
    const status = precisaRevisar ? "pendente" : "aprovada-n1";

    let comprovante: string | null = null;
    try { const ext = imgMime.includes("png") ? "png" : imgMime.includes("pdf") ? "pdf" : imgMime.includes("webp") ? "webp" : imgMime.includes("heic") ? "heic" : "jpg"; const path = `${empresa.id}/${Date.now()}-whatsapp.${ext}`; const up = await supabase.storage.from("comprovantes").upload(path, bytes, { contentType: imgMime, upsert: false }); if (!up.error) comprovante = path; } catch (_) { /* */ }

    const colaborador = colaboradorOverride || (d.colaborador && d.colaborador.trim()) || telefone || "WhatsApp";
    const motivos = [...(acima ? [`Acima do limite de R$ ${limite}`] : []), ...verdict.motivos];
    const { data: row, error: insErr } = await supabase.from("despesa").insert({ empresa_id: empresa.id, colaborador, centro_custo: "—", categoria: d.categoria, valor_brl: d.valor_brl, data: d.data || new Date().toISOString().slice(0, 10), observacao: [d.descricao, d.fornecedor].filter(Boolean).join(" — ") || null, comprovante, status, canal: "whatsapp", policy_kind: acima ? "acima" : "dentro", policy_excesso_brl: acima ? Number(d.valor_brl) - Number(limite) : null, ia: precisaRevisar ? "revisar" : "auto" }).select().single();
    if (insErr) return json({ ok: false, error: insErr.message }, 500);
    await supabase.from("audit_trail").insert({ empresa_id: empresa.id, despesa_id: row.id, evento: precisaRevisar ? "criada" : "aprovada-n1", canal: "whatsapp", ator: colaborador, dados: { valor_brl: d.valor_brl, categoria: d.categoria, status, motivos, raciocinio: verdict.raciocinio } });

    const aprovada = !precisaRevisar;
    const mensagem = aprovada ? `✅ Despesa registrada e *aprovada automaticamente*!\nColaborador: ${colaborador}\nCategoria: ${d.categoria}\nValor: R$ ${Number(d.valor_brl).toFixed(2)}` : `🔎 Despesa registrada e enviada para *análise*.\nColaborador: ${colaborador}\nCategoria: ${d.categoria}\nValor: R$ ${Number(d.valor_brl).toFixed(2)}\nMotivo: ${motivos.join("; ") || "revisão"}`;
    return json({ ok: true, status, aprovada, despesa: { id: row.id, colaborador, categoria: d.categoria, valor_brl: d.valor_brl }, motivos, raciocinio: verdict.raciocinio, mensagem });
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message || e) }, 500);
  }
});
