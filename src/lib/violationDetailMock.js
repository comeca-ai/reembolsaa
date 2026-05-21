// ─── Mock data for violation detail page ─────────────────────────

// Mock invoice images (using placeholder services)
export const MOCK_INVOICES = {
  "v-01": {
    id: "NF-2026-0831",
    fileName: "nota_fiscal_hospedagem_carlos.pdf",
    issuedBy: "Hotel Ibis São Paulo - Centro",
    issuedDate: "2026-05-19",
    amount: 820.00,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    items: [
      { desc: "Diária dupla (2 noites)", qty: 2, unit: 410.00, total: 820.00 },
    ],
  },
  "v-02": {
    id: null,
    fileName: null,
    issuedBy: null,
    issuedDate: null,
    amount: 240.00,
    imageUrl: null,
    items: [],
  },
  "v-03": {
    id: "NF-2026-0714",
    fileName: "nota_representacao_fernanda.pdf",
    issuedBy: "Restaurante Sal Grosso",
    issuedDate: "2026-05-19",
    amount: 520.00,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    items: [
      { desc: "Jantar de negócios (4 pessoas)", qty: 1, unit: 520.00, total: 520.00 },
    ],
  },
  "v-04": {
    id: "REC-2026-0091",
    fileName: "recibo_software_bruno.pdf",
    issuedBy: "Adobe Systems — Creative Cloud",
    issuedDate: "2026-05-18",
    amount: 890.00,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
    items: [
      { desc: "Assinatura Creative Cloud Anual", qty: 1, unit: 890.00, total: 890.00 },
    ],
  },
  "v-05": {
    id: null,
    fileName: null,
    issuedBy: null,
    issuedDate: null,
    amount: 310.00,
    imageUrl: null,
    items: [],
  },
  "v-06": {
    id: "NF-2026-0533",
    fileName: "nota_almoco_mariana.pdf",
    issuedBy: "Padaria Central Ltda",
    issuedDate: "2026-05-16",
    amount: 75.00,
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80",
    items: [
      { desc: "Almoço executivo", qty: 1, unit: 75.00, total: 75.00 },
    ],
  },
  "v-07": {
    id: "REC-2026-0055",
    fileName: "recibo_combustivel_carlos.pdf",
    issuedBy: "Posto Ipiranga - Mooca",
    issuedDate: "2026-05-15",
    amount: 180.00,
    imageUrl: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=600&q=80",
    items: [
      { desc: "Abastecimento — 30L gasolina", qty: 30, unit: 6.00, total: 180.00 },
    ],
  },
};

