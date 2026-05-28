---
name: campo-end-to-end
description: Receita para adicionar um campo de dados ponta a ponta no Reembolsaaí (migration → leitura/RPC → escrita/Edge Function → API client → UI), com a ordem de execução e a DoD de cada camada. Use ao planejar ou implementar qualquer novo campo de profiles/empresa/despesa que precise aparecer e ser editável na interface.
---

# Campo end-to-end (Reembolsaaí)

Ordem obrigatória (**dado antes de UI**) e DoD por camada:

1. **Migration** — `supabase-backend`. `alter table ... add column`; índice se for chave de busca/match. **DoD:** coluna existe; migration versionada em `supabase/migrations/`.
2. **Leitura** — `supabase-backend`. Se a tela carrega via RPC (ex.: `equipe_da_empresa`), a RPC **precisa retornar a nova coluna**. **DoD:** RPC retorna o campo. ⚠️ Esquecer isso = UI mostra vazio mesmo com dado no banco (erro silencioso clássico).
3. **Escrita** — `supabase-backend`. Edge Function (service-role) **ou** `update` direto pelo client (depende da RLS). **DoD:** gravação funciona com o papel real do usuário.
4. **API client** — `frontend`. `src/api/*.js`: incluir o campo no payload + função de update. **DoD:** client envia/atualiza o campo.
5. **UI** — `frontend`. Form de criação + exibição na lista + edição. **DoD:** admin cria, vê e edita pela tela.
6. **Gate** — `tech-lead` (RLS multi-tenant, secrets, papéis) → **Deploy** — `devops-deploy`.

## RLS — confira ANTES de assumir que o client grava
`profiles` já tem `profiles_admin_manage` (ALL, `empresa_id = current_empresa_id() AND is_admin()`) e `profiles_update_self`. Logo: admin edita colaborador da própria empresa pelo client; colaborador edita o próprio. Para **outras tabelas**, confirme a policy de UPDATE antes — senão o `update` falha silencioso na RLS.

## Não esqueça
- **Convites pendentes:** o profile já existe logo após o invite (trigger `handle_new_user`). Então o campo deve aparecer **também para pendentes** — não condicione a "já aceitou".
- **Stack real do front:** ver agente `frontend` (React 18 + Vite + JS com `jsconfig`, dados em `src/api/*.js`, mocks em `src/lib/mocks/`, build `npm run build`). Não invente `src/types`/stores TS.
- Campos de telefone/WhatsApp: aplicar a skill `telefone-br`.
