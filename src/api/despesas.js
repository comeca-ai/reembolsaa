import { supabase } from '@/lib/supabaseClient';
import { CATEGORIAS, limiteCategoria, avaliarLimite } from '@/lib/policy';

// Reexporta a lógica pura de política (mantém os imports existentes via @/api/despesas).
export { CATEGORIAS, limiteCategoria, avaliarLimite };

export const STATUS_LABELS = {
  pendente: 'Pendente',
  'aprovada-n1': 'Aprovada',
  paga: 'Paga',
  reprovada: 'Reprovada',
};

// Lista todas as despesas da empresa do usuário (RLS já filtra por tenant).
export async function listDespesas() {
  const { data, error } = await supabase
    .from('despesa')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Lista as políticas da empresa.
export async function listPoliticas() {
  const { data, error } = await supabase.from('politica').select('*');
  if (error) throw error;
  return data || [];
}

// Cria uma despesa no tenant. Calcula policy_kind/excesso vs. a política da categoria.
export async function createDespesa({ empresaId, userId, colaborador, centro_custo, categoria, valor_brl, data, observacao, comprovante, politicas = [], bloqueado = false, motivos = [] }) {
  const { limite, acima, excesso } = avaliarLimite({ categoria, valor_brl, politicas });

  // Aprovação automática só quando dentro do limite E sem violação qualitativa
  // (ex.: bebida alcoólica). Caso contrário, vai para análise.
  const precisaRevisar = acima || bloqueado;
  const status = precisaRevisar ? 'pendente' : 'aprovada-n1';

  const payload = {
    empresa_id: empresaId,
    created_by: userId,
    colaborador,
    centro_custo: centro_custo || '—',
    categoria,
    valor_brl,
    data,
    observacao: observacao || null,
    comprovante: comprovante || null,
    status,
    policy_kind: acima ? 'acima' : 'dentro',
    policy_excesso_brl: excesso,
    ia: precisaRevisar ? 'revisar' : (comprovante ? 'auto' : 'manual'),
  };

  const { data: row, error } = await supabase.from('despesa').insert(payload).select().single();
  if (error) throw error;

  await supabase.from('audit_trail').insert({
    empresa_id: empresaId,
    despesa_id: row.id,
    evento: precisaRevisar ? 'criada' : 'aprovada-n1',
    canal: precisaRevisar ? 'web' : 'automatico',
    ator: precisaRevisar ? colaborador : 'Política (automático)',
    dados: { valor_brl, categoria, policy_kind: payload.policy_kind, limite, excesso: payload.policy_excesso_brl, bloqueado, motivos },
  });

  return { ...row, _acima: acima, _bloqueado: bloqueado, _motivos: motivos, _limite: limite };
}

// Lê um File como data URL base64.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// OCR do comprovante via Edge Function -> campos da despesa.
export async function extrairRecibo(file) {
  const fileBase64 = await fileToBase64(file);
  const { data, error } = await supabase.functions.invoke('extrair-despesa', {
    body: { fileBase64, mime: file.type, filename: file.name },
  });
  if (error) {
    let detail = error.message;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) detail = ctx.error + (ctx.detail ? `: ${ctx.detail}` : '');
    } catch (_) { /* ignore */ }
    throw new Error(detail || 'Falha ao ler o comprovante');
  }
  if (data?.error) throw new Error(data.error);
  return data; // { fornecedor, valor_brl, data, categoria, descricao }
}

// Sobe o comprovante para o Storage isolado por empresa; retorna o path.
export async function uploadComprovante(file, empresaId) {
  const safeName = file.name.replace(/[^\w.\-]+/g, '_');
  const path = `${empresaId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('comprovantes').upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

// Aprova / reprova / paga uma despesa, registrando a trilha de auditoria.
// decisao: 'aprovar' | 'reprovar' | 'pagar'
export async function decidirDespesa({ empresaId, id, decisao, comentario, ator }) {
  const novoStatus =
    decisao === 'aprovar' ? 'aprovada-n1' :
    decisao === 'reprovar' ? 'reprovada' :
    decisao === 'pagar' ? 'paga' : null;
  if (!novoStatus) throw new Error('Decisão inválida');
  if (decisao === 'reprovar' && !comentario?.trim()) {
    throw new Error('Comentário obrigatório para reprovar');
  }

  const { data: row, error } = await supabase
    .from('despesa')
    .update({ status: novoStatus })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  await supabase.from('audit_trail').insert({
    empresa_id: empresaId,
    despesa_id: id,
    evento: novoStatus,
    canal: 'web',
    ator: ator || 'sistema',
    dados: { decisao, comentario: comentario || '' },
  });

  return row;
}
