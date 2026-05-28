---
name: frontend-reembolsaa
description: Agente de frontend para evoluir o Reembolsaaí com rapidez, polish visual e foco comercial. Use ao redesenhar, refatorar ou criar telas e componentes em `/root/reembolsaai/reembolsaa`, especialmente quando for preciso combinar referência visual externa com os fluxos reais do produto (Supabase, onboarding, política, WhatsApp, aprovações e auditoria) sem quebrar o app existente. Também use quando a meta for deixar landing pages e telas públicas mais vendáveis, mais claras e mais consistentes em mobile.
---

# Frontend Reembolsaaí

Skill para mexer no frontend do Reembolsaaí sem perder o contrato do produto real.

Objetivo extra deste agente: não só "deixar bonito", mas aumentar clareza de produto, percepção de valor e capacidade de conversão.

## Escopo travado
- Projeto-alvo: `/root/reembolsaai/reembolsaa`
- Stack: React + Vite + Tailwind + Supabase
- Backend real deve ser preservado
- Referência visual externa é só referência; nunca substituir o app real por template isolado

## Antes de editar
1. Ler a rota, página e componentes envolvidos.
2. Confirmar se a mudança é em tela pública, onboarding ou app autenticado.
3. Descobrir de onde os dados vêm:
   - `src/api/*.js`
   - `src/lib/AuthContext.jsx`
   - RPCs e Edge Functions já existentes
4. Se houver referência visual externa, tratar como direção de layout e linguagem visual, não como fonte de código de backend.
5. Se a tarefa for comercial/marketing, definir explicitamente:
   - ICP principal
   - promessa principal
   - CTA primário
   - objeção principal a derrubar

## Guardrails
- Não trocar `reembolsaa/` por outro projeto.
- Não quebrar login, cadastro, onboarding, política, WhatsApp, aprovações ou auditoria.
- Não chamar `supabase.from()` cru em componente novo; usar `src/api/*.js` ou ampliar o client existente.
- Preferir classes semânticas (`bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`) para manter o tema consistente.
- Quando a intenção visual for tema claro, verificar se `ThemeContext`, `localStorage` e `.dark` não estão sabotando a tela.
- Em páginas públicas, validar explicitamente o comportamento de tema antes de deploy.
- Em landing pages, evitar texto meta sobre "esta landing" ou "esta versão". A cópia deve vender o produto, não comentar o design.
- Não deixar a página longa por inércia. Cada seção precisa justificar sua existência.
- Se houver dúvida entre "mais blocos" e "mais clareza", preferir mais clareza.

## Modo conversão
Quando a tarefa envolver landing, homepage, pricing, signup, login ou onboarding comercial:

1. Começar pela mensagem, não pelo layout.
2. Garantir:
   - headline com promessa clara
   - subheadline com mecanismo ou diferencial
   - CTA primário visível sem scroll
   - prova de valor em até 2 blocos
   - uma seção de dor
   - uma seção de funcionamento
   - um fechamento com CTA forte
3. Cortar qualquer seção que só repita argumento anterior.
4. Fazer um passe de densidade:
   - menos altura morta
   - menos padding excessivo
   - menos texto explicativo repetido
5. Fazer um passe de mobile:
   - headline quebra bem
   - botões ficam clicáveis
   - grids degradam para 1 coluna sem ruído
   - cards não explodem altura por texto ruim

## Checklist de polish
- A dobra inicial responde em segundos:
  - o que é
  - para quem é
  - por que é melhor
  - qual a próxima ação
- CTA principal não compete com três outros CTAs.
- Hierarquia visual clara entre:
  - headline
  - supporting copy
  - CTA
  - prova
- Cards e seções não parecem "empilhados sem intenção".
- Cores ajudam conversão; não viram ruído decorativo.
- O scroll parece progressão, não acúmulo.
- Nenhum erro de runtime por import, ícone, hook ou estado.

## Fluxo de trabalho
1. Inspecionar a tela alvo e a navegação associada.
2. Levantar restrições do fluxo real no código local.
3. Se for página pública, fazer primeiro um mini-audit comercial antes de editar.
4. Aplicar a mudança visual ou estrutural com o menor impacto possível na lógica.
4. Conferir estados críticos:
   - carregamento
   - erro
   - vazio
   - CTA principal
   - responsividade
   - dobra inicial
   - comprimento total da página
5. Validar:
   - `npm run build`
   - `npm test`
6. Se a mudança afetar produção, só então fazer deploy.

## Referências do projeto
- Contrato visual e de migração de telas: `/root/reembolsaai/reembolsaa/CONTRATO-CLAUDE-CODEX.md`
- Arquitetura e fluxos reais: `/root/reembolsaai/reembolsaa/documentacao.md`
- Jornada e expectativas do produto: `/root/reembolsaai/reembolsaa/jornada-do-usuario.md`
- Plano pendente e follow-ups: `/root/reembolsaai/reembolsaa/ajustes.md`
- Heurísticas de polish comercial: `references/conversion-polish.md`

## Casos típicos
- Portar uma tela do template para o app real
- Reestilizar landing, login, signup e onboarding
- Unificar linguagem visual entre páginas públicas e internas
- Reorganizar dashboards, tabelas e cards sem mexer no backend
- Corrigir regressões de tema claro/escuro
- Encurtar landing pages para reduzir scroll e aumentar foco
- Reescrever CTA, headline e ordem das seções para vender melhor
- Fazer "mobile pass" depois do visual desktop

## Definição de pronto
- A tela mudou no projeto certo
- O fluxo real continua intacto
- Build e testes passaram
- O resultado visual está consistente com a direção pedida pelo usuário
- A página está mais clara comercialmente do que antes
- O CTA principal ficou mais forte ou mais fácil de encontrar
