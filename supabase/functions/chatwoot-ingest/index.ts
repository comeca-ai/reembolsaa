import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding/base64";

// Adaptador de webhook do Chatwoot → pipeline de despesa.
// Fluxo: WhatsApp → Chatwoot (inbox) → este webhook (evento message_created) →
//   roteia pelo TELEFONE do contato → empresa → chama whatsapp-ingest (OCR + política + selo).
// - Só processa mensagem INBOUND com anexo de imagem (ignora texto e mensagens de saída).
// - Idempotente por id da mensagem (tabela webhook_dedupe) — webhook pode reenviar.
// - Número não cadastrado = ignora (não cria despesa).
// Secrets opcionais: CHATWOOT_WEBHOOK_SECRET (proteção via ?secret=) e
// CHATWOOT_API_TOKEN (se a URL do anexo exigir autenticação).
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("CHATWOOT_WEBHOOK_SECRET") || "";
const CHATWOOT_API_TOKEN = Deno.env.get("CHATWOOT_API_TOKEN") || "";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
function json(obj: unknown, status = 200) { return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
const onlyDigits = (s: unknown) => String(s || "").replace(/\D/g, "");

// O telefone do contato aparece em campos diferentes conforme a versão/inbox do Chatwoot.
function findPhone(body: any): string {
  const cands = [
    body?.sender?.phone_number,
    body?.conversation?.meta?.sender?.phone_number,
    body?.contact?.phone_number,
    body?.conversation?.contact_inbox?.source_id,
  ];
  for (const c of cands) { const d = onlyDigits(c); if (d.length >= 10) return d; }
  return "";
}
function findImageUrl(body: any): string {
  const atts = body?.attachments || body?.message?.attachments || [];
  if (Array.isArray(atts) && atts.length) {
    const img = atts.find((a: any) => (a?.file_type === "image" || /^image\//.test(a?.content_type || "")) && (a?.data_url || a?.thumb_url));
    if (img) return img.data_url || img.thumb_url;
    if (atts[0]?.data_url) return atts[0].data_url; // fallback: primeiro anexo (pode ser PDF)
  }
  return "";
}
function isIncoming(body: any): boolean {
  const mt = body?.message_type;
  return mt === "incoming" || mt === 0 || mt === "0" || mt == null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Método não suportado" }, 405);
  const u = new URL(req.url);
  if (WEBHOOK_SECRET && u.searchParams.get("secret") !== WEBHOOK_SECRET) return json({ ok: false, error: "unauthorized" }, 401);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.event && body.event !== "message_created") return json({ ok: true, ignored: `evento ${body.event}` });
    if (!isIncoming(body)) return json({ ok: true, ignored: "nao-inbound" });

    const msgId = String(body?.id ?? body?.message?.id ?? "");
    const telefone = findPhone(body);
    const imageUrl = findImageUrl(body);
    const nome = body?.sender?.name || body?.conversation?.meta?.sender?.name || null;
    if (!imageUrl) return json({ ok: true, ignored: "sem imagem" });
    if (!telefone) return json({ ok: true, ignored: "sem telefone do remetente" });

    // Idempotência: marca a mensagem como em-processamento. Conflito = já tratada.
    if (msgId) {
      const { error: dErr } = await supabase.from("webhook_dedupe").insert({ provider: "chatwoot", ext_id: msgId });
      if (dErr) { if (dErr.code === "23505") return json({ ok: true, dedup: true, msgId }); /* outro erro: segue mesmo assim */ }
    }
    const liberaDedupe = async () => { if (msgId) { try { await supabase.from("webhook_dedupe").delete().eq("provider", "chatwoot").eq("ext_id", msgId); } catch (_) { /* */ } } };

    // Roteamento por telefone → empresa (mesma regra do whatsapp-evolution).
    const { data: profs } = await supabase.from("profiles").select("nome, empresa_id, telefone").not("telefone", "is", null);
    const tel11 = telefone.slice(-11);
    const prof = (profs || []).find((p: any) => { const t = onlyDigits(p.telefone); return t === telefone || (tel11.length >= 10 && t.slice(-11) === tel11); });
    if (!prof) { await liberaDedupe(); return json({ ok: true, ignored: "telefone nao cadastrado", telefone }); }
    const { data: emp } = await supabase.from("empresa").select("nome, webhook_token").eq("id", prof.empresa_id).limit(1);
    const empresa = emp?.[0];
    if (!empresa?.webhook_token) { await liberaDedupe(); return json({ ok: false, error: "empresa sem token", empresa_id: prof.empresa_id }); }

    // Baixa o anexo do Chatwoot (com token se configurado) e converte p/ base64.
    let bytes: Uint8Array;
    try {
      const ir = await fetch(imageUrl, { headers: CHATWOOT_API_TOKEN ? { api_access_token: CHATWOOT_API_TOKEN } : {} });
      if (!ir.ok) { await liberaDedupe(); return json({ ok: false, error: `falha ao baixar anexo do chatwoot (${ir.status})` }, 502); }
      bytes = new Uint8Array(await ir.arrayBuffer());
    } catch (e) { await liberaDedupe(); return json({ ok: false, error: "erro ao baixar anexo: " + String((e as Error)?.message || e) }, 502); }

    // Encaminha p/ whatsapp-ingest (OCR + política + selo fiscal + insert da despesa).
    const fr = await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-ingest`, {
      method: "POST",
      headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ token: empresa.webhook_token, fileBase64: encodeBase64(bytes), telefone, colaborador: prof.nome || nome }),
    });
    const result = await fr.json().catch(() => ({ ok: false, error: "falha no processamento" }));
    if (result?.ok === false) await liberaDedupe(); // falhou → permite reprocessar no retry do Chatwoot
    return json({ ...result, empresa: empresa.nome, colaborador: prof.nome || nome, via: "chatwoot" });
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message || e) }, 500);
  }
});
