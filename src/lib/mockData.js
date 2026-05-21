// ─── Centralized mock data ───────────────────────────────────────
// Organized to map 1:1 to the future Supabase schema.
// Replace each section with a Supabase query when ready.

export const CURRENT_USER = {
  id: "u-001",
  name: "Mariana Costa",
  email: "mariana@construtecbr.com.br",
  company_id: "c-001",
};

export const LIMIT_UNIT_LABELS = {
  refeicao: "/refeição",
  diaria: "/diária",
  dia: "/dia",
  km: "/km",
  none: "sem teto",
};

// ─── AI extraction result shape ─────────────────────────────────
export const EXTRACTED_RULES = [
  {
    id: "r-01",
    category: "Alimentação",
    limit_amount: 80,
    limit_unit: "refeicao",
    conditions: "Dias úteis, com nota fiscal, até 2 refeições/dia",
    required_docs: "Nota fiscal",
  },
  {
    id: "r-02",
    category: "Hospedagem",
    limit_amount: 450,
    limit_unit: "diaria",
    conditions: "Capitais, pré-aprovação acima de 3 diárias",
    required_docs: "Reserva + nota",
  },
  {
    id: "r-03",
    category: "Transporte",
    limit_amount: 200,
    limit_unit: "dia",
    conditions: "App ou táxi, trajeto justificado",
    required_docs: "Recibo do app",
  },
  {
    id: "r-04",
    category: "Combustível",
    limit_amount: 1.2,
    limit_unit: "km",
    conditions: "Veículo próprio, rota validada por GPS",
    required_docs: "Odômetro",
  },
  {
    id: "r-05",
    category: "Material de obra",
    limit_amount: null,
    limit_unit: "none",
    conditions: "Exige centro de custo + aval do gestor",
    required_docs: "Nota + registro da obra",
  },
  {
    id: "r-06",
    category: "Representação",
    limit_amount: 350,
    limit_unit: "refeicao",
    conditions: "Reuniões com clientes, até 6 pessoas, pré-aprovação do diretor",
    required_docs: "Nota fiscal + lista de participantes",
  },
  {
    id: "r-07",
    category: "Software e licenças",
    limit_amount: 150,
    limit_unit: "dia",
    conditions: "Ferramentas aprovadas pelo TI, sem duplicidade de licenças",
    required_docs: "Comprovante de compra",
  },
  {
    id: "r-08",
    category: "Treinamento",
    limit_amount: 3000,
    limit_unit: "none",
    conditions: "Cursos presenciais ou online, aval do gestor imediato",
    required_docs: "Certificado + nota fiscal",
  },
  {
    id: "r-09",
    category: "Eventos corporativos",
    limit_amount: 5000,
    limit_unit: "none",
    conditions: "Feiras e congressos, pré-aprovação do financeiro",
    required_docs: "Inscrição + comprovante de presença",
  },
  {
    id: "r-10",
    category: "Telefonia",
    limit_amount: 120,
    limit_unit: "dia",
    conditions: "Plano corporativo, excedente justificado em viagem",
    required_docs: "Fatura do mês",
  },
  {
    id: "r-11",
    category: "Estacionamento",
    limit_amount: 40,
    limit_unit: "dia",
    conditions: "Uso em visita a cliente, justificado no relatório",
    required_docs: "Ticket do estacionamento",
  },
  {
    id: "r-12",
    category: "Correios e entregas",
    limit_amount: 60,
    limit_unit: "dia",
    conditions: "Envios de documentos ou amostras, aprovação do gestor",
    required_docs: "Comprovante de envio",
  },
  {
    id: "r-13",
    category: "Equipamentos de segurança",
    limit_amount: null,
    limit_unit: "none",
    conditions: "EPIs e EPCs obrigatórios, conforme NR vigente",
    required_docs: "Nota fiscal + certificado de aprovação",
  },
  {
    id: "r-14",
    category: "Passagem aérea",
    limit_amount: 2500,
    limit_unit: "none",
    conditions: "Classe econômica, antecedência mínima de 7 dias, menor tarifa disponível",
    required_docs: "Boarding pass + fatura",
  },
];

// ─── Version history ────────────────────────────────────────────
export const VERSION_HISTORY = [
  {
    id: "p-003",
    version: 3,
    status: "draft",
    file_name: "politica_2026.pdf",
    uploaded_by: "Mariana Costa",
    created_at: "2026-05-21T10:30:00Z",
    rules_count: 14,
  },
  {
    id: "p-002",
    version: 2,
    status: "archived",
    file_name: "politica_2025_v2.pdf",
    uploaded_by: "Carlos Almeida",
    created_at: "2025-08-14T15:22:00Z",
    rules_count: 11,
  },
  {
    id: "p-001",
    version: 1,
    status: "archived",
    file_name: "politica_2024.pdf",
    uploaded_by: "Mariana Costa",
    created_at: "2024-03-01T09:10:00Z",
    rules_count: 8,
  },
];

// ─── Empty rule template ────────────────────────────────────────
export const createEmptyRule = () => ({
  id: `r-new-${Date.now()}`,
  category: "",
  limit_amount: null,
  limit_unit: "none",
  conditions: "",
  required_docs: "",
});