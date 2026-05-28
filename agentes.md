# Squad de Software - Reembolsaaí

Este documento define uma squad de software para manter e evoluir um SaaS como o Reembolsaaí.

Objetivo da squad:
- manter o produto estavel
- evoluir o SaaS multi-tenant
- sustentar operacao, onboarding, compliance, IA e crescimento

## Estrutura da squad

### 1. Product Owner

- Missao: priorizar roadmap, traduzir problema de negocio em backlog e garantir alinhamento com clientes.
- Foco:
  - onboarding de empresas
  - politica de reembolso
  - aprovacao
  - auditoria
  - indicadores do dashboard
- Entregaveis:
  - backlog priorizado
  - criterios de aceite
  - definicao de modulos prontos vs roadmap

### 2. Tech Lead

- Missao: garantir qualidade tecnica, coerencia arquitetural e ritmo de entrega.
- Foco:
  - fronteira frontend/backend
  - multi-tenant
  - RLS
  - integridade de fluxo
  - refatoracao
- Entregaveis:
  - direcao tecnica
  - padroes de codigo
  - revisao de arquitetura
  - plano de debito tecnico

### 3. Frontend Engineer

- Missao: manter a experiencia web, dashboards, telas administrativas e consistencia de interface.
- Foco:
  - login/cadastro
  - onboarding
  - usuarios
  - politica
  - dashboard
  - aprovacoes
- Entregaveis:
  - interfaces responsivas
  - componentes reutilizaveis
  - estados de erro/loading
  - integracao com APIs

### 4. Backend Engineer

- Missao: sustentar regras de negocio, contratos de API, funcoes server-side e consistencia de persistencia.
- Foco:
  - convites
  - despesas
  - aprovacao
  - auditoria
  - webhooks
  - filas futuras
- Entregaveis:
  - APIs e funcoes confiaveis
  - validacoes server-side
  - protecao contra inconsistencias

### 5. Supabase/Data Engineer

- Missao: cuidar de schema, migrations, RLS, RPCs e modelagem multi-tenant.
- Foco:
  - `empresa`
  - `profiles`
  - `invitations`
  - `politica`
  - `despesa`
  - `audit_trail`
- Entregaveis:
  - migrations
  - policies
  - funcoes RPC
  - consultas performaticas
  - governanca de dados

### 6. AI/Automation Engineer

- Missao: manter os fluxos de IA que leem politica, analisam despesa e apoiam automacao.
- Foco:
  - OCR
  - extracao de politica
  - analise de conformidade
  - explainability
  - fallback de modelos
- Entregaveis:
  - prompts
  - contratos de entrada/saida
  - avaliacao de qualidade
  - mecanismos de degradacao segura

### 7. QA Engineer

- Missao: proteger regressao funcional e validar fluxos criticos do SaaS.
- Foco:
  - convite
  - aceite de convite
  - criacao de empresa
  - politica
  - dashboard
  - aprovacoes
  - multitenancy
- Entregaveis:
  - matriz de testes
  - testes de fluxo critico
  - testes de regressao
  - checklist de release

### 8. DevOps / SRE

- Missao: garantir deploy, observabilidade, confiabilidade e seguranca operacional.
- Foco:
  - build
  - variaveis de ambiente
  - deploy
  - logs
  - alertas
  - backup
- Entregaveis:
  - pipeline de deploy
  - monitoramento
  - runbooks
  - gestao de incidentes

### 9. Security / Compliance Engineer

- Missao: proteger dados, revisar acesso e garantir aderencia de auditoria/compliance.
- Foco:
  - RLS
  - acesso por papel
  - trilha de auditoria
  - segregacao entre empresas
  - seguranca de documentos
- Entregaveis:
  - revisao de risco
  - hardening de acesso
  - checklist de compliance

### 10. Customer Success / Support Engineer

- Missao: fechar o ciclo entre produto e cliente, identificando bugs reais e gargalos operacionais.
- Foco:
  - onboarding de empresa
  - convite de usuarios
  - erros de login
  - politica
  - aprovacoes
- Entregaveis:
  - feedback estruturado
  - incidentes reproduziveis
  - priorizacao por impacto real

## Squad minima recomendada

Para operar bem o Reembolsaaí, a squad minima pode ser:

- 1 Product Owner
- 1 Tech Lead
- 1 Frontend Engineer
- 1 Backend Engineer
- 1 Supabase/Data Engineer
- 1 QA Engineer

Suporte compartilhado:

- 1 AI/Automation Engineer
- 1 DevOps / SRE
- 1 Security / Compliance Engineer

## Fluxo operacional da squad

### Ciclo semanal

- Segunda: priorizacao do backlog e alinhamento tecnico
- Durante a semana: desenvolvimento, revisao, testes e validacao
- Quinta/Sexta: homologacao, correcoes e preparo de release
- Fechamento: aprendizado, incidentes e proxima iteracao

### Fluxo por demanda

1. Product Owner define problema e criterio de aceite
2. Tech Lead quebra a demanda
3. Frontend e Backend implementam
4. Data Engineer valida schema/RLS
5. QA valida fluxo e regressao
6. DevOps publica e monitora
7. CS retorna impacto real dos clientes

## Areas permanentes de ownership

### Produto

- onboarding da empresa
- convites e equipe
- politica de reembolso
- despesas e aprovacoes
- auditoria e relatorios

### Plataforma

- autenticacao
- multi-tenant
- supabase
- edge functions
- observabilidade
- seguranca

### Inteligencia

- OCR
- interpretacao de politica
- classificacao de despesa
- justificativas e trilha explicavel

## Indicadores da squad

- taxa de erro em login e convite
- tempo medio para primeira empresa ativa
- tempo medio da primeira politica configurada
- taxa de despesas aprovadas automaticamente
- tempo medio de aprovacao manual
- bugs em producao por release
- tempo de restauracao em incidente
- numero de regressões por fluxo critico

## Principios da squad

- multi-tenant e fonte unica de verdade no banco
- toda tela administrativa deve refletir persistencia real
- dashboard precisa bater com os dados e com o texto exibido
- nada de mock em rotas que parecem producao
- toda automacao precisa ser auditavel
- UX clara para empresa, gestor, aprovador e colaborador
