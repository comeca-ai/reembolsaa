import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Convida colaboradores por e-mail (SMTP nativo do Supabase via inviteUserByEmail).
// Segurança: só admin convida, e a empresa vem SEMPRE do banco (do JWT do caller),
// nunca do payload — impede convidar para empresa de terceiros.
// Reenvio: se o e-mail já existe mas é um convidado PENDENTE (nunca aceitou), apaga
// e reconvida (reenvia o e-mail). Se for conta ativa, devolve mensagem clara.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const ALLOWED_ROLES = ["admin", "aprovador", "financeiro", "colaborador"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
const isEmailExists = (msg: string) => /already.*registered|already exists|email_exists/i.test(msg || "");

async function findUserByEmail(admin: any, email: string) {
  // Prefer direct lookup if supported by the client
  try {
    if (admin?.auth?.admin?.getUserByEmail) {
      const { data, error } = await admin.auth.admin.getUserByEmail(email);
      if (!error && data) return data.user ?? data;
      return null;
    }
  } catch (e) {
    // fallthrough to listUsers pagination
  }
  // Fallback: paginate listUsers (perPage 1000) until found or safety limit
  let page = 1;
  const perPage = 1000;
  for (; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ perPage, page });
    if (error || !data?.users) return null;
    const found = data.users.find((u: any) => (u.email || '').toLowerCase() === email);
    if (found) return found;
    if (data.users.length < perPage) break; // no more pages
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return json({ error: "Não autenticado" }, 401);

  // 1) Identifica o caller a partir do JWT.
  const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json({ error: "Não autenticado" }, 401);

  // 2) Cliente service-role para operações privilegiadas.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // 3) Caller precisa ser admin; empresa vem do banco (não do request).
  const { data: prof, error: profErr } = await admin
    .from("profiles").select("empresa_id, role").eq("id", user.id).maybeSingle();
  if (profErr) return json({ error: profErr.message }, 500);
  if (!prof || prof.role !== "admin" || !prof.empresa_id) {
    return json({ error: "Apenas administradores podem convidar." }, 403);
  }
  const empresaId = prof.empresa_id;

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const invites = Array.isArray(body?.invites) ? body.invites : [];
  const redirectTo = typeof body?.redirectTo === "string" ? body.redirectTo : undefined;
  if (!invites.length) return json({ error: "Nenhum convite enviado." }, 400);
  const inviteOpts = redirectTo ? { redirectTo } : undefined;

  const results: Array<{ email: string; ok: boolean; resent?: boolean; error?: string }> = [];

  for (const inv of invites) {
    const email = String(inv?.email ?? "").trim().toLowerCase();
    const role = ALLOWED_ROLES.includes(inv?.role) ? inv.role : "colaborador";
    // telefone-br: guardado como só dígitos; opcional.
    const telefone = String(inv?.telefone ?? "").replace(/\D/g, "");
    if (!email || !email.includes("@")) {
      results.push({ email, ok: false, error: "E-mail inválido" });
      continue;
    }

    // Convite pendente precisa existir ANTES do invite — o trigger handle_new_user
    // o lê ao criar o auth.user e liga o profile à empresa/papel.
    await admin.from("invitations").delete()
      .eq("empresa_id", empresaId).eq("email", email).is("accepted_at", null);
    const { data: invRow, error: insErr } = await admin.from("invitations")
      .insert({ empresa_id: empresaId, email, role, invited_by: user.id })
      .select("id").single();
    if (insErr) { results.push({ email, ok: false, error: insErr.message }); continue; }

    let { data: inviteData, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, inviteOpts);

    // E-mail já existe: distingue convidado pendente (reenvia) de conta ativa.
    if (inviteErr && isEmailExists(inviteErr.message)) {
      const existing = await findUserByEmail(admin, email);
      const pendente = existing && !existing.email_confirmed_at && !existing.last_sign_in_at;
      if (pendente) {
        // Reenvio: apaga o usuário pendente e reconvida (a invitation acima continua válida).
        // Registrar no log de auditoria (console) antes de deletar
        console.info(`Reenvio de convite: apagando usuário pendente ${existing.id} (${email}) solicitado por ${user.id}`);
        await admin.auth.admin.deleteUser(existing.id);
        const retry = await admin.auth.admin.inviteUserByEmail(email, inviteOpts);
        inviteErr = retry.error;
        inviteData = retry.data;
        if (!inviteErr) {
          if (telefone) await admin.from("profiles").update({ telefone }).eq("id", inviteData?.user?.id);
          results.push({ email, ok: true, resent: true });
          continue;
        }
      } else {
        await admin.from("invitations").delete().eq("id", invRow.id);
        results.push({ email, ok: false, error: "Este e-mail já tem conta ativa no sistema." });
        continue;
      }
    }

    if (inviteErr) {
      await admin.from("invitations").delete().eq("id", invRow.id);
      results.push({ email, ok: false, error: inviteErr.message });
      continue;
    }
    // Profile já existe (criado sincronamente pelo trigger handle_new_user no invite).
    if (telefone) await admin.from("profiles").update({ telefone }).eq("id", inviteData?.user?.id);
    results.push({ email, ok: true });
  }

  const sent = results.filter((r) => r.ok).length;
  const resent = results.filter((r) => r.resent).length;
  return json({ sent, resent, total: results.length, results });
});
