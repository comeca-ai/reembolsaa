import { supabase } from '@/lib/supabaseClient';

// Lê um File como data URL base64.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Chama a Edge Function que lê o PDF (OCR/IA via OpenRouter) e devolve as regras.
export async function extrairPolitica(file) {
  const fileBase64 = await fileToBase64(file);
  const { data, error } = await supabase.functions.invoke('extrair-politica', {
    body: { fileBase64, filename: file.name },
  });
  if (error) {
    // Mensagem de erro da função, quando houver
    let detail = error.message;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) detail = ctx.error + (ctx.detail ? `: ${ctx.detail}` : '');
    } catch (_) { /* ignore */ }
    throw new Error(detail || 'Falha ao ler a política');
  }
  if (data?.error) throw new Error(data.error);
  return { rules: data?.rules || [], resumo: data?.resumo || '', politica_texto: data?.politica_texto || '' };
}

// Salva (upsert) as regras extraídas na tabela politica + o texto completo na empresa.
export async function salvarPoliticas(empresaId, rules, politicaTexto) {
  const rows = rules.map((r) => ({
    empresa_id: empresaId,
    categoria: r.categoria,
    diario_brl: r.diario_brl ?? null,
    por_noite_brl: r.por_noite_brl ?? null,
    teto_mes_brl: r.teto_mes_brl ?? null,
    documento: (r.observacao || 'Extraído da política por IA').slice(0, 300),
    restricoes: r.restricoes ? String(r.restricoes).slice(0, 600) : null,
  }));
  const { error } = await supabase
    .from('politica')
    .upsert(rows, { onConflict: 'empresa_id,categoria' });
  if (error) throw error;

  if (politicaTexto) {
    await supabase.from('empresa').update({ politica_texto: String(politicaTexto).slice(0, 8000) }).eq('id', empresaId);
  }
  return rows.length;
}

// Agente de análise de política: decide se a despesa pode ser aprovada ou precisa revisar.
export async function analisarDespesa({ despesa, politicaTexto, politicas }) {
  const { data, error } = await supabase.functions.invoke('analisar-despesa', {
    body: { despesa, politica_texto: politicaTexto || '', politicas: politicas || [] },
  });
  if (error) {
    let detail = error.message;
    try { const ctx = await error.context?.json?.(); if (ctx?.error) detail = ctx.error; } catch (_) { /* ignore */ }
    throw new Error(detail || 'Falha na análise da política');
  }
  // status: 'aprovar' | 'revisar'
  return { status: data?.status || 'revisar', motivos: data?.motivos || [], raciocinio: data?.raciocinio || '' };
}
