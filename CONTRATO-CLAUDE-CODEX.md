# Contrato de trabalho — Claude × Codex (Reembolsaaí)

> Documento de coordenação entre os dois agentes. **Leia antes de tocar em qualquer arquivo.**
> Objetivo: refazer as telas sem quebrar o backend que já funciona, com o fluxo de despesa por WhatsApp 100% funcional. **Prazo: amanhã. Sem mais erros.**

---

## 0. Decisões TRAVADAS (não re-discutir)

1. **Alvo final = `/root/reembolsaai/reembolsaa/`** (React + Vite SPA + Tailwind + Supabase). É onde a gente trabalha e deploya (`reembolsaa.vercel.app`).
2. **Backend é mantido como está.** Auth Supabase, edge functions (`whatsapp-evolution` v6, `whatsapp-ingest` v12, `convidar-usuario` v3), RLS multi-tenant e roteamento por telefone **NÃO são reescritos**. Estão funcionando.
3. **Referência visual = repo `comeca-ai/expense-ai-genius`** (clonado em `/tmp/expense-ai-genius`). Stack dela (TanStack Start + shadcn) **NÃO é adotada** — usamos só como referência de design/UX. **O backend simulado dela é ignorado** (a IA e o WhatsApp dela são placeholders; o nosso é real).
4. Trabalho é **só camada visual/UX das telas** + o fix P0 do telefone (abaixo).

## ✅ DESIGN DEFINIDO (usuário confirmou 24/05)
Identidade nova = **SaaS B2B clean, azul corporativo, tema CLARO** (igual `expense-ai-genius`).
- Tokens já migrados em `src/index.css` (paleta azul em HSL, mesmos nomes de variável; `:root`=claro, `.dark`=variante azul escura). **Não criar tokens novos sem avisar aqui.**
- Default do tema agora é **claro** (`ThemeContext` + anti-flash no `index.html`).
- Fontes mantidas (Bricolage/Hanken/JetBrains). A app **já suportava** tema claro (toggle existia) → telas que usam tokens semânticos (`bg-background` etc.) adaptam sozinhas.
- **Regra:** use SEMPRE classes semânticas (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `text-muted-foreground`). **Proibido cor hardcoded** (`bg-zinc-900`, `text-white`, etc.) — quebra o tema.

---

## 1. CONTRATO DE SCHEMA / NOMENCLATURA (o erro mais provável)

A referência usa nomes diferentes do banco real. **Sempre use a coluna da direita.**

| Conceito        | Referência (NÃO usar) | Banco REAL (usar)        |
|-----------------|-----------------------|--------------------------|
| Empresa         | `empresas`            | `empresa`                |
| Despesa         | `despesas`            | `despesa`                |
| Política        | `politicas`           | `politica`               |
| Regras política | `politica_regras`     | (campos em `politica`)   |
| Perfil          | `profiles`            | `profiles` ✅ (igual)     |
| Auditoria       | `audit_logs`          | `audit_trail`            |
| Convites        | (modelo próprio)      | `invitations`            |
| Telefone        | `telefone`            | `profiles.telefone`      |
| Canal           | `canal_origem`        | `despesa.canal` (`web`\|`whatsapp`) |

- **Acesso a dados:** sempre pelo client em `src/api/` (`despesas.js`, `politica.js`, `usuarios.js`) + RPCs já existentes. **Não chamar `supabase.from()` cru em componente novo** — passa pelo api client.
- **Telefone:** normalizar SEMPRE com `src/lib/telefone.js` (`normalizarTelefone` / `telefoneValido`). Guardar só dígitos com DDI. Ver skill `telefone-br`.

---

## 2. MAPA DE TELAS (referência → alvo)

