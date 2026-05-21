// ─── Reports mock data ────────────────────────────────────────────

export const EXPENSE_BY_CATEGORY_MONTHLY = [
  { day: "01/05", Alimentação: 980,  Transporte: 640,  Hospedagem: 0,     Representação: 350, Combustível: 220 },
  { day: "02/05", Alimentação: 1240, Transporte: 820,  Hospedagem: 900,   Representação: 0,   Combustível: 310 },
  { day: "03/05", Alimentação: 760,  Transporte: 430,  Hospedagem: 0,     Representação: 0,   Combustível: 180 },
  { day: "05/05", Alimentação: 1100, Transporte: 910,  Hospedagem: 1800,  Representação: 520, Combustível: 0   },
  { day: "06/05", Alimentação: 870,  Transporte: 550,  Hospedagem: 0,     Representação: 0,   Combustível: 400 },
  { day: "07/05", Alimentação: 1320, Transporte: 670,  Hospedagem: 0,     Representação: 780, Combustível: 260 },
  { day: "08/05", Alimentação: 940,  Transporte: 1200, Hospedagem: 2700,  Representação: 0,   Combustível: 0   },
  { day: "09/05", Alimentação: 1080, Transporte: 480,  Hospedagem: 0,     Representação: 350, Combustível: 310 },
  { day: "12/05", Alimentação: 1450, Transporte: 760,  Hospedagem: 900,   Representação: 0,   Combustível: 220 },
  { day: "13/05", Alimentação: 880,  Transporte: 920,  Hospedagem: 0,     Representação: 680, Combustível: 180 },
  { day: "14/05", Alimentação: 1200, Transporte: 540,  Hospedagem: 1350,  Representação: 0,   Combustível: 0   },
  { day: "15/05", Alimentação: 1090, Transporte: 830,  Hospedagem: 0,     Representação: 520, Combustível: 370 },
  { day: "16/05", Alimentação: 740,  Transporte: 610,  Hospedagem: 0,     Representação: 0,   Combustível: 290 },
  { day: "19/05", Alimentação: 1380, Transporte: 990,  Hospedagem: 2250,  Representação: 350, Combustível: 0   },
  { day: "20/05", Alimentação: 960,  Transporte: 720,  Hospedagem: 0,     Representação: 820, Combustível: 440 },
  { day: "21/05", Alimentação: 1140, Transporte: 850,  Hospedagem: 1800,  Representação: 0,   Combustível: 300 },
];

export const EXPENSE_BY_DEPARTMENT_MONTHLY = [
  { day: "01/05", Obras: 1800, Comercial: 1200, Financeiro: 620,  Administrativo: 480, TI: 390, RH: 210 },
  { day: "02/05", Obras: 2400, Comercial: 980,  Financeiro: 840,  Administrativo: 320, TI: 260, RH: 0   },
  { day: "03/05", Obras: 1200, Comercial: 1540, Financeiro: 380,  Administrativo: 560, TI: 180, RH: 140 },
  { day: "05/05", Obras: 3100, Comercial: 1620, Financeiro: 720,  Administrativo: 410, TI: 580, RH: 0   },
  { day: "06/05", Obras: 1650, Comercial: 870,  Financeiro: 540,  Administrativo: 630, TI: 220, RH: 180 },
  { day: "07/05", Obras: 2200, Comercial: 2100, Financeiro: 480,  Administrativo: 290, TI: 340, RH: 0   },
  { day: "08/05", Obras: 4100, Comercial: 1340, Financeiro: 960,  Administrativo: 720, TI: 460, RH: 320 },
  { day: "09/05", Obras: 1890, Comercial: 1780, Financeiro: 620,  Administrativo: 480, TI: 0,   RH: 0   },
  { day: "12/05", Obras: 2560, Comercial: 1920, Financeiro: 840,  Administrativo: 560, TI: 390, RH: 240 },
  { day: "13/05", Obras: 1740, Comercial: 1460, Financeiro: 720,  Administrativo: 380, TI: 280, RH: 0   },
  { day: "14/05", Obras: 3200, Comercial: 1680, Financeiro: 540,  Administrativo: 640, TI: 520, RH: 160 },
  { day: "15/05", Obras: 2100, Comercial: 2240, Financeiro: 980,  Administrativo: 420, TI: 310, RH: 280 },
  { day: "16/05", Obras: 1480, Comercial: 960,  Financeiro: 460,  Administrativo: 510, TI: 180, RH: 0   },
  { day: "19/05", Obras: 3640, Comercial: 2100, Financeiro: 680,  Administrativo: 740, TI: 460, RH: 200 },
  { day: "20/05", Obras: 2180, Comercial: 1860, Financeiro: 820,  Administrativo: 390, TI: 340, RH: 0   },
  { day: "21/05", Obras: 2760, Comercial: 1540, Financeiro: 740,  Administrativo: 560, TI: 280, RH: 180 },
];

export const EXPENSE_BY_COLLABORATOR = [
  { name: "Carlos Almeida",   department: "Obras",         total: 14_820, count: 38, approved: 10_200, pending: 2_420, rejected: 2_200 },
  { name: "Rafael Souza",     department: "Obras",         total: 12_640, count: 31, approved: 9_800,  pending: 1_840, rejected: 1_000 },
  { name: "Fernanda Lima",    department: "Comercial",     total: 11_280, count: 26, approved: 8_900,  pending: 1_180, rejected: 1_200 },
  { name: "Bruno Mendes",     department: "TI",            total: 8_920,  count: 19, approved: 7_100,  pending: 980,   rejected: 840  },
  { name: "Mariana Costa",    department: "Financeiro",    total: 7_640,  count: 22, approved: 6_400,  pending: 740,   rejected: 500  },
  { name: "Tatiane Rocha",    department: "Administrativo",total: 6_320,  count: 18, approved: 4_900,  pending: 820,   rejected: 600  },
  { name: "Pedro Oliveira",   department: "Obras",         total: 9_140,  count: 24, approved: 7_200,  pending: 1_140, rejected: 800  },
  { name: "Ana Beatriz",      department: "Comercial",     total: 7_800,  count: 21, approved: 6_200,  pending: 980,   rejected: 620  },
  { name: "Lucas Ferreira",   department: "RH",            total: 5_200,  count: 14, approved: 4_100,  pending: 640,   rejected: 460  },
  { name: "Juliana Nunes",    department: "Financeiro",    total: 4_980,  count: 16, approved: 3_900,  pending: 580,   rejected: 500  },
];

export const CATEGORY_TOTALS = [
  { name: "Alimentação",    value: 28_400, count: 94 },
  { name: "Transporte",     value: 22_100, count: 71 },
  { name: "Hospedagem",     value: 38_600, count: 24 },
  { name: "Passagem aérea", value: 21_300, count: 11 },
  { name: "Representação",  value: 14_800, count: 18 },
  { name: "Treinamento",    value: 9_200,  count: 7  },
  { name: "Combustível",    value: 7_320,  count: 63 },
  { name: "Outros",         value: 7_000,  count: 24 },
];

export const REPORT_KPIS = {
  total_amount:    { value: 148_720, label: "Total do período",     unit: "R$",      delta: +9.4  },
  total_count:     { value: 312,     label: "Lançamentos",          unit: "despesas", delta: +18  },
  avg_ticket:      { value: 476.7,   label: "Ticket médio",         unit: "R$",      delta: -2.8 },
  top_category:    { value: "Hospedagem", label: "Maior categoria", unit: "",        delta: null },
};