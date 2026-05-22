// ─── Dashboard / Compliance mock data ────────────────────────────
// Designed to map to future Supabase views/queries.

export const KPI_DATA = {
  total_submitted:    { value: 312,        delta: +18,    label: "Despesas submetidas",    unit: "este mês" },
  total_amount:       { value: 148_720,    delta: +9.4,   label: "Volume total",           unit: "R$" },
  approved_rate:      { value: 76.4,       delta: -2.1,   label: "Taxa de aprovação",      unit: "%" },
  violations:         { value: 34,         delta: +7,     label: "Alertas de violação",    unit: "este mês" },
  avg_processing:     { value: 2.3,        delta: -0.4,   label: "Tempo médio de análise", unit: "dias" },
  pending_review:     { value: 41,         delta: +12,    label: "Aguardando revisão",     unit: "despesas" },
};

// ─── Expenses by category (donut) ───────────────────────────────
export const EXPENSES_BY_CATEGORY = [
  { name: "Alimentação",          value: 28_400, count: 94 },
  { name: "Transporte",           value: 22_100, count: 71 },
  { name: "Hospedagem",           value: 38_600, count: 24 },
  { name: "Passagem aérea",       value: 21_300, count: 11 },
  { name: "Representação",        value: 14_800, count: 18 },
  { name: "Treinamento",          value: 9_200,  count: 7  },
  { name: "Combustível",          value: 7_320,  count: 63 },
  { name: "Outros",               value: 7_000,  count: 24 },
];

// ─── Volume by department (horizontal bar) ──────────────────────
export const VOLUME_BY_DEPARTMENT = [
  { department: "Obras",         total: 54_200, approved: 41_000, rejected: 6_800,  pending: 6_400  },
  { department: "Comercial",     total: 38_700, approved: 31_200, rejected: 3_100,  pending: 4_400  },
  { department: "Financeiro",    total: 22_400, approved: 19_800, rejected: 1_200,  pending: 1_400  },
  { department: "Administrativo",total: 16_800, approved: 13_400, rejected: 1_800,  pending: 1_600  },
  { department: "TI",            total: 10_320, approved: 8_900,  rejected: 820,    pending: 600    },
  { department: "RH",            total: 6_300,  approved: 5_200,  rejected: 600,    pending: 500    },
];

// ─── Compliance score over time (area chart) ────────────────────
export const COMPLIANCE_TREND = [
  { month: "Dez/25", score: 71 },
  { month: "Jan/26", score: 74 },
  { month: "Fev/26", score: 69 },
  { month: "Mar/26", score: 78 },
  { month: "Abr/26", score: 82 },
  { month: "Mai/26", score: 76 },
];

// ─── Violation alerts ────────────────────────────────────────────
// type: "over_limit" | "missing_docs" | "no_approval" | "duplicate"
export const VIOLATION_ALERTS = [
  {
    id: "v-01",
    type: "over_limit",
    severity: "high",
    employee: "Carlos Almeida",
    department: "Obras",
    category: "Hospedagem",
    amount: 820,
    limit: 450,
    date: "2026-05-20",
    description: "Despesa 143% acima do limite de R$ 450/diária",
  },
  {
    id: "v-02",
    type: "missing_docs",
    severity: "high",
    employee: "Rafael Souza",
    department: "Obras",
    category: "Alimentação",
    amount: 240,
    limit: null,
    date: "2026-05-20",
    description: "Nota fiscal ausente (3 lançamentos)",
  },
  {
    id: "v-03",
    type: "over_limit",
    severity: "medium",
    employee: "Fernanda Lima",
    department: "Comercial",
    category: "Representação",
    amount: 520,
    limit: 350,
    date: "2026-05-19",
    description: "Despesa 49% acima do limite de R$ 350/refeição",
  },
  {
    id: "v-04",
    type: "no_approval",
    severity: "medium",
    employee: "Bruno Mendes",
    department: "TI",
    category: "Software e licenças",
    amount: 890,
    limit: null,
    date: "2026-05-18",
    description: "Compra sem aprovação prévia do gestor",
  },
  {
    id: "v-05",
    type: "missing_docs",
    severity: "medium",
    employee: "Tatiane Rocha",
    department: "Administrativo",
    category: "Transporte",
    amount: 310,
    limit: null,
    date: "2026-05-17",
    description: "Recibo do app ausente",
  },
  {
    id: "v-06",
    type: "duplicate",
    severity: "low",
    employee: "Mariana Costa",
    department: "Financeiro",
    category: "Alimentação",
    amount: 75,
    limit: null,
    date: "2026-05-16",
    description: "Possível duplicidade — mesma nota, mesmo valor, mesmo dia",
  },
  {
    id: "v-07",
    type: "over_limit",
    severity: "low",
    employee: "Carlos Almeida",
    department: "Obras",
    category: "Combustível",
    amount: 180,
    limit: null,
    date: "2026-05-15",
    description: "Rota não validada por GPS",
  },
];

export const VIOLATION_TYPE_LABELS = {
  over_limit:   "Acima do limite",
  missing_docs: "Doc. ausente",
  no_approval:  "Sem aprovação",
  duplicate:    "Duplicidade",
};

export const CHART_COLORS = [
  "#C8F55A", // lime  (primary)
  "#F2C14A", // amber (warning)
  "#FF7065", // red   (destructive)
  "#60C4F4", // blue
  "#A78BFA", // violet
  "#34D399", // emerald
  "#FB923C", // orange
  "#9A9A93", // muted
];