| Referência (`/tmp/expense-ai-genius/src/routes`) | Alvo (`reembolsaa/src/pages`) | Rota | Dono (proposto) |
|---|---|---|---|
| `index.tsx` + `precos.tsx` | `LandingPage.jsx` | `/` | — |
| `login.tsx` / `entrar.tsx` | `LoginPage.jsx` | `/login` | **Claude** |
| `signup.tsx` / `cadastro.tsx` | `SignupPage.jsx` | `/cadastro` | **Claude** |
| (sem equiv. — modelo de convite é nosso) | `AceitarConvitePage.jsx` | `/aceitar-convite` | **Claude (P0)** |
| `onboarding.empresa.tsx` | `OnboardingPage.jsx` | `/comecar` | **Claude** |
| (parte de política) | `PolicyOnboardingPage.jsx` | `/comecar/politica` | Codex |
| `app.tsx` (shell+sidebar) | `ProtectedLayout` + `Sidebar` | — | Codex |
| `app.dashboard.tsx` | `DashboardPage.jsx` | `/dashboard` | Codex |
| `app.politica.tsx` | `PolicyPage.jsx` | `/politica` | Codex |
| `app.equipe.tsx` | `UsersPage.jsx` | `/usuarios` | Codex |
| `app.aprovacoes.tsx` + `app.pendencias.tsx` | `ApprovalPage.jsx` | `/aprovacoes` | Codex |
| `app.despesas.tsx` | `ReportsPage.jsx` | `/relatorios` | Codex |
| `app.whatsapp.tsx` (simular) | `NewExpensePage.jsx` | `/nova-despesa` | Codex |
| `app.configuracoes.tsx` | `SettingsPage.jsx` | `/configuracoes` | **Claude** |
| (detalhe violação) | `ViolationDetailPage.jsx` | `/alertas/:id` | Codex |
| (financeiro) | `FinancialPage.jsx` | `/financeiro` | Codex |
| `$.tsx` | `PageNotFound.jsx` | `*` | — |

> Mapeamento não é 1:1 (referência tem `auditoria`/`pendencias` separados que aqui são abas). A **estrutura de telas do alvo manda**; a referência é só visual.

---

## 3. REGRA DE NÃO-COLISÃO

- **Cada agente só edita os arquivos das telas que são dele** (coluna "Dono"). Componentes compartilhados (`src/components/ui/`, `src/lib/`, `src/api/`) → **avisar no doc antes de mexer** (seção 6, Log).
- Commits pequenos e atômicos, 1 tela por commit, mensagem `feat(telas): <tela>`.
- Quem mexer no design system (tokens/tema) faz **primeiro e sozinho**, commita, avisa, e só aí o outro segue (senão todo mundo rebaseia conflito).

---

## 4. P0 — FIX DO TELEFONE (dono: Claude) — bug que originou tudo

Hoje o telefone do colaborador só é capturado pelo admin (opcional) no `InviteModal`. O colaborador nunca informa o próprio WhatsApp → `profiles.telefone = null` → roteamento de WhatsApp quebra.

- [x] Campo WhatsApp **obrigatório** em `AceitarConvitePage.jsx` (colaborador define ao aceitar). ✅ Claude
- [x] Campo WhatsApp **obrigatório** em `SignupPage.jsx` (auto-cadastro; salva best-effort após sessão). ✅ Claude
- [x] Normalizar com `lib/telefone.js` (`garantirDDI` + `telefoneValido`), salvar via `atualizarTelefone`. ✅ Claude
- [x] Checagem de dado sujo: **5 de 6 profiles sem telefone** (banco `rqcvxnauxmgwgiqdlzuv`). ✅ medido
- [x] **Legados cobertos por GATE** (usuário escolheu): `CompletarPerfilPage.jsx` (`/completar-perfil`). `ProtectedLayout` redireciona quem tem empresa mas não tem telefone. ✅ Claude

## 5. DEFINITION OF DONE (gate — ninguém declara "pronto" sem isso)

1. `npm run build` verde + `npm test` verde no `reembolsaa/`.
2. **Teste E2E do fluxo:** convite → aceite (com telefone) → simulação de despesa WhatsApp → despesa criada na empresa certa → aparece em `/aprovacoes`. Com evidência (print/log), não "acho que funciona".
3. Sem `supabase.from()` cru em componente novo; tudo via `src/api/`.
4. Design confirmado pelo usuário (ver FLAG da seção 0).

## 6. LOG DE COORDENAÇÃO (cada agente anota o que pegou/terminou)

