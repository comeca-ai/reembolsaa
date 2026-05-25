# Auditoria de frontend — produção (reembolsaa.vercel.app) — 25/05/2026

Auditoria visual + de código das telas **públicas** (sem login). Telas internas
(dashboard, política, usuários, aprovações etc.) exigem credenciais e ficaram
fora deste passe. Console sem erros de runtime nas telas auditadas.

## P0 — Vazamento de copy "meta" (fala do template/deploy para o usuário)
A skill `frontend-reembolsaa` proíbe copy que comenta o design/deploy. Está vazando
para prospects no funil público. Reescrever para copy que **vende/instrui**, sem citar
"template", "deploy" ou "Supabase".
- `src/pages/LoginPage.jsx:61` — badge "Fluxos reais preservados no backend"
- `src/pages/LoginPage.jsx:67` — "Este deploy usa a linguagem visual do template, mas continua conectado ao onboarding, politica, WhatsApp e aprovacoes do produto real."
- `src/pages/SignupPage.jsx:111` — badge "Fluxos combinados no app real"
- `src/pages/SignupPage.jsx:117` — "O visual segue o template claro de referencia, mas o cadastro continua conectado ao Supabase real, ao gate de WhatsApp e ao fluxo da sua empresa."

## P0 — Marca escrita errada
- `src/pages/LoginPage.jsx:55` e `src/pages/SignupPage.jsx` (≈106) — "Reembolsaai" → **"Reembolsaaí"** (com í).

## P1 — Acentuação/cedilha ausente em TODA a copy pública
Toda a copy visível da landing, login e cadastro foi escrita **sem acentos/cedilha**
("politica", "operacao", "aprovacao", "decisao", "criterio", "automacao", "excecoes",
"confianca", "Ate", "usuarios", "serio", "nao", "voce", "minimo", "referencia", "historico"…).
Faz o produto parecer quebrado para todo prospect.
- `src/pages/LandingPage.jsx` — copy nas linhas 22, 39, 44, 56, 62, 67, 73–75, 83–84, 90, 110, 113, 118, 164, 167, 203, 212, 224, 262, 265, 312, 335, 344, 431 (e demais textos visíveis).
- `src/pages/LoginPage.jsx` — linhas 10–12, 64, 67 (e labels/placeholders).
- `src/pages/SignupPage.jsx` — linhas 14, 114, 117 (e labels/placeholders: "Joao Silva", "numero sera", "Minimo de 8 caracteres", "Ja tem conta").

### ⚠️ Guardrail obrigatório (NÃO fazer find-replace cego)
Acentuar **somente texto visível** (JSX text, `label`, `placeholder`, títulos, descrições).
NÃO alterar:
- Rotas/paths: `/politica`, `/usuarios`, `/aprovacoes`, `/configuracoes`, `/comecar/politica`.
- Imports/identificadores: `extrairPolitica`, `politica_texto`, `politica_documento`.
- Nomes de bucket/coluna do Supabase: `"politicas"`, etc.
- Chaves de objeto e nomes de variável.
Ex.: em `PolicyOnboardingPage.jsx` quase todo "politica" é código — não tocar.

## P2 — Sub-rótulo de marca em inglês
- `src/pages/LoginPage.jsx:56` e `src/pages/SignupPage.jsx:106` — "expense control" (EN) num produto pt-BR. Avaliar "controle de despesas" (decisão de marca; confirmar antes de trocar em massa).

## Densidade mobile (P2)
- Landing mobile (390px): bloco de métricas ("3 min / 1 fluxo / 0 caos / 100%") com muita
  altura morta empilhada. Apertar espaçamento vertical no mobile.

## Gates após correção
`npm run build` + `npm run lint` + `npm test` verdes. Deploy é do `devops-deploy` (não nesta tarefa).
