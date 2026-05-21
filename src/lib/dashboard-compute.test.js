import { describe, it, expect } from 'vitest';
import { computeDashboard } from './dashboard-compute';

const sample = [
  // categoria, valor, status, policy_kind, centro, data, sefaz, comprovante
  { categoria: 'Alimentação', valor_brl: 100, status: 'aprovada-n1', policy_kind: 'dentro', centro_custo: 'Comercial', data: '2026-05-10', sefaz_kind: 'valida', comprovante: 'x', colaborador: 'Ana' },
  { categoria: 'Alimentação', valor_brl: 50, status: 'pendente', policy_kind: 'acima', policy_excesso_brl: 20, centro_custo: 'Comercial', data: '2026-05-12', sefaz_kind: 'na', comprovante: 'z', colaborador: 'Bia' },
  { categoria: 'Transporte', valor_brl: 200, status: 'paga', policy_kind: 'dentro', centro_custo: '—', data: '2026-04-10', sefaz_kind: 'duplicata', comprovante: 'y', colaborador: 'Caio' },
  { categoria: 'Transporte', valor_brl: 80, status: 'reprovada', policy_kind: 'dentro', centro_custo: 'TI', data: '2026-05-15', sefaz_kind: 'na', comprovante: 'w', colaborador: 'Davi' },
];

describe('computeDashboard', () => {
  it('lida com lista vazia sem quebrar', () => {
    const r = computeDashboard([]);
    expect(r.kpis.total_submitted.value).toBe(0);
    expect(r.kpis.total_amount.value).toBe(0);
    expect(r.kpis.approved_rate.value).toBe(0);
    expect(r.kpis.avg_ticket.value).toBe(0);
    expect(r.byCategory).toEqual([]);
    expect(r.byDepartment).toEqual([]);
    expect(r.trend).toEqual([]);
    expect(r.alerts).toEqual([]);
  });

  it('calcula os KPIs corretamente', () => {
    const { kpis } = computeDashboard(sample);
    expect(kpis.total_submitted.value).toBe(4);
    expect(kpis.total_amount.value).toBe(430);          // 100+50+200+80
    expect(kpis.approved_rate.value).toBe(50);          // (aprovada-n1 + paga) / 4 = 2/4
    expect(kpis.violations.value).toBe(2);              // 1 acima + 1 duplicata
    expect(kpis.pending_review.value).toBe(1);          // 1 pendente
    expect(kpis.avg_ticket.value).toBe(108);           // round(430/4) = 107.5 -> 108
  });

  it('agrupa por categoria e ordena por valor desc', () => {
    const { byCategory } = computeDashboard(sample);
    expect(byCategory).toEqual([
      { name: 'Transporte', value: 280, count: 2 },
      { name: 'Alimentação', value: 150, count: 2 },
    ]);
  });

  it('agrupa por centro de custo (—> "Sem centro") com somas por status', () => {
    const { byDepartment } = computeDashboard(sample);
    const dep = Object.fromEntries(byDepartment.map((d) => [d.department, d]));
    expect(dep['Comercial']).toMatchObject({ total: 150, approved: 100, pending: 50, rejected: 0 });
    expect(dep['Sem centro']).toMatchObject({ total: 200, approved: 200 });
    expect(dep['TI']).toMatchObject({ total: 80, rejected: 80 });
    // ordenado por total desc
    expect(byDepartment[0].department).toBe('Sem centro');
  });

  it('calcula a tendência de conformidade por mês', () => {
    const { trend } = computeDashboard(sample);
    expect(trend).toEqual([
      { month: 'Abr/26', score: 100 }, // 1 despesa, dentro
      { month: 'Mai/26', score: 67 },  // 3 despesas, 2 dentro -> 66.7 -> 67
    ]);
  });

  it('gera alertas das violações (acima/duplicata) ordenados por data desc', () => {
    const { alerts } = computeDashboard(sample);
    expect(alerts).toHaveLength(2);
    expect(alerts[0].date).toBe('2026-05-12'); // mais recente primeiro
    const dup = alerts.find((a) => a.type === 'duplicate');
    expect(dup).toBeTruthy();
    const overLimit = alerts.find((a) => a.id === sample[1].id || a.amount === 50);
    expect(overLimit.severity).toBe('high'); // excesso 20 sobre limite 30 = 67%
    expect(overLimit.limit).toBe(30);         // 50 - 20
  });
});
