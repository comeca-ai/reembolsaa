import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Webhook UNICO da Evolution (um numero p/ todos os clientes).
// Roteia a despesa pelo TELEFONE do remetente -> profiles.telefone -> empresa.
// Numero nao cadastrado = recusa (nao cria despesa).
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
function json(obj: unknown, status = 200) { return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
const onlyDigits = (s: unknown) => String(s || "").replace(/\D/g, "");

function findBase64(obj: any, depth = 0): string | null {
  if (obj == null || depth > 8) return null;
  if (typeof obj === "string") { const s = obj.startsWith("data:") ? (obj.split(",")[1] || "") : obj; if (s.length > 3000 && /^[A-Za-z0-9+/=_\-\s]+$/.test(s.slice(0, 120))) return obj; return null; }
  if (Array.isArray(obj)) { for (const v of obj) { const r = findBase64(v, depth + 1); if (r) return r; } return null; }
  if (typeof obj === "object") { for (const k of ["base64", "mediaBase64", "buffer", "data", "media"]) { if (obj[k] != null) { const r = findBase64(obj[k], depth + 1); if (r) return r; } } for (const k of Object.keys(obj)) { const r = findBase64(obj[k], depth + 1); if (r) return r; } }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Método não suportado" }, 405);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  try {
    const body = await req.json().catch(() => ({}));
    const d = body?.data || (body?.body && body.body.data) || body;
    if (d?.key?.fromMe === true) return json({ ok: true, ignored: "fromMe" });
    const remoteJid = d?.key?.remoteJid || d?.remoteJid || "";
    const telefone = onlyDigits(String(remoteJid).split("@")[0]);
    const instance = body?.instance || body?.body?.instance || d?.instance || "";
    let fileBase64 = findBase64(body);

    // Credenciais Evolution COMPARTILHADAS (um numero so p/ todos os clientes)
    const { data: evoRows } = await supabase.from("empresa")
      .select("evolution_url, evolution_apikey, evolution_instance")
      .not("evolution_apikey", "is", null).not("evolution_url", "is", null).limit(1);
    const evo = evoRows?.[0] || null;
    const evoInstance = instance || evo?.evolution_instance || "";
    const evoUrl = evo?.evolution_url ? String(evo.evolution_url).replace(/\/$/, "") : "";

    async function reply(text: string) {
      if (evoUrl && evo?.evolution_apikey && evoInstance && telefone) {
        try { await fetch(`${evoUrl}/message/sendText/${evoInstance}`, { method: "POST", headers: { apikey: evo.evolution_apikey, "Content-Type": "application/json" }, body: JSON.stringify({ number: telefone, text }) }); } catch (_) { /* */ }
      }
    }

    // Baixa a midia se nao veio base64 no payload
    if (!fileBase64 && evoUrl && evo?.evolution_apikey && evoInstance && d?.key) {
      try { const mr = await fetch(`${evoUrl}/chat/getBase64FromMediaMessage/${evoInstance}`, { method: "POST", headers: { apikey: evo.evolution_apikey, "Content-Type": "application/json" }, body: JSON.stringify({ message: { key: d.key } }) }); if (mr.ok) { const mj = await mr.json(); fileBase64 = findBase64(mj) || mj?.base64 || null; } } catch (_) { /* */ }
    }
    if (!fileBase64) return json({ ok: true, ignored: "sem imagem" });
    if (!telefone) return json({ ok: true, ignored: "sem telefone do remetente" });

    // ROTEAMENTO POR TELEFONE: empresa vem do remetente cadastrado em profiles.telefone
    const { data: profs } = await supabase.from("profiles").select("nome, empresa_id, telefone").not("telefone", "is", null);
    const tel11 = telefone.slice(-11);
    const prof = (profs || []).find((p: any) => { const t = onlyDigits(p.telefone); return t === telefone || (tel11.length >= 10 && t.slice(-11) === tel11); });
    if (!prof) {
      await reply("⚠️ Seu número ainda não está cadastrado no Reembolsaí. Peça ao admin da sua empresa para cadastrar seu WhatsApp.");
      return json({ ok: true, ignored: "telefone nao cadastrado", telefone });
    }
    const { data: emp } = await supabase.from("empresa").select("nome, webhook_token").eq("id", prof.empresa_id).limit(1);
    const empresa = emp?.[0];
    if (!empresa?.webhook_token) { await reply("⚠️ Sua empresa está sem configuração. Fale com o suporte."); return json({ ok: false, error: "empresa sem token", empresa_id: prof.empresa_id }); }

    // Encaminha p/ a ingest com o token do tenant CORRETO + nome do colaborador
    const ir = await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-ingest`, { method: "POST", headers: { apikey: ANON_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ token: empresa.webhook_token, fileBase64, telefone, colaborador: prof.nome }) });
    const result = await ir.json().catch(() => ({ ok: false, error: "falha no processamento" }));
    if (result?.mensagem) await reply(result.mensagem);
    return json({ ...result, empresa: empresa.nome, colaborador: prof.nome });
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message || e) }, 500);
  }
});
