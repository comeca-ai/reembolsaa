# Plano Final de Execucao

Este documento define a versao final do projeto.

Objetivo principal:
- consolidar o Reembolsaaí como produto final em Supabase/Vercel
- eliminar qualquer heranca tecnica, visual ou documental de Base44
- transformar os pontos levantados em tarefas executaveis

## Fase 1 - Remocao total de Base44

- [ ] Remover `@base44/sdk` e `@base44/vite-plugin` do projeto.
  Arquivos: `package.json`, `package-lock.json`

- [ ] Remover o plugin Base44 da configuracao de build.
  Arquivo: `vite.config.js`

- [ ] Renomear o projeto para a identidade final do produto.
  Arquivo: `package.json`

- [ ] Reescrever o `README.md` para o stack real do produto.
  Conteudo esperado:
  setup local, envs do Supabase, scripts, build, deploy, fluxo multi-tenant
  Arquivo: `README.md`

- [ ] Revisar o codigo em busca de imports, comentarios, mensagens e nomenclaturas que ainda mencionem Base44.
  Escopo: codigo fonte e documentacao

## Fase 2 - Infraestrutura de UX consistente

- [ ] Padronizar o sistema de toast em uma unica implementacao.
  Decidir entre manter `sonner` ou manter o toaster atual, mas nao ambos.
  Arquivos: `src/App.jsx`, `src/components/ui/toaster.jsx`, `src/components/ui/sonner.jsx`

