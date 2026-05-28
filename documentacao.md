# Reembolsaaí — Documentação Técnica Completa

> Gestão de despesas e **compliance de reembolsos**, multi-empresa (SaaS multi-tenant).
> Última atualização: 22/05/2026.

Esta documentação cobre, de ponta a ponta, **o que existe hoje** no produto: a estrutura
de frontend, o backend (Supabase), as "skills" de IA (Edge Functions), as APIs e os
fluxos. Foi escrita a partir da inspeção direta do código e do schema de produção
(projeto Supabase `rqcvxnauxmgwgiqdlzuv`).

---

## 1. Visão geral

O Reembolsaaí permite que uma empresa:

1. **Cadastre sua política de reembolso** (sobe um PDF; a IA extrai limites por categoria e um resumo fiel das regras).
2. **Receba despesas** dos colaboradores por dois canais: o **app web** (formulário com OCR do comprovante) ou o **WhatsApp** (foto do comprovante).
3. **Classifique automaticamente** cada despesa contra a política: aprova sozinha quando está dentro das regras, ou envia para **análise humana** quando há violação de limite ou de restrição qualitativa (ex.: bebida alcoólica).
4. **Aprove / reprove / pague** despesas com trilha de auditoria.
5. **Acompanhe** dashboards, relatórios e o financeiro, e **gerencie a equipe** (convite por e-mail, papéis).

Cada empresa é um **tenant isolado**: todo dado é escopado por `empresa_id` e protegido por **Row-Level Security** no Postgres.

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, Vite 6, React Router 6 |
| Estado de servidor | TanStack Query 5 (`@tanstack/react-query`) |
| UI / Design system | Tailwind CSS 3 + shadcn/ui (Radix UI), `lucide-react`, `recharts`, `framer-motion` |
| Formulários | `react-hook-form` + `zod` |
| Backend (BaaS) | Supabase — Postgres, Auth, Row-Level Security, Storage, Edge Functions (Deno) |
| IA / LLM | **OpenRouter** (`google/gemini-2.0-flash-001` + fallbacks `gemini-flash-1.5`, `gpt-4o-mini`); OCR de PDF via **Mistral OCR** (plugin `file-parser` do OpenRouter) |
| Mensageria | **WhatsApp** via **Evolution API** |
| Testes | Vitest (16 testes na lógica de domínio) |
| Deploy | Vercel (projeto `reembolsaa`, framework Vite, Node 24.x) |

> Observação histórica: o projeto nasceu no builder **Base44** (daí o nome `base44-app` no
> `package.json` e dependências `@base44/*` ainda presentes). A autenticação e os dados
> foram **migrados para o Supabase**; os injetores do Base44 estão desligados no `vite.config.js`.

---

