// Computa as estruturas do Dashboard a partir das despesas reais do tenant.
// Mantém os mesmos formatos que os componentes de gráfico já esperam.

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const APROVADA = ['aprovada-n1', 'paga'];

const num = (v) => Number(v) || 0;

export function computeDashboard(despesas = []) {
  const total = despesas.length;
  const soma = despesas.reduce((s, d) => s + num(d.valor_brl), 0);
  const aprovadas = despesas.filter((d) => APROVADA.includes(d.status));
  const pendentes = despesas.filter((d) => d.status === 'pendente');
  const violacoes = despesas.filter(
    (d) => d.policy_kind === 'acima' || ['duplicata', 'cancelada'].includes(d.sefaz_kind)
  );
  const ticket = total ? soma / total : 0;

  const kpis = {
    total_submitted: { label: 'Despesas submetidas', value: total, unit: 'no total', delta: null, format: 'number' },
    total_amount: { label: 'Volume total', value: Math.round(soma), unit: 'R$', delta: null, format: 'currency' },
    approved_rate: { label: 'Taxa de aprovação', value: total ? +((aprovadas.length / total) * 100).toFixed(1) : 0, unit: '%', delta: null, format: 'percent' },
    violations: { label: 'Alertas de violação', value: violacoes.length, unit: 'fora da política', delta: null, format: 'number' },
    pending_review: { label: 'Aguardando revisão', value: pendentes.length, unit: 'despesas', delta: null, format: 'number' },
    avg_ticket: { label: 'Ticket médio', value: Math.round(ticket), unit: 'R$', delta: null, format: 'currency' },
  };

  // Por categoria (donut)
  const catMap = {};
  for (const d of despesas) {
    const k = d.categoria || 'Outros';
    catMap[k] = catMap[k] || { name: k, value: 0, count: 0 };
    catMap[k].value += num(d.valor_brl);
    catMap[k].count += 1;
  }
  const byCategory = Object.values(catMap).sort((a, b) => b.value - a.value);

  // Por centro de custo (barras)
  const depMap = {};
  for (const d of despesas) {
    const k = (!d.centro_custo || d.centro_custo === '—') ? 'Sem centro' : d.centro_custo;
    depMap[k] = depMap[k] || { department: k, total: 0, approved: 0, rejected: 0, pending: 0 };
    const v = num(d.valor_brl);
    depMap[k].total += v;
    if (APROVADA.includes(d.status)) depMap[k].approved += v;
    else if (d.status === 'reprovada') depMap[k].rejected += v;
    else depMap[k].pending += v;
  }
  const byDepartment = Object.values(depMap).sort((a, b) => b.total - a.total);

  // Tendência de conformidade por mês (últimos 6 meses com dados)
  const trendMap = {};
  for (const d of despesas) {
    if (!d.data) continue;
    const dt = new Date(d.data);
    if (Number.isNaN(dt.getTime())) continue;
    const key = `${dt.getFullYear()}-${String(dt.getMonth()).padStart(2, '0')}`;
    trendMap[key] = trendMap[key] || { key, ano: dt.getFullYear(), mes: dt.getMonth(), total: 0, dentro: 0 };
    trendMap[key].total += 1;
    if (d.policy_kind !== 'acima') trendMap[key].dentro += 1;
  }
  const trend = Object.values(trendMap)
    .sort((a, b) => (a.ano - b.ano) || (a.mes - b.mes))
    .slice(-6)
    .map((m) => ({
      month: `${MESES[m.mes]}/${String(m.ano).slice(2)}`,
      score: m.total ? Math.round((m.dentro / m.total) * 100) : 0,
    }));

  // Alertas de violação (lista)
  const alerts = violacoes
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA;
    })
    .slice(0, 12)
    .map((d) => {
      const excesso = num(d.policy_excesso_brl);
      const limite = excesso ? num(d.valor_brl) - excesso : null;
      const type = d.sefaz_kind === 'duplicata' ? 'duplicate'
        : d.sefaz_kind === 'cancelada' ? 'missing_docs'
        : !d.comprovante ? 'missing_docs'
        : 'over_limit';
      const ratio = limite ? excesso / limite : 0;
      const severity = ratio > 0.5 ? 'high' : ratio > 0.2 ? 'medium' : 'low';
      return {
        id: d.id,
        type,
        severity,
        employee: d.colaborador,
        department: (!d.centro_custo || d.centro_custo === '—') ? 'Sem centro' : d.centro_custo,
        category: d.categoria,
        amount: num(d.valor_brl),
        limit: limite,
        date: d.data,
        description:
          type === 'over_limit' && limite
            ? `Despesa R$ ${num(d.valor_brl).toLocaleString('pt-BR')} acima do limite de R$ ${limite.toLocaleString('pt-BR')}`
            : type === 'duplicate' ? 'Possível duplicidade de nota fiscal'
            : type === 'missing_docs' ? 'Comprovante ausente ou inválido'
            : 'Fora da política',
      };
    });

  return { kpis, byCategory, byDepartment, trend, alerts };
}
