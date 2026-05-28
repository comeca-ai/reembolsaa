# PRD - Reembolsaaí

## 1. Visão do produto

O Reembolsaaí é um SaaS multi-tenant para gestão de reembolsos corporativos com política por empresa, captura de despesas por web e WhatsApp, análise automatizada com OCR/IA e fluxo de aprovação auditável.

O produto precisa permitir que cada empresa:

- cadastre sua própria organização
- configure sua própria política de reembolso
- convide sua equipe
- receba despesas por web e WhatsApp
- aprove, reprove e audite lançamentos
- acompanhe indicadores operacionais e de compliance

## 2. Problema

Hoje, muitas empresas controlam reembolso com planilha, e-mail, WhatsApp solto e política em PDF sem aplicação operacional real.

Isso gera:

- lentidão no processo
- baixa rastreabilidade
- inconsistência entre gestores
- risco de fraude e duplicidade
- dificuldade para escalar operação
- baixa confiança em auditoria

## 3. Objetivo do produto

Criar um sistema em que a política da empresa deixe de ser apenas um documento e passe a ser uma regra viva, aplicada automaticamente no fluxo de despesas.

O produto deve:

- reduzir esforço operacional do financeiro e da gestão
- permitir autoatendimento do colaborador
- garantir isolamento por empresa
- suportar canal WhatsApp sem confundir tenants
- automatizar tudo que estiver dentro da política
- encaminhar para revisão apenas o que exigir decisão humana

## 4. Princípios do produto

- multi-tenant real no banco, não só no frontend
- política da empresa como fonte de verdade
- UX simples para colaborador
- rastreabilidade total para aprovador e administrador
- automação com explicação e fallback
- nada mock em fluxo que pareça produção

## 5. Personas

### 5.1 Colaborador

Perfil:
- funcionário que realiza despesas em nome da empresa

Necessidades:
- lançar despesa com rapidez
- não preencher formulários complexos
- saber se a despesa foi aprovada, reprovada ou enviada para análise

### 5.2 Aprovador

Perfil:
- gestor responsável por validar despesas fora da aprovação automática

Necessidades:
- enxergar fila clara de pendências
- entender por que a despesa foi sinalizada
- aprovar ou reprovar com segurança

### 5.3 Administrador

Perfil:
- responsável por implantar e operar o tenant da empresa

Necessidades:
- configurar empresa e política
- convidar equipe
- cadastrar WhatsApp dos colaboradores
- manter dados operacionais corretos
- acompanhar compliance e operação

### 5.4 Financeiro

Perfil:
- responsável por pagamento e controle operacional/contábil

Necessidades:
- rastrear status
- entender histórico de aprovação
- acompanhar indicadores financeiros e de conformidade

## 6. Escopo funcional

### 6.1 Multi-tenant

O sistema deve:

- ter `empresa` como tenant principal
- relacionar usuários à empresa via `profiles.empresa_id`
- escopar todos os dados de negócio por `empresa_id`
- usar RLS para impedir acesso cruzado entre empresas
- armazenar documentos e comprovantes com isolamento por empresa
- exibir sempre na UI a empresa real da sessão

### 6.2 Gestão de usuários e equipe

O sistema deve:

- permitir convite por e-mail
- armazenar convites pendentes
- permitir aceite de convite com definição de senha
- manter papel do usuário
- permitir edição posterior de acesso e dados operacionais
- permitir cadastro e edição do WhatsApp do colaborador

### 6.3 Política da empresa

O sistema deve:

- permitir upload do PDF da política
- rodar OCR/IA para leitura do documento
- extrair regras estruturadas
- permitir revisão humana antes de ativação
- persistir regras por categoria
- manter vínculo entre documento, texto interpretado e regra salva
- permitir evolução/versionamento futuro

### 6.4 Captura de despesas

O sistema deve permitir envio por:

- web
- WhatsApp

Cada despesa deve ter, no mínimo:

- empresa
- colaborador
- categoria
- valor
- data
- comprovante
- canal de origem
- status
- resultado da análise de política

### 6.5 Aprovação

O sistema deve:

- aprovar automaticamente despesas dentro da política
- mandar para revisão despesas fora da política ou ambíguas
- permitir aprovação manual
- exigir comentário na reprovação
- registrar trilha de auditoria

### 6.6 Dashboard e indicadores

O sistema deve:

