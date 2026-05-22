import { supabase } from "@/lib/supabaseClient";

// Lista a equipe da empresa já com a flag `pending` (convite não aceito).
// Usa a RPC equipe_da_empresa (SECURITY DEFINER) porque o front não enxerga
// auth.users; a função escopa por empresa via current_empresa_id().
export async function listProfiles() {
  const { data, error } = await supabase.rpc("equipe_da_empresa");
  if (error) throw error;
  return data || [];
}

// Convida colaboradores por e-mail via Edge Function (admin-only no servidor).
// invites: [{ email, role }]. redirectTo: URL da tela de aceite.
export async function convidarUsuarios(invites, redirectTo) {
  const { data, error } = await supabase.functions.invoke("convidar-usuario", {
    body: { invites, redirectTo },
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

// Remove o profile do usuário da empresa (admin via RLS).
export async function removerUsuario(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}