// ─── Approval history by category ────────────────────────────────
export const APPROVAL_HISTORY_BY_CATEGORY = {
  "Hospedagem": [
    { id: "exp-211", employee: "Carlos Almeida", date: "2026-04-12", amount: 450, status: "approved", note: "Dentro do limite de R$ 450/noite." },
    { id: "exp-188", employee: "Lucas Barros",   date: "2026-03-28", amount: 390, status: "approved", note: "Hotel credenciado." },
    { id: "exp-143", employee: "Carlos Almeida", date: "2026-02-19", amount: 510, status: "rejected", note: "Acima do limite sem pré-aprovação." },
    { id: "exp-091", employee: "Ana Paula",       date: "2026-01-08", amount: 420, status: "approved", note: "Justificativa de obra aceita." },
  ],
  "Alimentação": [
    { id: "exp-300", employee: "Rafael Souza",  date: "2026-05-10", amount: 85,  status: "approved", note: "Nota fiscal presente." },
    { id: "exp-276", employee: "Mariana Costa", date: "2026-04-22", amount: 75,  status: "approved", note: "Dentro do limite." },
    { id: "exp-251", employee: "Rafael Souza",  date: "2026-04-05", amount: 240, status: "rejected", note: "Sem nota fiscal." },
    { id: "exp-198", employee: "João Ferreira", date: "2026-03-17", amount: 95,  status: "approved", note: "Recibo digital aceito." },
    { id: "exp-167", employee: "Mariana Costa", date: "2026-02-28", amount: 75,  status: "flagged",  note: "Possível duplicidade investigada." },
  ],
  "Representação": [
    { id: "exp-290", employee: "Fernanda Lima", date: "2026-04-30", amount: 310, status: "approved", note: "Dentro do limite R$ 350." },
    { id: "exp-244", employee: "Pedro Alves",   date: "2026-03-14", amount: 480, status: "rejected", note: "Sem aprovação prévia do diretor." },
    { id: "exp-201", employee: "Fernanda Lima", date: "2026-02-11", amount: 280, status: "approved", note: "Jantar com cliente registrado." },
  ],
  "Software e licenças": [
    { id: "exp-260", employee: "Ana Clara",   date: "2026-04-03", amount: 299, status: "approved", note: "Aprovado pelo gestor de TI." },
    { id: "exp-220", employee: "Bruno Mendes",date: "2026-03-10", amount: 150, status: "approved", note: "Licença de desenvolvimento." },
    { id: "exp-175", employee: "Bruno Mendes",date: "2026-01-22", amount: 890, status: "rejected", note: "Sem aprovação prévia — acima de R$ 500." },
  ],
  "Transporte": [
    { id: "exp-295", employee: "Tatiane Rocha", date: "2026-05-07", amount: 180, status: "approved", note: "Corrida com recibo Uber." },
    { id: "exp-268", employee: "Tatiane Rocha", date: "2026-04-15", amount: 310, status: "flagged",  note: "Recibo ausente — pendente." },
    { id: "exp-230", employee: "Lucas Barros",  date: "2026-03-22", amount: 95,  status: "approved", note: "Recibo Taxi presente." },
  ],
  "Combustível": [
    { id: "exp-280", employee: "Carlos Almeida", date: "2026-04-28", amount: 140, status: "approved", note: "Rota validada no mapa." },
    { id: "exp-252", employee: "Carlos Almeida", date: "2026-04-10", amount: 180, status: "rejected", note: "Rota não corresponde ao destino." },
    { id: "exp-210", employee: "José Santos",    date: "2026-03-05", amount: 120, status: "approved", note: "Dentro do limite e rota OK." },
  ],
};

// ─── Policy-based action suggestions ─────────────────────────────
export const ACTION_SUGGESTIONS = {
  "over_limit": {
    icon: "AlertTriangle",
    title: "Despesa acima do limite de política",
    steps: [
      "Solicitar justificativa formal ao colaborador via e-mail.",
      "Verificar se há pré-aprovação de gestor imediato para o excesso.",
      "Se não houver aprovação, rejeitar e devolver ao colaborador para ajuste.",
      "Registrar ocorrência no histórico do colaborador para análise de padrão.",
    ],
    policyRef: "Política de Reembolso — Seção 4.2: Limites por Categoria",
    canApproveException: true,
  },
  "missing_docs": {
    icon: "FileX",
    title: "Documentação obrigatória ausente",
    steps: [
      "Notificar o colaborador que o lançamento está bloqueado por falta de documentação.",
      "Conceder prazo de 5 dias úteis para anexar a nota fiscal ou recibo.",
      "Se não houver envio no prazo, rejeitar automaticamente a despesa.",
      "Despesas sem documentação não são ressarcíveis conforme política vigente.",
    ],
    policyRef: "Política de Reembolso — Seção 3.1: Documentos Obrigatórios",
    canApproveException: false,
  },
  "no_approval": {
    icon: "ShieldOff",
    title: "Compra realizada sem aprovação prévia",
    steps: [
      "Verificar se o gestor imediato possui conhecimento da compra.",
      "Solicitar aprovação retroativa com justificativa de urgência, se aplicável.",
      "Despesas acima de R$ 500 exigem aprovação prévia do gestor e do financeiro.",
      "Em caso de reincidência, escalar para o comitê de compliance.",
    ],
    policyRef: "Política de Reembolso — Seção 5.3: Fluxo de Aprovações",
    canApproveException: true,
  },
  "duplicate": {
    icon: "Copy",
    title: "Possível lançamento duplicado",
    steps: [
      "Comparar nota fiscal, valor e data com o lançamento anterior suspeito.",
      "Solicitar ao colaborador confirmação se trata-se de despesa distinta.",
      "Bloquear reembolso do segundo lançamento até confirmação.",
      "Caso confirmada a duplicidade, rejeitar e registrar advertência.",
    ],
    policyRef: "Política de Reembolso — Seção 6.1: Controle Anti-Fraude",
    canApproveException: false,
  },
};