- mostrar números coerentes com os dados reais
- deixar claro o período consultado
- mostrar alertas de violação
- mostrar distribuição por categoria
- mostrar agrupamentos operacionais
- suportar leitura por aprovador, administrador e financeiro

## 7. Jornada do usuário

### 7.1 Jornada do administrador - implantação da empresa

1. Admin cria conta
2. Admin cria a empresa
3. Admin faz upload da política
4. Sistema lê a política com OCR/IA
5. Admin revisa as regras extraídas
6. Admin ativa a política
7. Admin convida equipe
8. Admin cadastra ou revisa WhatsApp dos colaboradores
9. Empresa fica pronta para operar

Resultado esperado:
- tenant criado
- política ativa
- equipe preparada
- roteamento por WhatsApp habilitado

### 7.2 Jornada do colaborador - envio pela web

1. Colaborador entra no sistema
2. Abre "Nova despesa"
3. Sobe comprovante
4. OCR lê dados do documento
5. Sistema sugere campos
6. Política é aplicada
7. Despesa:
   - aprovada automaticamente
   - ou enviada para análise
8. Colaborador acompanha status

Resultado esperado:
- baixo atrito
- decisão clara
- rastreabilidade

### 7.3 Jornada do colaborador - envio por WhatsApp

1. Colaborador envia comprovante para o número oficial
2. Sistema recebe o telefone do remetente
3. Sistema procura `profiles.telefone`
4. Sistema identifica colaborador e empresa
5. OCR/IA processa o comprovante
6. Política da empresa é aplicada
7. Despesa é criada no tenant correto
8. Sistema responde no fluxo operacional adequado

Se o telefone não estiver cadastrado:
- a despesa não deve ser criada
- o sistema deve recusar com aviso claro

Resultado esperado:
- um número central para várias empresas
- roteamento correto por colaborador/tenant

### 7.4 Jornada do aprovador

1. Aprovador entra no sistema
2. Acessa fila de pendências
3. Vê motivo da sinalização
4. Analisa comprovante, valor, categoria, política e histórico
5. Aprova ou reprova
6. Se reprovar, informa justificativa
7. A trilha de auditoria é registrada

Resultado esperado:
- fila clara
- decisão segura
- histórico auditável

### 7.5 Jornada do financeiro

1. Financeiro consulta despesas aprovadas
2. Verifica histórico e consistência
3. Marca pagamento quando aplicável
4. Acompanha indicadores e volume operacional

Resultado esperado:
- visão operacional
- rastreabilidade
- previsibilidade do processo

## 8. Requisitos funcionais

### 8.1 Requisitos de multi-tenant

- RF-01: cada empresa deve operar em tenant isolado
- RF-02: toda despesa deve estar ligada a `empresa_id`
- RF-03: toda política deve estar ligada a `empresa_id`
- RF-04: nenhum usuário pode ver dados de outra empresa
- RF-05: a empresa exibida na UI deve ser a empresa real da sessão

### 8.2 Requisitos de convites e usuários

- RF-06: admin pode convidar colaborador por e-mail
- RF-07: convite pendente deve permanecer visível
- RF-08: admin pode editar papel do usuário
- RF-09: admin pode cadastrar e corrigir WhatsApp
- RF-10: sistema deve distinguir status de convite e status operacional do WhatsApp

### 8.3 Requisitos de política

- RF-11: admin pode subir PDF da política
- RF-12: OCR/IA deve extrair regras estruturadas
- RF-13: admin deve revisar regras antes de salvar
- RF-14: sistema deve usar as regras salvas como base de decisão
- RF-15: política e decisão de despesa devem ser rastreáveis

### 8.4 Requisitos de captura de despesa

- RF-16: colaborador pode lançar despesa pela web
- RF-17: colaborador pode lançar despesa por WhatsApp se o telefone estiver cadastrado
- RF-18: sistema deve rejeitar telefone não reconhecido
- RF-19: cada despesa deve registrar o canal de origem
- RF-20: OCR deve preencher o máximo possível do lançamento

### 8.5 Requisitos de aprovação

- RF-21: despesa dentro da política pode ser aprovada automaticamente
- RF-22: despesa fora da política deve ir para revisão
- RF-23: aprovador pode aprovar ou reprovar
- RF-24: reprovação exige justificativa
- RF-25: toda decisão deve gerar trilha de auditoria

### 8.6 Requisitos de dashboard

