// Lógica de domínio da política de reembolso — PURA, sem dependências (testável).

// Categorias válidas (espelham o CHECK das tabelas politica/despesa no Postgres).
export const CATEGORIAS = ['Alimentação', 'Transporte', 'Hospedagem', 'KM', 'Outros'];

// Limite por-lançamento de uma categoria: diário (Alimentação/KM/Transporte),
// por noite (Hospedagem) ou teto mensal. Retorna null se não houver política.
export function limiteCategoria(politica) {
  if (!politica) return null;
  return politica.diario_brl ?? politica.por_noite_brl ?? politica.teto_mes_brl ?? null;
}

// Avalia uma despesa contra a política da categoria.
// Retorna { limite, acima, excesso }. `acima` = valor estritamente acima do limite.
export function avaliarLimite({ categoria, valor_brl, politicas = [] }) {
  const pol = (politicas || []).find((p) => p.categoria === categoria);
  const limite = limiteCategoria(pol);
  const valor = Number(valor_brl);
  const acima = limite != null && Number.isFinite(valor) && valor > Number(limite);
  const excesso = acima ? Math.round((valor - Number(limite)) * 100) / 100 : null;
  return { limite, acima, excesso };
}
