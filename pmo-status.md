# PMO — Ledger de Handoff (Fase 8: WhatsApp como chave de roteamento)

> Dono deste arquivo: agente **pmo**. Fonte do plano: `ajustes.md` (Fase 8, itens `[MVP]`).
> Legenda status: ⬜ a fazer · 🔵 em execução · ✅ DoD aprovada · ❌ DoD reprovada · ⛔ bloqueada

## Sequência [MVP] (dado antes de UI)

| # | Tarefa (ajustes.md) | Dono | Depende de | Status | Evidência |
|---|---|---|---|---|---|
| T1 | RPC `equipe_da_empresa()` retornar `telefone` | supabase-backend | — | ✅ | migration `equipe_da_empresa_telefone` aplicada; RPC retorna `telefone` (multi-tenant + pending preservados) |
| T2 | `convidar-usuario` aceitar `telefone` e gravar no profile pós-invite | supabase-backend | — | ✅ | v4 deployada; grava telefone (convite novo + reenvio) |
| T3 | `src/api/usuarios.js`: enviar `telefone` no convite + `atualizarTelefone()` | frontend | T1, T2 | ✅ | `src/lib/telefone.js` + `usuarios.js`; build verde; `telefone.test.js` 14 casos (suíte 30/30) |
| T4 | Campo "WhatsApp" no `InviteModal.jsx` (validação `telefone-br`) | frontend | T3 | ✅ | campo + validação no submit; build verde |
| T5 | Lista de usuários: exibir `telefone` (incl. pendentes) + editar via `EditRoleModal.jsx` | frontend | T1, T3 | ✅ | coluna na tabela/mobile, edição via EditRoleModal→`atualizarTelefone`; `listProfiles` traz telefone de pendentes |
| T6 | Gate tech-lead + hardening | tech-lead | T1–T5 | ✅ | bloqueou; corrigido: #2 regressão, #5 UNIQUE telefone, #6 trigger anti-auto-promoção; funções/migrations versionadas no repo |
| T7 | Deploy frontend (Vercel, prod) | devops-deploy | T6 | ✅ | READY — dpl_45GL7C…; produção (reembolsaa.vercel.app) |
| T8 | Testes **contínuos** (junto de cada tarefa com lógica): normalização `telefone-br`, `atualizarTelefone`, parsing de telefone no `convidar-usuario` | unit-test | junto de T2/T3 | ⬜ | — |

> **Decisão 24/05:** testes unitários são **contínuos**, não etapa final — o `unit-test` escreve teste junto de cada tarefa que tem lógica. T1 (RPC em SQL) não tem unit test; os testes começam em T2/T3.

Polimento (após MVP): estados/badge do canal, busca por telefone, textos de convite/onboarding, exibição na aprovação, alerta de número não cadastrado. (Ver `ajustes.md` Fase 8.)

## Já no ar (não re-fazer)
- `profiles.telefone` (migração `add_telefone_to_profiles`) + índice por dígitos.
- `whatsapp-evolution` v6 (roteia por telefone) · `whatsapp-ingest` v12 (`colaborador` + `canal='whatsapp'`).
- RLS de `profiles` já permite admin editar colaborador da empresa (`profiles_admin_manage`).

## Bloqueios / riscos abertos
- Nomes de componentes (`InviteModal.jsx`, `EditRoleModal.jsx`) marcados como confirmados no `ajustes.md` — o dono deve validar o caminho no 1º passo.
- Pendências de segurança (fora da feature): revogar PAT exposto; limpar Datarisk duplicada. Ver `ajustes.md`.

---

## ✅ T1 concluída (GATE aprovado 24/05)
Migration `equipe_da_empresa_telefone` aplicada; `pg_get_functiondef` confirma `telefone` no retorno, multi-tenant + pending intactos.

## 🏁 FASE 8 MVP CONCLUÍDA (24/05) — no ar
T1–T7 ✅. Backend (RPC+convidar) + helper/api + testes (30/30) + UI (convite/lista) + hardening de segurança (#5 UNIQUE telefone, #6 anti-auto-promoção) + repo versionado + deploy de produção READY.

**Follow-ups:** revogar os 2 PATs do Supabase expostos no chat. ⚠️ A 2ª "Datarisk" (`51598677`, login `jer@datarisk.io`) **NÃO é lixo** — tem 10 despesas + 5 políticas (ativa até 22/05); decidir COM o usuário (manter as duas / consolidar), **nunca apagar**. `enviar-despesa.html` removido ✅. `criar-despesa` mantida (fallback de OCR externo). Itens [Polimento] da Fase 8 (badge de estado do canal, busca por telefone, textos de onboarding, exibição na aprovação).

## (sem pacote ativo — fase concluída) Histórico do último pacote:

```
TASK: [MVP] GATE de segurança/arquitetura da Fase 8
OWNER: tech-lead
INPUTS:
  - migration equipe_da_empresa_telefone (RPC SECURITY DEFINER, multi-tenant)
  - supabase/functions/convidar-usuario/index.ts (v4)
  - supabase/functions/whatsapp-evolution/index.ts (v6, roteia por telefone)
  - supabase/functions/whatsapp-ingest/index.ts (v12)
  - src/lib/telefone.js, src/api/usuarios.js, InviteModal/EditRoleModal/UsersTable/UsersPage
DoD (veredito):
  - Multi-tenant: roteamento por telefone não vaza despesa entre empresas; RPC só a empresa do caller
  - atualizarTelefone respeita RLS (admin só edita a própria empresa — profiles_admin_manage)
  - Sem secrets no código/bundle do client
  - npm run build verde + npm test verde
  - Veredito explícito: APROVADO PARA DEPLOY ou BLOQUEADO + o que falta
BLOCKERS: T1–T5 ✅
```

Depois: T7 deploy (devops-deploy) — só após APROVADO.
