// Papéis canônicos do sistema — espelham o CHECK da coluna `role`
// nas tabelas `profiles` e `invitations` do banco. NÃO inventar valores aqui:
// qualquer papel fora desta lista quebra o constraint no insert.
export const ROLES = ["admin", "aprovador", "financeiro", "colaborador"];

export const DEFAULT_ROLE = "colaborador";

export const ROLE_LABELS = {
  admin: "Administrador",
  aprovador: "Aprovador",
  financeiro: "Financeiro",
  colaborador: "Colaborador",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Acesso total: gerencia usuários, política, relatórios e financeiro.",
  aprovador: "Visualiza e aprova despesas enviadas pelos colaboradores.",
  financeiro: "Acompanha pagamentos e relatórios financeiros das despesas.",
  colaborador: "Envia despesas para aprovação e acompanha o próprio histórico.",
};

// Estilos de badge por papel (classes Tailwind do design system).
export const ROLE_BADGE_STYLES = {
  admin: "border-primary/30 text-primary bg-primary/8",
  aprovador: "border-warning/30 text-warning bg-warning/8",
  financeiro: "border-chart-4/30 text-chart-4 bg-chart-4/8",
  colaborador: "border-border text-muted-foreground bg-secondary",
};

// Lista pronta para popular <Select> ([{ value, label }]).
export const ROLE_OPTIONS = ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }));