- [ ] Atualizar todas as telas que usam toast para a implementacao escolhida.
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/violation/ActionSuggestionPanel.jsx`, `src/components/violation/QuickApprovalModal.jsx`

- [ ] Unificar a estrategia de tema.
  Remover dependencia paralela de `next-themes` e manter uma unica fonte de verdade.
  Arquivos: `src/lib/ThemeContext.jsx`, `src/components/ThemeToggle.jsx`, `src/components/ui/sonner.jsx`

## Fase 3 - Configuracoes reais da empresa

- [ ] Corrigir a divergencia entre empresa real da sessao e empresa exibida/editada em configuracoes.
  Hoje o nome mostrado na sidebar vem de `empresa.nome` carregado a partir de `profiles.empresa_id`, enquanto `CompanySettings` usa dados mock locais. Isso pode fazer o usuario ver uma empresa real na sessao e outra diferente na tela de configuracoes.
  Arquivos: `src/lib/AuthContext.jsx`, `src/components/layout/Sidebar.jsx`, `src/components/settings/CompanySettings.jsx`

- [ ] Persistir os dados da empresa no backend.
  `CompanySettings` nao pode mais usar dados hardcoded nem salvar apenas em memoria.
  Arquivos: `src/components/settings/CompanySettings.jsx`, backend/Supabase relacionado

- [ ] Persistir setores, cargos e tags da empresa no backend.
  `TagManager` precisa sair de `useState` local e usar dados reais por `empresa_id`.
  Arquivos: `src/pages/SettingsPage.jsx`, `src/components/settings/TagManager.jsx`, backend/Supabase relacionado

- [ ] Alinhar a modelagem de usuarios com a modelagem de configuracoes.
  Hoje a tela promete setor/departamento, mas `UsersPage` ainda usa placeholder.
  Arquivos: `src/pages/UsersPage.jsx`, `src/pages/SettingsPage.jsx`, schema/backend relacionado

- [ ] Definir claramente quais campos da empresa existem no produto final.
  Exemplo: razao social, CNPJ, email financeiro, moeda, politica, setores, cargos.
  Saida esperada: contrato unico de dados entre frontend e backend.

## Fase 4 - Separacao entre modulo real e modulo mock

- [ ] Remover a exposicao de modulos mock como se fossem producao.
  Arquivos: `src/App.jsx`, navegacao/layout relacionado

- [ ] Integrar `Financeiro` ao backend real ou esconder a rota ate ficar pronta.
  Arquivos: `src/pages/FinancialPage.jsx`, `src/components/financial/*`, `src/lib/mocks/financialMockData.js`

- [ ] Integrar `Relatorios` ao backend real ou esconder a rota ate ficar pronta.
  Arquivos: `src/pages/ReportsPage.jsx`, `src/components/reports/*`, `src/lib/mocks/reportsMockData.js`

- [ ] Integrar `Detalhe de Alerta` ao backend real ou esconder a rota ate ficar pronta.
  Arquivos: `src/pages/ViolationDetailPage.jsx`, `src/components/violation/*`, `src/lib/mocks/dashboardMockData.js`, `src/lib/mocks/violationDetailMock.js`

- [ ] Atualizar a documentacao para deixar explicito o que esta em producao e o que ainda e roadmap.
  Arquivo: `documentacao.md`

## Fase 5 - Organizacao de codigo e manutencao

- [ ] Quebrar `LandingPage` em componentes por secao.
  Sugestao: `landing/Navbar`, `landing/Hero`, `landing/Pricing`, `landing/Faq`, etc.
  Arquivo atual: `src/pages/LandingPage.jsx`

- [ ] Quebrar `UsersPage` em camadas menores.
  Separar:
  transformacao de dados, filtros, acoes, toasts e renderizacao
  Arquivo atual: `src/pages/UsersPage.jsx`

- [ ] Quebrar `ApprovalPage` em camadas menores.
  Separar:
  filtro/tabulacao, cards de aprovacao, acoes de mutacao e regras de status
  Arquivo atual: `src/pages/ApprovalPage.jsx`

- [ ] Extrair helpers duplicados de leitura de arquivo/base64 para utilitario compartilhado.
  Arquivos: `src/api/despesas.js`, `src/api/politica.js`, `src/components/users/ImportUsersModal.jsx`

- [ ] Padronizar selecao de arquivo e interacao com DOM.
  Preferir `ref` e handlers reutilizaveis no lugar de `document.getElementById`.
  Arquivos: `src/pages/NewExpensePage.jsx`, `src/pages/PolicyOnboardingPage.jsx`, `src/components/users/ImportUsersModal.jsx`

- [ ] Padronizar downloads de arquivo.
  Centralizar criacao de blob/url/download em helper unico.
  Arquivos: `src/components/users/ImportUsersModal.jsx`, `src/components/reports/ExportButtons.jsx`

- [ ] Mover adaptadores de dados de pagina para helpers ou hooks.
  Exemplos: `toUser`, `tabOf`, `channelMeta`.
  Arquivos: `src/pages/UsersPage.jsx`, `src/pages/ApprovalPage.jsx`

- [ ] Definir um padrao unico de naming.
  Escolher uma regra para nomes de arquivos, componentes, hooks, APIs e funcoes.
  Problema atual: mistura forte de portugues e ingles.
  Escopo: `src/pages`, `src/components`, `src/api`, `src/lib`

- [ ] Remover utilitarios com efeito global no import.
  Transformar `isIframe` em funcao segura.
  Arquivo: `src/lib/utils.js`

- [ ] Definir criterio para componentes inline vs componentes compartilhados.
  Arquivos alvo: `src/pages/LandingPage.jsx`, `src/pages/ViolationDetailPage.jsx`

## Fase 6 - Qualidade tecnica e seguranca de manutencao

- [ ] Fazer o `typecheck` representar a base real.
  Revisar `jsconfig.json` e parar de usar uma cobertura parcial/confusa.
  Arquivo: `jsconfig.json`

- [ ] Corrigir os wrappers de UI que estao contaminando o typecheck.
  Arquivos: `src/components/ui/button.jsx`, `src/components/ui/input.jsx`, `src/components/ui/dialog.jsx`, `src/components/ui/select.jsx`, `src/components/ui/dropdown-menu.jsx`

- [ ] Corrigir erros de tipagem nas paginas e componentes principais.
  Escopo inicial:
  `LoginPage`, `SignupPage`, `NewExpensePage`, `UsersPage`, `ApprovalPage`, `PolicyPage`

- [ ] Decidir se o projeto vai:
  1. manter JS com `checkJs`
  2. migrar partes criticas para TS/TSX
  3. afrouxar temporariamente a checagem onde ainda nao houver contrato estavel

- [ ] Garantir que os comandos de validacao virem criterio minimo de entrega.
  Meta final:
  `npm test`, `npm run lint`, `npm run build`, `npm run typecheck`

## Fase 7 - Documentação final do produto

- [ ] Reescrever `documentacao.md` como documento técnico principal do produto final.
  Deve refletir apenas a arquitetura e os módulos em produção; incluir visão geral, fluxos e dependências.
  Arquivo: `documentacao.md`

- [ ] Criar estrutura de documentação separada:
  - produto: `docs/product/README.md` (casos de uso, personas, roadmap)
  - técnica: `docs/technical/architecture.md`, `docs/technical/api.md` (ER, API contracts, migrations)
  - backlog: `docs/backlog.md` (itens com status)
  Saída esperada: diretório `docs/` versionado

- [ ] Gerar e publicar referência de API e contratos (OpenAPI/Swagger) e linkar em `docs/technical/api.md`.
  Arquivos: `openapi.yaml` ou rota `/api-docs`

- [ ] Incluir guias operacionais e de deploy:
  - runbook de deploy (staging/prod)
  - variáveis de ambiente e segredos (ex.: `.env.example`)
  Arquivo: `docs/technical/deploy.md`, `.env.example`

- [ ] Documentar schema e migrations:
  - ER diagram
  - scripts de migração e seed
  Arquivos: `docs/technical/schema.md`, `migrations/`

- [ ] Definir templates e DoD para documentação:
  - cada PR de feature atualiza `docs/product` e `docs/technical` quando relevante
  - checklist de revisão (ex.: atualiza API, migrations, envs, testes)
  Arquivo: `docs/CONTRIBUTING.md`

- [ ] Criar changelog e processo de releases:
  - `CHANGELOG.md` e instruções de release
  - versionamento semântico
  Arquivo: `CHANGELOG.md`, `docs/technical/release.md`

- [ ] Manter exemplos e how-tos para setup local e integração com Supabase/Vercel:
  - passo-a-passo de setup, seeds, scripts úteis
  Arquivo: `docs/product/setup.md`, `.devcontainer/` (opcional)

- [ ] Responsabilidades e donos:
  - associar um responsável por docs de produto e por docs técnicas (nome/email)
  - incluir contatos em `docs/README.md`

- [ ] Definition of Done (DoD) para documentação:
  - documentação da feature adicionada/atualizada
  - exemplos reproduzíveis (cURL ou Postman)
  - arquivos retornados em docs/ e link no README principal

- [ ] Publicar/servir docs (opcional):
  - configurar GitHub Pages / Vercel / mkdocs para hospedar `docs/`
  Saída esperada: URL pública ou rota interna `/<docs>`

Saída esperada: docs organizados em `docs/` com templates, DoD, owners e links no `README.md`.


## Ordem recomendada de execucao

1. Remover Base44 completamente
2. Corrigir toast e tema
3. Persistir configuracoes reais da empresa
4. Alinhar usuarios, setores, cargos e dados da empresa
5. Resolver typecheck e wrappers de UI
6. Refatorar organizacao de paginas e helpers
7. Integrar ou esconder modulos mock
8. Reescrever a documentacao final

## Estado atual validado antes da execucao

- `npm test`: passou
- `npx eslint src --quiet`: passou
- `npm run build`: passou
- `npm run typecheck`: falhou

## Fase 8 - WhatsApp do colaborador como chave de roteamento (multi-tenant)

Objetivo: **um único número de WhatsApp** para todos os clientes. O **telefone do remetente** identifica de qual empresa veio a despesa. Para isso, o WhatsApp de cada colaborador precisa estar cadastrado em `profiles.telefone`.

### Já feito (backend, no ar) — não alterar, só referência
- [x] Coluna `profiles.telefone` (migração `add_telefone_to_profiles`) + índice por dígitos.
- [x] `whatsapp-evolution` v6 — webhook único; roteia pelo telefone do remetente → `profiles.telefone` → empresa. Número não cadastrado = recusa (responde no chat, não cria despesa). Credenciais Evolution lidas de forma compartilhada (1 número).
- [x] `whatsapp-ingest` v12 — aceita `colaborador` (nome do cadastro) e grava `canal='whatsapp'`.
- [x] Telefone de teste `5511954686897` no perfil Datarisk (via banco, provisório p/ teste).

### A implementar (INTERFACE — ainda não feito)

- [ ] [MVP] Adicionar campo **"WhatsApp"** no formulário de convite de colaborador.
  Placeholder `5511999998888` (com DDI 55); enviar só dígitos. Recomendado obrigatório.
  Componentes confirmados no código: `src/components/users/InviteModal.jsx`
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/users/InviteModal.jsx`

- [ ] [MVP] Fazer a RPC `equipe_da_empresa()` retornar `telefone`.
  Hoje a `UsersPage` depende dessa RPC para listar a equipe. Sem incluir `telefone` no retorno, a UI continuará sem dado mesmo que o número já exista em `profiles`.
  Arquivos: `supabase/migrations/20260522_equipe_da_empresa.sql`, chamadas em `src/api/usuarios.js`

- [ ] [MVP] Mostrar e **editar** o WhatsApp na lista de usuários (corrigir/cadastrar de quem já existe).
  Ação = `update profiles.telefone` (confirmar política RLS para admin atualizar profiles da própria empresa).
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/users/UsersTable.jsx`

- [ ] [MVP] Passar `telefone` no convite e criar função de update no client.
  `atualizarTelefone(userId, telefone)` → `supabase.from('profiles').update({ telefone }).eq('id', userId)`.
  Arquivo: `src/api/usuarios.js`

- [ ] [MVP] `convidar-usuario`: aceitar `telefone` e, **após** o `inviteUserByEmail`, gravar direto no profile
  (`admin.from('profiles').update({ telefone }).eq('id', novoUsuarioId)`).
  Decisão: **NÃO** usar trigger nem coluna em `invitations` — o profile já existe logo após o invite.
  Arquivo: `supabase/functions/convidar-usuario/index.ts`

### Impactos de UI que precisam entrar no escopo

- [ ] [MVP] Exibir o WhatsApp na tabela/lista de usuários, incluindo convites pendentes.
  Quando o colaborador ainda não aceitou o convite, a UI precisa continuar mostrando o número informado no convite/registro para não parecer que o dado sumiu.
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/users/UsersTable.jsx`

- [ ] [MVP] Permitir editar o WhatsApp depois do convite.
  O admin precisa conseguir corrigir ou cadastrar o telefone de um colaborador existente sem reenviar convite.
  Componentes confirmados no código: `src/components/users/EditRoleModal.jsx`
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/users/EditRoleModal.jsx` ou modal/tela dedicada

- [ ] [MVP] Incluir validação e normalização de telefone na interface.
  A UI deve aceitar entrada amigável, mas salvar apenas dígitos com DDI. Também deve bloquear formato inválido antes de enviar ao backend.
  Arquivos: modal de convite, edição de usuário, helpers/client

- [ ] [Polimento] Exibir estado operacional do canal WhatsApp por usuário.
  Sugestão de estados:
  - `WhatsApp cadastrado`
  - `Telefone inválido`
  - `Sem WhatsApp`
  Observação: não confundir com `convite pendente`, que é outro estado.
  Isso ajuda o admin a entender quem já está apto a enviar despesa por WhatsApp.
  Componentes confirmados no código: `src/components/users/StatusDot.jsx`
  Arquivos: `src/pages/UsersPage.jsx`, `src/components/users/StatusDot.jsx` ou badge dedicada

- [ ] [Polimento] Adicionar busca e filtro por telefone.
  O admin deve conseguir localizar colaborador também pelo número.
  Arquivo: `src/pages/UsersPage.jsx`

- [ ] [Polimento] Exibir mensagem de impacto quando o usuário não tiver WhatsApp cadastrado.
  Exemplo: "Este colaborador não conseguirá enviar despesas pelo WhatsApp até cadastrar um número."
  Arquivos: convite, edição de usuário, tela de usuários

- [ ] [Polimento] Ajustar o texto do fluxo de convite.
  O convite não deve parecer apenas "acesso ao sistema"; a UI precisa comunicar que o WhatsApp também será usado para roteamento de despesas.
  Arquivo: `src/components/users/InviteModal.jsx`

- [ ] [Polimento] Ajustar onboarding/admin para deixar claro que o WhatsApp é parte do setup operacional.
  Se o canal WhatsApp for central no produto, a empresa precisa ser orientada a cadastrar os números da equipe logo no onboarding operacional.
  Componentes confirmados no código: `src/pages/OnboardingPage.jsx`
  Arquivos: `src/pages/OnboardingPage.jsx`, `src/pages/UsersPage.jsx`, docs relacionadas

- [ ] [Polimento] Refletir o canal e o remetente nas interfaces de despesa/aprovação.
  Despesas vindas do WhatsApp devem mostrar com clareza:
  - canal de origem
  - colaborador identificado
  - opcionalmente telefone de origem mascarado
  Arquivos: `src/pages/ApprovalPage.jsx`, detalhe de despesa/alerta futuro

- [ ] [Polimento] Criar feedback administrativo para número não cadastrado.
  Se uma mensagem chegar de um número não reconhecido, o admin deveria ter visibilidade disso em interface futura de operações/alertas, em vez de o erro ficar invisível fora do backend.
  Arquivos: backlog de operações, dashboard/alertas futuros

### Regras do telefone
- Guardar só dígitos com DDI (`5511954686897`). Normalizar na escrita e na comparação.
- Unicidade: 1 telefone → 1 colaborador/empresa. Avaliar índice UNIQUE em `regexp_replace(telefone,'\D','','g')` (tratar duplicados legados antes).
- Borda BR: 9º dígito do celular — comparação por "últimos 11" cobre parcialmente; validar no campo.

### Teste
1. Cadastrar WhatsApp de um colaborador (pela tela). 2. Enviar foto daquele número. 3. Conferir: despesa na empresa certa, com nome do colaborador e `canal='whatsapp'`. 4. Número não cadastrado → recusado com aviso no chat.

### Pendências relacionadas (segurança/limpeza)
- [ ] Revogar o PAT do Supabase exposto no chat.
- [ ] Limpar Datarisk duplicada (linha órfã `51598677`, `evolution_instance='reembolsa'` sem apikey).
- [ ] Decidir `criar-despesa` (fallback de OCR externo — manter/remover) e remover `enviar-despesa.html`.
- [ ] Commitar/pushar funções deployadas via MCP (não estão no git) + migração `20260523_create_invitations.sql`.

## Gate de sobrevivencia da base atual

Objetivo: definir criterios objetivos para decidir se a base atual continua viva ou se o projeto deve recomeçar do zero.

### Se estes itens nao forem fechados, a base entra em risco real de descarte

- [ ] Deploy limpo e reproduzivel na Vercel.
  O projeto precisa buildar e publicar sem gambiarra manual escondida.

- [ ] Variaveis de ambiente documentadas e conferidas.
  Frontend, Supabase, Edge Functions e integracoes externas precisam ter setup claro e reproduzivel.

- [ ] Migrations e funcoes server-side versionadas no repositorio.
  Nada critico pode existir apenas "deployado" e fora do git.

- [ ] Fluxos criticos funcionando em producao ponta a ponta.
  Escopo minimo:
  - login
  - cadastro
  - criacao de empresa
  - convite
  - aceite de convite
  - configuracao da politica
  - nova despesa
  - aprovacao

- [ ] Nada mock em rota que parece producao.
  Modulos protegidos no app nao podem depender de dado fake sem aviso explicito.

- [ ] Tenant real refletido corretamente na interface.
  A empresa da sessao, os usuarios, convites, politica e despesas precisam bater com o banco.

- [ ] Dashboard confiavel.
  Numeros, textos e periodos exibidos precisam bater com os dados reais consultados.

### Criterio de decisao

- Se todos os itens acima forem fechados:
  continuar evoluindo a base atual

- Se parte relevante desses itens continuar quebrada apos a estabilizacao:
  avaliar reinicio controlado da base

### Regra pratica

- Nao crescer produto antes de estabilizar deploy e persistencia
- Nao adicionar novas frentes de interface antes de fechar fluxo critico
- Nao confiar em "funciona localmente" como criterio de continuidade