- _(Claude)_ Criou este contrato. Iniciando P0 (telefone em AceitarConvite + Signup).
- _(Claude)_ **lib/telefone.js**: adicionou export `garantirDDI(v)` (prepende `55` quando vem só DDD+número). Aditivo, não muda assinaturas existentes. Codex pode usar.
- _(Claude)_ **AceitarConvitePage.jsx** ✅ campo WhatsApp obrigatório (valida `telefoneValido(garantirDDI(...))`, salva via `atualizarTelefone(user.id, ...)`). Falha em salvar telefone = erro (é a chave de roteamento).
- _(Claude)_ **SignupPage.jsx** ✅ campo WhatsApp obrigatório + save best-effort após sessão.
- _(Claude)_ **Design system migrado** (`index.css` paleta azul-clean, default claro). Build verde + 30 testes OK. Telas semânticas já adaptam; Codex pode refazer as suas em cima disso.
- _(Claude)_ Medição: 5/6 profiles sem telefone → resolvido com GATE.
- _(Claude)_ **GATE de WhatsApp** ✅ `CompletarPerfilPage.jsx` + `needsPhone` no AuthContext + redirect no `ProtectedLayout` (App.jsx). AuthContext agora seleciona `telefone`. Build verde + 30 testes. **P0 COMPLETO.**
- _(Claude)_ Arquivos que toquei (NÃO mexer sem avisar): `lib/telefone.js`, `lib/AuthContext.jsx`, `lib/ThemeContext.jsx`, `index.html`, `index.css`, `App.jsx`, `pages/{AceitarConvite,Signup,CompletarPerfil}Page.jsx`.
- _(Claude)_ **Bug do índice único de telefone tratado:** `uq_profiles_telefone_ult11` é global (1 nº → 1 conta). Antes a tela crashava com erro cru do Postgres e o gate trancava quem tem nº já usado. Agora: `mensagemErroTelefone`/`isTelefoneDuplicado`/`skipPhoneGate` em `lib/telefone.js`; gate mostra msg amigável + "entrar mesmo assim" (sessionStorage) e `ProtectedLayout` respeita o skip; aceite usa msg amigável. **Achado de dado:** usuário tem 2 contas (gmail c/ telefone, jer@datarisk.io sem) — número 5511954686897 já está na do gmail; decisão de qual conta fica com o nº pendente com o usuário.
- _(Claude)_ **DEPLOY 25/05:** commit `5058a01` pushado em `origin/tech-lead-cleanup`; produção na Vercel (`reembolsaa.vercel.app`, dpl `DgBym1XBb1j3emYKWr326kCJrrQ5`, READY). Smoke OK: tema claro live, nossa versão Supabase, gate no bundle. Lint/30 testes/build verdes. **E2E WhatsApp PROVADO:** despesa `DR-95BB8CAB7F` (R$156, Alimentação, canal=whatsapp, pendente) roteou pro número → Datarisk.

## 🧪 PEDIDO AO CODEX — TESTES (ajuda solicitada pelo usuário 25/05)
Foco: cobrir o que entrou agora e está SEM teste. Não toque nos arquivos "Claude" exceto criando arquivos `*.test.js` novos.
1. **Unit (Vitest) para `src/lib/telefone.js`** — funções novas sem cobertura: `garantirDDI` (10/11 díg → prepend 55; já-com-DDI e fora-do-padrão inalterados), `isTelefoneDuplicado` (code `23505` e regex do nome do índice), `mensagemErroTelefone` (duplicado → msg fixa; outro erro → message/fallback; null → null), `phoneGateSkipped`/`skipPhoneGate` (sessionStorage).
2. **Lógica do gate**: testar `needsPhone` (empresa sem telefone = true; com telefone = false; sem empresa = false).
3. **QA manual** das telas que são suas (mapa seção 2) na produção `reembolsaa.vercel.app` (login `jer@datarisk.io`).
4. **DoD antes de declarar pronto:** `npm run lint` + `npm test` + `npm run build` verdes. Anote resultado aqui no log.
- _(Codex)_ …
