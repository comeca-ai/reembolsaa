import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Convida colaboradores por e-mail (SMTP nativo do Supabase via inviteUserByEmail).
// Segurança: só admin convida, e a empresa vem SEMPRE do banco (do JWT do caller),
// nunca do payload — impede convidar para empresa de terceiros.
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

  const results: Array<{ email: string; ok: boolean; error?: string }> = [];

  for (const inv of invites) {
    const email = String(inv?.email ?? "").trim().toLowerCase();
    const role = ALLOWED_ROLES.includes(inv?.role) ? inv.role : "colaborador";
    if (!email || !email.includes("@")) {
      results.push({ email, ok: false, error: "E-mail inválido" });
      continue;
    }

    // Remove convites pendentes antigos do mesmo e-mail/empresa (evita acúmulo).
    await admin.from("invitations").delete()
      .eq("empresa_id", empresaId).eq("email", email).is("accepted_at", null);

    // IMPORTANTE: a invitation precisa existir ANTES do invite — o trigger
    // handle_new_user lê a invitation ao criar o auth.user e liga o profile à empresa/papel.
    const { data: invRow, error: insErr } = await admin.from("invitations")
      .insert({ empresa_id: empresaId, email, role, invited_by: user.id })
      .select("id").single();
    if (insErr) {
      results.push({ email, ok: false, error: insErr.message });
      continue;
    }

    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, redirectTo ? { redirectTo } : undefined);
    if (inviteErr) {
      // Limpa a invitation pendente para não ficar pendurada.
      await admin.from("invitations").delete().eq("id", invRow.id);
      const msg = /already.*registered|already exists|email_exists/i.test(inviteErr.message)
        ? "Já existe uma conta com este e-mail."
        : inviteErr.message;
      results.push({ email, ok: false, error: msg });
      continue;
    }

    results.push({ email, ok: true });
  }

  const sent = results.filter((r) => r.ok).length;
  return json({ sent, total: results.length, results });
});