## 3. Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR (SPA React)                        │
│  Pages ──> Hooks/TanStack Query ──> src/api/* ──┐                     │
│  AuthContext (sessão) · ThemeContext (claro/escuro)                   │
└──────────────────────────────────────────────────┼──────────────────┘
                                                    │ supabase-js (anon key)
                          ┌─────────────────────────▼─────────────────────────┐
                          │                  SUPABASE (tenant)                 │
                          │  Auth ── Postgres + RLS ── Storage(comprovantes)   │
                          │            │                                       │
                          │            └── RPCs (SECURITY DEFINER)             │
                          │  Edge Functions (Deno):                            │
                          │   extrair-politica · extrair-despesa ·             │
                          │   analisar-despesa · convidar-usuario ·            │
                          │   whatsapp-evolution · whatsapp-ingest             │
                          └───────┬───────────────────────────┬───────────────┘
                                  │ OpenRouter API            │ Evolution API
                          ┌───────▼────────┐          ┌───────▼────────┐
                          │  LLMs (Gemini, │          │  WhatsApp do   │
                          │  GPT) + OCR     │          │  colaborador   │
                          │  (Mistral)      │          └────────────────┘
                          └────────────────┘
```

- O **front nunca fala com a IA direto**: toda chamada de IA passa por uma Edge Function (a `OPENROUTER_API_KEY` fica só no servidor).
- O front usa a **anon key** (pública por design); a segurança real é o **RLS**.
- O **WhatsApp** é um pipeline 100% server-side (Evolution API → Edge Functions).

---

## 4. Estrutura de pastas

```
reembolsaa/
├── index.html                 # entrypoint + script anti-flash de tema
├── vite.config.js             # build Vite (injetores Base44 desligados)
├── tailwind.config.js         # design system (cores via CSS vars, dark mode class)
├── vitest.config.js           # testes
├── vercel.json                # config de deploy
├── src/
│   ├── main.jsx               # bootstrap React
│   ├── App.jsx                # providers + rotas
│   ├── index.css              # tokens do design system (:root / .dark)
│   ├── api/                   # CAMADA DE ACESSO A DADOS (front → Supabase)
│   │   ├── despesas.js
│   │   ├── politica.js
│   │   └── usuarios.js
│   ├── lib/                   # contextos, domínio puro, infra
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── supabaseClient.js
│   │   ├── query-client.js
│   │   ├── policy.js          # lógica de política (PURA, testada)
│   │   ├── policy.test.js
│   │   ├── dashboard-compute.js  # agregações do dashboard (PURA, testada)
│   │   ├── dashboard-compute.test.js
│   │   ├── roles.js           # papéis canônicos
│   │   ├── utils.js           # cn() (Tailwind merge)
│   │   └── mocks/             # dados mock (telas ainda não plugadas)
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── useNewExpense.js   # lógica de dados da tela Nova Despesa
│   ├── pages/                 # 15 telas (uma por rota)
│   └── components/            # componentes por domínio + ui/ (shadcn)
│       ├── layout/  dashboard/  financial/  reports/
│       ├── policy/  users/  violation/  settings/
│       └── ui/                # ~50 primitivos shadcn/ui
└── supabase/
    ├── functions/             # Edge Functions versionadas (Deno/TS)
    │   ├── extrair-despesa/
    │   ├── analisar-despesa/
    │   └── convidar-usuario/
    └── migrations/            # alterações de schema idempotentes
```

> As funções `extrair-politica`, `whatsapp-ingest` e `whatsapp-evolution` estão **ativas em
> produção** mas ainda **não estão versionadas** nesta pasta (foram criadas pelo painel/MCP).
> A fonte de verdade delas é o projeto Supabase. **Recomendação:** trazer essas três para
> `supabase/functions/` para versionar tudo.

---

## 5. Frontend

### 5.1 Rotas e navegação (`src/App.jsx`)

Providers, na ordem: `ThemeProvider` → `AuthProvider` → `QueryClientProvider` → `Router`.

| Rota | Tela | Proteção |
|---|---|---|
| `/` | LandingPage | pública |
| `/login` | LoginPage | só visitante (`PublicOnly`) |
| `/cadastro` | SignupPage | só visitante |
| `/aceitar-convite` | AceitarConvitePage | link cria sessão; define senha |
| `/comecar` | OnboardingPage (cria empresa) | sessão, sem empresa |
| `/comecar/politica` | PolicyOnboardingPage | admin sem política configurada |
| `/dashboard` | DashboardPage | sessão + empresa |
| `/politica` | PolicyPage | sessão + empresa |
| `/usuarios` | UsersPage | sessão + empresa |
| `/aprovacoes` | ApprovalPage | sessão + empresa |
| `/nova-despesa` | NewExpensePage | sessão + empresa |
| `/financeiro` | FinancialPage | sessão + empresa |
| `/relatorios` | ReportsPage | sessão + empresa |
| `/alertas/:id` | ViolationDetailPage | sessão + empresa |
| `/configuracoes` | SettingsPage | sessão + empresa |
| `*` | PageNotFound | — |

Guards (componentes de rota):
- **`PublicOnly`** — logado é redirecionado pra dentro do app.
- **`RequireAuth`** — sem sessão → `/login`.
- **`ProtectedLayout`** — exige sessão **e** empresa; admin sem política → `/comecar/politica`; renderiza o `AppShell` (sidebar + conteúdo).

### 5.2 Autenticação — `src/lib/AuthContext.jsx`

Fonte única de verdade da sessão. Expõe:

```
session, user, profile, empresa, loading
isAuthenticated, hasEmpresa, isAdmin, needsPolicyOnboarding
signIn, signUp, signOut, createEmpresa, refreshProfile
```

- Acompanha a sessão com `supabase.auth.getSession()` + `onAuthStateChange`.
- **Armadilha conhecida documentada no código:** o callback de `onAuthStateChange` **não pode** chamar outros métodos do `supabase-js` (deadlock que trava o app em `loading`). Por isso o callback só atualiza `session/user`; o carregamento do `profile`/`empresa` acontece num `useEffect` separado.
- `createEmpresa(nome)` chama a RPC `create_empresa` (self-service: cria empresa e vira admin).

### 5.3 Tema — `src/lib/ThemeContext.jsx`

- **Escuro é o padrão.** Alterna a classe `.dark` no `<html>`; persiste em `localStorage["reembolsaa-theme"]`.
- Script **anti-flash** no `index.html` aplica o tema antes da primeira pintura.
- Botão sol/lua no rodapé do Sidebar.

### 5.4 Camada de API — `src/api/`

Toda leitura/escrita de dados passa por aqui (nunca direto nas telas). Resumo em §8.

### 5.5 Lógica de domínio (pura e testada)

- **`src/lib/policy.js`** — `CATEGORIAS`, `limiteCategoria(politica)`, `avaliarLimite({categoria, valor_brl, politicas})`. Sem dependências → 100% testável. (10 testes em `policy.test.js`.)
- **`src/lib/dashboard-compute.js`** — `computeDashboard(despesas)` produz KPIs, gráficos por categoria/departamento, tendência de compliance e alertas. (6 testes em `dashboard-compute.test.js`.)

### 5.6 Papéis — `src/lib/roles.js`

`ROLES = ["admin", "aprovador", "financeiro", "colaborador"]` — **espelham o CHECK do banco** (não inventar valores). Inclui labels, descrições, estilos de badge e opções de `<Select>`.

### 5.7 Design system — `tailwind.config.js` + `src/index.css`

- `darkMode: ["class"]`. Cores **semânticas** via CSS variables HSL: `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `warning`, `border`, `chart-1..5`, e um namespace `sidebar`. Os valores ficam em `:root` (claro) e `.dark` (escuro) no `index.css`.
- Animações utilitárias: `pulse-soft`, `scan-line`, `accordion-*`.
- `src/components/ui/` traz ~50 primitivos do **shadcn/ui** (Radix), usados por todas as telas.

### 5.8 Telas — fonte de dados (real vs mock)

| Tela | Fonte de dados |
|---|---|
| Dashboard | **Real** — `listDespesas` + `computeDashboard` |
| Aprovações | **Real** — `listDespesas` + `decidirDespesa` (badge de canal web/WhatsApp) |
| Nova Despesa | **Real** — `useNewExpense` → `extrairRecibo`, `createDespesa`, `uploadComprovante` |
| Política / Onboarding política | **Real** — `extrairPolitica`, `salvarPoliticas`, `listPoliticas` |
| Usuários | **Real** — `listProfiles`, `convidarUsuarios`, `atualizarPapel`, `removerUsuario` |
| Aceitar Convite | **Real** — Supabase Auth (define senha) |
| Login / Cadastro / Onboarding empresa / Configurações | usam o **AuthContext** |
| **Financeiro / Relatórios / Detalhe de Alerta** | ⚠️ **ainda em dados mock** (`src/lib/mocks/`) — pendente de ligação ao backend |

---

## 6. Backend — Supabase

Projeto: **`rqcvxnauxmgwgiqdlzuv`** (`https://rqcvxnauxmgwgiqdlzuv.supabase.co`).

### 6.1 Modelo de dados (schema `public`)

**`empresa`** — o tenant.
`id`, `nome`, `total_colaboradores`, `ativos`, `semana_poc`, `created_by`, `created_at`,
`politica_documento`, `politica_texto` (resumo da política para a IA), `onboarding_done` (bool),
`webhook_token` (gerado; autentica o WhatsApp), `evolution_url`, `evolution_apikey`, `evolution_instance`.

**`profiles`** — usuário (1:1 com `auth.users`).
`id` (= `auth.users.id`), `empresa_id`, `email`, `nome`, `role` *(CHECK: admin/aprovador/financeiro/colaborador)*.

**`invitations`** — convites pendentes/aceitos.
`id`, `empresa_id`, `email`, `role`, `invited_by`, `accepted_at` (null = pendente), `created_at`.

**`politica`** — regras por categoria.
`id`, `empresa_id`, `categoria` *(CHECK: Alimentação/Transporte/Hospedagem/KM/Outros)*,
`diario_brl`, `por_noite_brl`, `teto_mes_brl`, `documento`, `restricoes`.
Chave de upsert: `(empresa_id, categoria)`.

**`despesa`** — o registro central.
`id` (texto, `DR-XXXXXXXXXX`), `colaborador`, `centro_custo` (default `—`), `categoria`,
`valor_brl`, `data`, `cnpj`, `gps`, `observacao`, `comprovante` (path no Storage),
`empresa_id`, `created_by`, `created_at`, `canal` *(web/whatsapp)*, e os enums:

| Coluna | Enum | Valores |
|---|---|---|
| `status` | `despesa_status` | `pendente`, `aprovada-n1`, `paga`, `reprovada` |
| `policy_kind` | `policy_kind` | `dentro`, `acima` |
| `ia` | `ia_class` | `auto`, `revisar`, `manual` |
| `sefaz_kind` | `sefaz_kind` | `valida`, `duplicata`, `cancelada`, `na` *(reservado p/ validação SEFAZ; default `na`)* |

Mais `policy_excesso_brl` (quanto passou do limite).

**`audit_trail`** — trilha de auditoria.
`id`, `empresa_id`, `despesa_id`, `evento`, `canal` (web/whatsapp/automatico), `ator`, `dados` (jsonb), `created_at`.

> Existe ainda uma tabela opcional de debug `webhook_debug` (gravação best-effort pelo conector
> do WhatsApp). Não é parte do modelo de negócio.

### 6.2 Multi-tenancy e RLS

**RLS habilitado em todas as tabelas.** Padrão: cada linha é visível/alterável só dentro da
empresa do usuário (`empresa_id = current_empresa_id()`), e escritas sensíveis exigem admin
(`is_admin()`). Resumo das policies (role `authenticated`):

| Tabela | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| `empresa` | a própria empresa | UPDATE só admin |
| `profiles` | si mesmo **ou** colegas da empresa | ALL só admin; UPDATE do próprio perfil liberado |
| `invitations` | — | ALL só admin da empresa |
| `politica` | da empresa | ALL só admin |
| `despesa` | da empresa **e** (`pode_ver_todas_despesas()` **ou** `created_by = auth.uid()`) | INSERT do próprio (ou quem vê tudo); UPDATE/DELETE só quem vê tudo |
| `audit_trail` | da empresa | INSERT escopado à empresa |

Ou seja, um **colaborador** vê só as próprias despesas; **admin/aprovador/financeiro** (quem satisfaz `pode_ver_todas_despesas()`) veem todas as da empresa.

### 6.3 Funções RPC (todas `SECURITY DEFINER`)

| Função | Papel |
|---|---|
| `current_empresa_id()` | retorna a empresa do usuário logado — base de todas as policies |
| `is_admin()` | o usuário é admin da própria empresa? |
| `pode_ver_todas_despesas()` | papel pode ver todas as despesas (não só as próprias)? |
| `create_empresa(p_nome)` | self-service: cria empresa e promove o criador a admin |
| `equipe_da_empresa()` | lista a equipe **com a flag `pending`** (lê `auth.users.last_sign_in_at`, que o front não enxerga) |
| `handle_new_user()` | trigger de criação de usuário (ver abaixo) |

### 6.4 Trigger

`on_auth_user_created` — **AFTER INSERT em `auth.users`** → `handle_new_user()`. Quando um
convidado aceita o convite (vira `auth.user`), o trigger lê a tabela `invitations` e liga o
novo `profile` à empresa e ao papel corretos.

### 6.5 Storage

Bucket **`comprovantes`**. Os arquivos são salvos com path `"{empresa_id}/{timestamp}-{nome}"`,
isolando os comprovantes por empresa.

### 6.6 Autenticação e papéis

- **Auth:** e-mail/senha do Supabase Auth. Cadastro via `signUp` (com `nome` no metadata);
  convite via `inviteUserByEmail` (ver §7.4 e §10.5).
- **Papéis:** `admin`, `aprovador`, `financeiro`, `colaborador` (CHECK no banco + `roles.js` no front).

---

## 7. "Skills" de IA — Edge Functions

Há **6 Edge Functions** (Deno/TypeScript). As de IA chamam o **OpenRouter**; PDFs passam pelo
**Mistral OCR** (plugin `file-parser`). A chave (`OPENROUTER_API_KEY`) vive **só no servidor**.
Modelo padrão `google/gemini-2.0-flash-001`, com fallback automático para `gemini-flash-1.5` e
`gpt-4o-mini` (overridable por env).

| Função | Versão | `verify_jwt` | Papel |
|---|---|---|---|
| `extrair-politica` | v5 | sim | PDF da política → regras + resumo |
| `extrair-despesa` | v8 | sim | comprovante (imagem/PDF) → campos da despesa |
| `analisar-despesa` | v5 | sim | agente que decide **aprovar** vs **revisar** |
| `convidar-usuario` | v2 | sim | convite por e-mail (admin-only, service-role) |
| `whatsapp-evolution` | v5 | **não** | webhook da Evolution API (recebe a mensagem) |
| `whatsapp-ingest` | v10 | **não** | pipeline completo do comprovante (token webhook) |

### 7.1 `extrair-politica` — leitura da política

Recebe o PDF (base64). Prompt de "analista de compliance criterioso" pede dois resultados:
1. **`rules`** — limites por categoria (`diario_brl`/`por_noite_brl`/`teto_mes_brl`, `observacao`, `restricoes`), restritos às 5 categorias canônicas.
2. **`politica_texto`** — resumo fiel e completo das regras em markdown (não omite proibições/exceções).

PDF é parseado por **Mistral OCR**. Saída sanitizada e cortada por tamanho. → alimenta `salvarPoliticas`.

### 7.2 `extrair-despesa` — OCR do comprovante (web)

Recebe imagem **ou** PDF (base64). Imagem vai como `image_url`; PDF usa o plugin Mistral OCR.
Retorna `{ colaborador, fornecedor, valor_brl, data (YYYY-MM-DD), categoria, descricao, itens[] }`.
Extrai **todos os itens consumíveis** (essencial para a análise qualitativa). Faz parsing
robusto de número (R$, milhar, vírgula) e valida categoria.

### 7.3 `analisar-despesa` — o agente de política

Recebe `{ despesa, politica_texto, politicas }`. Prompt rigoroso com **inferência de classe**:
se a política proíbe uma classe (ex.: "bebida alcoólica"), itens específicos (caipirinha,
cerveja, vinho, chopp, whisky) também são proibidos mesmo sem citar o nome. Considera limites,
nota fiscal e itens pessoais. **Na dúvida → "revisar".**
Retorna `{ status: "aprovar"|"revisar", motivos[], raciocinio }`.

### 7.4 `convidar-usuario` — convite por e-mail

Admin-only (verifica `role` e `empresa_id` no banco a partir do JWT do caller — **a empresa
nunca vem do payload**, evita convidar para empresa de terceiros). Cria a `invitation` *antes*
do invite (o trigger a lê) e chama `inviteUserByEmail`. **Reenvio:** se o e-mail é um convidado
pendente (nunca aceitou), apaga e reconvida; se já é conta ativa, devolve mensagem clara.

> O **nome do remetente** do e-mail (ex.: "reembolsa") **não** está aqui — é configuração de
> Auth do projeto (custom SMTP / `smtp_sender_name`). Ver §13 (pendências).

---

## 8. APIs — mapa front → backend

### `src/api/despesas.js`
| Função | O que faz | Backend |
|---|---|---|
| `listDespesas()` | lista despesas da empresa | `select` em `despesa` (RLS filtra) |
| `listPoliticas()` | lista políticas | `select` em `politica` |
| `createDespesa({...})` | cria despesa, calcula `policy_kind`/excesso, define `status` e grava auditoria | `insert` em `despesa` + `audit_trail` |
| `extrairRecibo(file)` | OCR do comprovante | Edge `extrair-despesa` |
| `uploadComprovante(file, empresaId)` | sobe arquivo isolado por empresa | Storage `comprovantes` |
| `decidirDespesa({...})` | aprovar/reprovar/pagar (reprovar exige comentário) + auditoria | `update` em `despesa` + `audit_trail` |

### `src/api/politica.js`
| Função | O que faz | Backend |
|---|---|---|
| `extrairPolitica(file)` | PDF → regras + resumo | Edge `extrair-politica` |
| `salvarPoliticas(empresaId, rules, texto)` | upsert das regras + grava `politica_texto` na empresa | `upsert` em `politica` + `update` em `empresa` |
| `analisarDespesa({despesa, politicaTexto, politicas})` | decide aprovar/revisar | Edge `analisar-despesa` |

### `src/api/usuarios.js`
| Função | O que faz | Backend |
|---|---|---|
| `listProfiles()` | equipe com flag `pending` | RPC `equipe_da_empresa` |
| `convidarUsuarios(invites, redirectTo)` | convida por e-mail | Edge `convidar-usuario` |
| `atualizarPapel(id, role)` | muda o papel | `update` em `profiles` (RLS admin) |
| `removerUsuario(id)` | remove da empresa | `delete` em `profiles` (RLS admin) |

---

## 9. Integração WhatsApp (Evolution API)

Pipeline 100% server-side, sem JWT (autenticado por `webhook_token` da empresa).

```
Colaborador (foto no WhatsApp)
   │
   ▼
Evolution API ──webhook──> whatsapp-evolution (v5)
   1. identifica a empresa por token/instância (ou DEFAULT_TOKEN)
   2. extrai a imagem (base64 do payload OU getBase64FromMediaMessage na Evolution)
   3. (best-effort) loga em webhook_debug
   │  POST { token, fileBase64, telefone }
   ▼
whatsapp-ingest (v10)  ── pipeline completo:
   • OCR do comprovante (OpenRouter; PDF via Mistral OCR)  → campos
   • análise vs política da empresa (mesmo agente do §7.3)
   • checa limite numérico da categoria
   • INSERT em despesa (canal='whatsapp') + audit_trail
   • salva o comprovante no Storage
   • monta a mensagem de resposta (aprovada ✅ / em análise 🔎)
   │  resposta (texto)
   ▼
whatsapp-evolution ── envia a resposta de volta (Evolution sendText) ── Colaborador
```

Config por empresa (tabela `empresa`): `webhook_token`, `evolution_url`, `evolution_apikey`, `evolution_instance`.

---

## 10. Fluxos principais

### 10.1 Cadastro + criação de empresa
`/cadastro` → `signUp` → `/comecar` → `createEmpresa(nome)` (RPC, vira admin) → `/comecar/politica`.

### 10.2 Onboarding da política (admin)
`/comecar/politica` → sobe PDF → `extrairPolitica` → revisa regras → `salvarPoliticas` (marca `onboarding_done`) → `/dashboard`.

### 10.3 Nova despesa (web)
`/nova-despesa` → foto/PDF → `extrairRecibo` (OCR) → usuário confere → `uploadComprovante` + `createDespesa`. O `createDespesa` calcula limite (`avaliarLimite`): **dentro e sem violação → `aprovada-n1` automática**; **acima ou bloqueada → `pendente`** (vai para Aprovações).

### 10.4 Despesa via WhatsApp
Ver §9. Mesma lógica de aprovação/revisão, canal `whatsapp`.

### 10.5 Convite de usuário
`/usuarios` (admin) → `convidarUsuarios` → e-mail de convite → convidado abre `/aceitar-convite`, define senha → trigger `handle_new_user` liga o profile à empresa/papel. `UsersPage` mostra status **pendente** e botão **Reenviar**.

### 10.6 Aprovação
`/aprovacoes` → aprovador vê pendentes (com badge de canal e motivos da IA) → `decidirDespesa('aprovar'|'reprovar'|'pagar')` (reprovar exige comentário) → trilha em `audit_trail`.

---

## 11. Ambiente e variáveis

**Frontend (`.env.local`, prefixo `VITE_`):**
```
VITE_SUPABASE_URL=https://rqcvxnauxmgwgiqdlzuv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```
> A URL e a anon/publishable key são **públicas por design** (vão ao browser); a segurança é o RLS.
> Há fallback embutido em `supabaseClient.js` para o build não quebrar sem env.

**Edge Functions (secrets no Supabase):**
`OPENROUTER_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`,
e opcionais `WHATSAPP_DEFAULT_TOKEN`, `OPENROUTER_MODEL`, `OPENROUTER_FALLBACKS`, `OPENROUTER_ANALYSIS_MODEL`.

---

## 12. Build, testes e deploy

| Comando | Ação |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | build de produção (`dist/`) |
| `npm run lint` | ESLint (flat config, `--quiet`) |
| `npm test` | Vitest (16 testes: `policy` + `dashboard-compute`) |
| `npm run typecheck` | `tsc` |

**Deploy (Vercel):** projeto `reembolsaa` (team `jhonemes-projects`), framework Vite, build
`npm run build`, output `dist`, Node 24.x. Produção: **`reembolsaa.vercel.app`**.

> ⚠️ Armadilha conhecida: deploys podem ser bloqueados por `COMMIT_AUTHOR_REQUIRED` se o
> `git config user.email` estiver vazio. A CLI antiga mostra "UNKNOWN"; o status real só pela
> API da Vercel. Fix: `git config user.email jhonata.emerick@gmail.com` e redeploy.
> Deploys de **preview** ficam atrás de login (401) — validar via `--prod` ou pelo dev server.

---

## 13. Pendências conhecidas

- **Plugar Financeiro, Relatórios e Detalhe de Alerta** ao backend real (hoje em `src/lib/mocks/`).
- **Versionar** as Edge Functions `extrair-politica`, `whatsapp-ingest`, `whatsapp-evolution` em `supabase/functions/`.
- **Remetente do e-mail de convite = "reembolsa"**: configurar **custom SMTP** (`smtp_sender_name`) no Auth do Supabase — não dá pra fazer no código da função.
- **Revogar a chave Mistral** exposta no antigo arquivo de notas (já deletado, mas a chave segue ativa até ser revogada no console.mistral.ai).
- `sefaz_kind` está no schema mas ainda **não tem fluxo** que o popule (validação SEFAZ é evolução futura).

---

## 14. Histórico do projeto (resumo)

- **Migração Base44 → Supabase:** auth e dados saíram do builder Base44 para o Supabase; injetores do builder desligados.
- **21/05/2026:** restauração da "nossa versão" em produção (override de commits do Base44 que quebravam o login).
- **22/05/2026 (rodada 1):** limpeza tech-lead (código morto + 24 componentes órfãos), seletor de tema claro/escuro, papéis em PT alinhados ao banco, badge de canal, **convite por e-mail completo**. Kimi/Moonshot chegou a ser plugado e foi **revertido** (volta a OpenRouter/Gemini).
- **22/05/2026 (rodada 2):** migração `despesa.canal` **aplicada** ao banco; arquivo de notas com chave vazada **deletado**; código morto `src/utils/index.ts` removido; esta documentação criada.

---

*Documentação gerada por inspeção direta do código-fonte e do schema de produção em 22/05/2026.*
