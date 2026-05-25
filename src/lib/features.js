// Flags de funcionalidade.
//
// Módulos ainda baseados em dados MOCK (Financeiro, Relatórios, Detalhe de Alerta —
// ver src/lib/mocks/*). Mantidos ESCONDIDOS em produção até a integração real com o
// backend (ajustes.md Fase 4 / gate de sobrevivência: "nada mock em rota de produção").
//
// Para reativar: ponha `MOCK_MODULES_ENABLED = true` (ou, ao integrar de verdade,
// remova o flag e os redirects/filtros que dependem dele).
export const MOCK_MODULES_ENABLED = false;

// Rotas dos módulos mock — usadas para filtrar o menu e redirecionar as rotas.
export const MOCK_MODULE_PATHS = ["/financeiro", "/relatorios", "/alertas"];

// Esconde do menu os itens de módulos mock quando desligados.
export function visibleNavItems(items) {
  if (MOCK_MODULES_ENABLED) return items;
  return items.filter((i) => !MOCK_MODULE_PATHS.includes(i.path));
}
