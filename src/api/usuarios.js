import { supabase } from "@/lib/supabaseClient";
import { normalizarTelefone } from "@/lib/telefone";

// Lista a equipe da empresa e complementa com convites pendentes que ainda não
// apareceram em `profiles`. Isso evita "sumiço" visual quando o convite foi
// persistido em `invitations`, mas o profile ainda não existe/não foi ligado.
export async function listProfiles() {
  const [
    { data: profiles, error: profilesError },
    { data: invitations, error: invitationsError },
  ] = await Promise.all([
    // Usa a RPC porque o front não enxerga auth.users; ela já marca `pending`
    // via last_sign_in_at e escopa por empresa no banco.
    supabase.rpc("equipe_da_empresa"),
    supabase
      .from("invitations")
      .select("id, email, role, telefone, created_at, accepted_at")
      .is("accepted_at", null)
      .order("created_at", { ascending: true }),
  ]);

  if (profilesError) throw profilesError;
  if (invitationsError) throw invitationsError;

  const profileRows = profiles || [];
  const pendingEmails = new Set(
    profileRows
      .filter((row) => row?.email)
      .map((row) => String(row.email).trim().toLowerCase())
  );

  const invitationRows = (invitations || [])
    .filter((row) => row?.email)
    .filter((row) => !pendingEmails.has(String(row.email).trim().toLowerCase()))
    .map((row) => ({
      id: `invite:${row.id}`,
      invitation_id: row.id,
      entity_type: "invitation",
      nome: null,
      email: row.email,
      role: row.role,
      telefone: row.telefone || null,
      created_at: row.created_at,
      pending: true,
    }));

  const normalizedProfiles = profileRows.map((row) => ({
    ...row,
    profile_id: row.id,
    invitation_id: null,
    entity_type: "profile",
  }));

  return [...normalizedProfiles, ...invitationRows];
}

// Convida colaboradores por e-mail via Edge Function (admin-only no servidor).
// invites: [{ email, role, telefone? }]. redirectTo: URL da tela de aceite.
// O telefone é normalizado (só dígitos); vai vazio quando não informado.
export async function convidarUsuarios(invites, redirectTo) {
  // Espalha o item para manter campos futuros e injeta o telefone normalizado.
  const payload = (invites || []).map((i) => ({
    ...i,
    telefone: normalizarTelefone(i?.telefone),
  }));
  const { data, error } = await supabase.functions.invoke("convidar-usuario", {
    body: { invites: payload, redirectTo },
  });
  if (error) {
    let detail = error.message;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) detail = ctx.error;
    } catch (_) { /* ignore */ }
    throw new Error(detail || "Falha ao enviar convites");
  }
  if (data?.error) throw new Error(data.error);
  return data; // { sent, total, results }
}

// Atualiza o papel de um usuário (admin via RLS profiles_admin_manage).
export async function atualizarPapel(id, role) {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw error;
}

// Atualiza o telefone do profile (só dígitos). Retorna { error } no padrão
// do client Supabase, para o caller decidir como tratar a falha.
export async function atualizarTelefone(userId, telefone) {
  const { error } = await supabase
    .from("profiles")
    .update({ telefone: normalizarTelefone(telefone) })
    .eq("id", userId);
  return { error };
}

// Atualiza o papel de um convite ainda não aceito.
export async function atualizarPapelConvite(id, role) {
  const { error } = await supabase
    .from("invitations")
    .update({ role })
    .eq("id", id)
    .is("accepted_at", null);
  if (error) throw error;
}

// Remove o profile do usuário da empresa (admin via RLS).
export async function removerUsuario(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

// Remove um convite pendente que ainda não foi aceito.
export async function removerConvite(id) {
  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", id)
    .is("accepted_at", null);
  if (error) throw error;
}
