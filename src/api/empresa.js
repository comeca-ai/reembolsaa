import { supabase } from "@/lib/supabaseClient";

// Campos cadastrais editáveis da empresa (Configurações → Dados da empresa).
// A RLS (empresa_admin_update) restringe a escrita ao admin da própria empresa,
// então o update vai direto pelo client.
const CAMPOS_EDITAVEIS = ["nome", "cnpj", "email_financeiro", "moeda", "inicio_ano_fiscal"];

// Lê os dados cadastrais da empresa do usuário (RLS: empresa_select_own).
export async function getEmpresa(empresaId) {
  const { data, error } = await supabase
    .from("empresa")
    .select("id, nome, cnpj, email_financeiro, moeda, inicio_ano_fiscal")
    .eq("id", empresaId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Atualiza os dados cadastrais. Aceita só os campos editáveis (ignora o resto)
// e nunca grava undefined. Retorna a linha atualizada.
export async function atualizarEmpresa(empresaId, campos) {
  const payload = {};
  for (const k of CAMPOS_EDITAVEIS) {
    if (campos?.[k] !== undefined) payload[k] = campos[k];
  }
  const { data, error } = await supabase
    .from("empresa")
    .update(payload)
    .eq("id", empresaId)
    .select("id, nome, cnpj, email_financeiro, moeda, inicio_ano_fiscal")
    .single();
  if (error) throw error;
  return data;
}
