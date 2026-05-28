# Skills da Squad - Reembolsaaí

Este documento lista as skills necessarias para reproduzir uma equipe de software capaz de manter e evoluir o Reembolsaaí.

Cada skill pode ser vista como uma especializacao operacional da squad.

## 1. Product Discovery

- Traduz problema de cliente em requisito claro
- Define criterio de aceite
- Prioriza por impacto em receita, risco e operacao
- Distingue bug, debito tecnico, gap de UX e evolucao de produto

## 2. SaaS Multi-Tenant

- Entende tenant, empresa ativa, escopo por `empresa_id`
- Identifica riscos de mistura entre tenants
- Revisa consistencia entre sessao, `profiles`, `empresa` e UI
- Garante que telas reflitam o tenant real logado

## 3. Supabase Auth e Convites

- Domina login, signup, aceite de convite e sessao por link
- Entende `inviteUserByEmail`, `profiles`, `invitations` e trigger `handle_new_user`
- Sabe diferenciar convite persistido, profile criado e usuario ativo
- Revisa fluxos onde dados "somem" entre persistencia e interface

## 4. Row-Level Security

- Define e revisa policies por tenant e por papel
- Garante isolamento entre empresas
- Garante que admin, aprovador, financeiro e colaborador tenham acesso correto
- Audita riscos de leitura/escrita indevida

## 5. Modelagem de Dados de Reembolso

- Entende entidades principais:
  - empresa
  - profile
  - invitation
  - politica
  - despesa
  - audit_trail
- Sabe evoluir schema sem quebrar o produto
- Mapeia regra de negocio em coluna, enum, constraint e RPC

## 6. Frontend de Operacao SaaS

- Construi interfaces administrativas claras
- Mantem consistencia entre loading, erro, vazio e sucesso
- Garante que telas de configuracao nao usem mocks locais em fluxo produtivo
- Organiza componentes por dominio e reuso

## 7. Dashboard e Metricas

- Garante coerencia entre dado bruto, regra de calculo e texto exibido
- Revisa KPIs, score, agrupamentos, periodos e alertas
- Valida se dashboard fala "este mes" quando a query realmente filtra o mes
- Protege contra metricas semanticamente erradas

## 8. Fluxo de Despesas e Aprovacoes

- Entende criacao de despesa, policy check, aprovacao automatica e fila manual
- Revisa status: `pendente`, `aprovada-n1`, `paga`, `reprovada`
- Garante rastreabilidade em `audit_trail`
- Avalia impacto de mudanças em compliance e financeiro

## 9. OCR e Extracao de Politica

- Processa PDF/imagem
- Extrai texto e estrutura de politica
- Garante fallback quando a IA falhar
- Mantem qualidade das regras extraidas por categoria

## 10. IA de Conformidade

- Analisa despesa contra politica estruturada e texto de politica
- Produz justificativa auditavel
- Evita automacao errada em caso ambiguo
- Distingue aprovar automaticamente vs enviar para revisao

## 11. Testes de Fluxo Critico

- Define cobertura minima para:
  - login
  - cadastro
  - criacao de empresa
  - convite
  - aceite de convite
  - configuracao de politica
  - nova despesa
  - aprovacao
  - dashboard
- Garante regressao baixa em fluxos centrais

## 12. Refatoracao e Organizacao de Codigo

- Quebra paginas grandes
- Remove duplicacao
- Unifica naming
- Move regra de dominio para camadas corretas
- Reduz acoplamento entre tela e persistencia

## 13. Observabilidade e Incidentes

- Analisa logs
- Identifica quebra de fluxo em producao
- Define alertas por erro critico
- Mantem runbooks para incidentes de login, convite, politica e persistencia

## 14. DevOps e Release

- Mantem build, envs, deploy e rollback
- Define pipeline minima:
  - lint
  - test
  - build
  - typecheck
- Evita release de modulo mock como se fosse producao

## 15. Seguranca e Compliance

- Revisa seguranca do storage
- Revisa acesso por papel
- Garante trilha de auditoria
- Protege documentos e dados de despesas
- Avalia impacto regulatorio de IA e comprovantes

## 16. Customer Feedback Loop

- Traduz queixa de cliente em bug reproduzivel
- Organiza incidentes por severidade
- Detecta divergencia entre o que a tela mostra e o que o banco realmente tem
- Fecha o ciclo entre operacao real e backlog

## Mapa de skills por agente

### Product Owner

- Product Discovery
- Customer Feedback Loop
- Dashboard e Metricas

### Tech Lead

- SaaS Multi-Tenant
- Refatoracao e Organizacao de Codigo
- Dashboard e Metricas
- Supabase Auth e Convites

### Frontend Engineer

- Frontend de Operacao SaaS
- Dashboard e Metricas
- Fluxo de Despesas e Aprovacoes

### Backend Engineer

- Supabase Auth e Convites
- Fluxo de Despesas e Aprovacoes
- Observabilidade e Incidentes

### Supabase/Data Engineer

- Row-Level Security
- Modelagem de Dados de Reembolso
- SaaS Multi-Tenant

### AI/Automation Engineer

- OCR e Extracao de Politica
- IA de Conformidade

### QA Engineer

- Testes de Fluxo Critico
- Dashboard e Metricas
- Customer Feedback Loop

### DevOps / SRE

- DevOps e Release
- Observabilidade e Incidentes
- Seguranca e Compliance

### Security / Compliance Engineer

- Seguranca e Compliance
- Row-Level Security
- SaaS Multi-Tenant

## Skills obrigatorias para a squad minima

- SaaS Multi-Tenant
- Supabase Auth e Convites
- Row-Level Security
- Frontend de Operacao SaaS
- Fluxo de Despesas e Aprovacoes
- Dashboard e Metricas
- Testes de Fluxo Critico
- DevOps e Release

## Resultado esperado

Quando essa squad domina essas skills, ela consegue:

- manter um SaaS multiempresa com seguranca
- operar onboarding de empresa e usuarios
- sustentar politica e aprovacao com rastreabilidade
- garantir dashboards confiaveis
- evoluir IA sem perder controle de negocio
- publicar com qualidade e previsibilidade