- RF-26: dashboard deve usar dados reais do tenant
- RF-27: textos do dashboard devem refletir o período realmente consultado
- RF-28: alertas e score devem seguir a mesma lógica de conformidade
- RF-29: agrupamentos devem usar nomes de negócio corretos

## 9. Requisitos não funcionais

- RNF-01: isolamento entre empresas por RLS
- RNF-02: documentos e comprovantes isolados por empresa
- RNF-03: funções críticas devem estar versionadas no repositório
- RNF-04: deploy deve ser reproduzível na Vercel
- RNF-05: build, test, lint e typecheck precisam virar critérios de release
- RNF-06: UI não pode depender de mocks em rotas de produção
- RNF-07: fluxos críticos devem ser testáveis ponta a ponta

## 10. Matriz de permissões

| Ação | Colaborador | Aprovador | Administrador | Financeiro |
|---|---|---|---|---|
| Ver próprias despesas | Sim | Sim | Sim | Sim |
| Ver despesas da empresa | Não | Sim | Sim | Sim |
| Criar despesa via web | Sim | Opcional | Opcional | Opcional |
| Criar despesa via WhatsApp | Sim, se telefone cadastrado | Opcional | Opcional | Opcional |
| Aprovar despesa | Não | Sim | Sim | Opcional |
| Reprovar despesa | Não | Sim | Sim | Opcional |
| Marcar como paga | Não | Opcional | Sim | Sim |
| Convidar usuários | Não | Não | Sim | Não |
| Editar papéis | Não | Não | Sim | Não |
| Editar WhatsApp de colaborador | Não | Não | Sim | Não |
| Subir política | Não | Não | Sim | Não |
| Revisar regras da política | Não | Não | Sim | Não |
| Ver dashboard | Limitado | Sim | Sim | Sim |
| Ver relatórios | Não | Opcional | Sim | Sim |

## 11. Matriz de jornadas por persona

| Jornada | Colaborador | Aprovador | Administrador | Financeiro |
|---|---|---|---|---|
| Cadastro inicial | Não | Não | Sim | Não |
| Onboarding da empresa | Não | Não | Sim | Não |
| Convite de equipe | Não | Não | Sim | Não |
| Aceite de convite | Sim | Sim | Sim | Sim |
| Cadastro de WhatsApp | Não direto | Não direto | Sim | Não |
| Envio de despesa | Sim | Opcional | Opcional | Opcional |
| Revisão de pendência | Não | Sim | Sim | Opcional |
| Pagamento | Não | Opcional | Sim | Sim |
| Configuração da política | Não | Não | Sim | Não |
| Acompanhamento por dashboard | Limitado | Sim | Sim | Sim |

## 12. Matriz de consistência do sistema

| Tema | O que precisa ser consistente |
|---|---|
| Tenant | sessão, `profiles.empresa_id`, `empresa.nome`, UI |
| Convites | `invitations`, `profiles`, lista de usuários, aceite |
| WhatsApp | `profiles.telefone`, UI de usuários, webhook, tenant resolvido |
| Política | PDF, OCR, texto interpretado, regras salvas |
| Despesa | comprovante, OCR, categoria, política aplicada, status |
| Aprovação | decisão humana, motivo, auditoria, dashboard |
| Dashboard | query real, cálculo, rótulo visual, período exibido |

## 13. Critérios de sucesso

- empresa consegue sair do cadastro até operação sem intervenção manual técnica
- colaborador consegue lançar despesa com baixo atrito
- aprovador entende por que está aprovando ou reprovando
- administrador confia que a política da empresa está sendo aplicada
- despesas de WhatsApp entram no tenant correto
- números do dashboard batem com os dados reais
- auditoria consegue rastrear origem, decisão e política aplicada

## 14. Riscos principais

- interface mostrar tenant diferente do tenant real
- convites persistirem e “sumirem” na UI
- política OCR divergir da regra efetivamente aplicada
- telefone de WhatsApp não identificar corretamente o colaborador
- dashboard comunicar uma lógica diferente da lógica real
- módulos mock passarem impressão de produção

## 15. Fora de escopo inicial

- múltiplos tenants ativos por usuário na mesma sessão
- ERP completo
- folha de pagamento
- política sem revisão humana em cenários ambíguos
- experiência mobile nativa dedicada

## 16. Decisão de produto

O Reembolsaaí não é apenas um app de formulário de despesa.

Ele deve ser tratado como:

- plataforma multi-tenant
- motor de política por empresa
- sistema de captura multicanal
- fluxo de aprovação auditável
- camada operacional de compliance
