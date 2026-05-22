// ─── Financial Overview mock data ─────────────────────────────────

export const BUDGET_BY_COST_CENTER = [
  { name: "Obras — SP",         budget: 80_000, spent: 54_200, pending: 6_400  },
  { name: "Comercial",          budget: 50_000, spent: 38_700, pending: 4_400  },
  { name: "Financeiro",         budget: 30_000, spent: 22_400, pending: 1_400  },
  { name: "Administrativo",     budget: 25_000, spent: 16_800, pending: 1_600  },
  { name: "TI",                 budget: 18_000, spent: 10_320, pending: 600    },
  { name: "RH",                 budget: 10_000, spent: 6_300,  pending: 500    },
];

export const PROCESSING_TIME_BY_MONTH = [
  { month: "Dez/25", avg_days: 4.1, p90_days: 7.8 },
  { month: "Jan/26", avg_days: 3.6, p90_days: 6.9 },
  { month: "Fev/26", avg_days: 3.9, p90_days: 7.2 },
  { month: "Mar/26", avg_days: 2.8, p90_days: 5.4 },
  { month: "Abr/26", avg_days: 2.5, p90_days: 4.9 },
  { month: "Mai/26", avg_days: 2.3, p90_days: 4.2 },
];

export const COMPLIANCE_BY_MONTH = [
  { month: "Dez/25", conforme: 68, excecao: 18, reprovado: 14 },
  { month: "Jan/26", conforme: 71, excecao: 17, reprovado: 12 },
  { month: "Fev/26", conforme: 66, excecao: 21, reprovado: 13 },
  { month: "Mar/26", conforme: 74, excecao: 16, reprovado: 10 },
  { month: "Abr/26", conforme: 79, excecao: 14, reprovado: 7  },
  { month: "Mai/26", conforme: 76, excecao: 15, reprovado: 9  },
];

export const PAYMENT_STATUS_DONUT = [
  { name: "Pagas",              value: 89_200 },
  { name: "Aprovadas (a pagar)",value: 31_400 },
  { name: "Pendentes",          value: 16_800 },
  { name: "Rejeitadas",         value: 11_320 },
];

export const FINANCIAL_KPIS = {
  total_budget:    { value: 213_000, label: "Orçamento mensal",        unit: "R$"  },
  total_spent:     { value: 148_720, label: "Executado",               unit: "R$"  },
  budget_used_pct: { value: 69.8,   label: "Orçamento utilizado",      unit: "%"   },
  awaiting_payment:{ value: 31_400, label: "Aguardando pagamento",     unit: "R$"  },
  avg_processing:  { value: 2.3,    label: "Tempo médio de reembolso", unit: "dias"},
  compliance_rate: { value: 76,     label: "Conformidade mensal",      unit: "%"   },
};