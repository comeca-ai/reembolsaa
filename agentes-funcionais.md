# Agentes Funcionais do Reembolsaa

Este documento define agentes operacionais e comerciais do Reembolsaa com foco em uso real:

- cada agente tem um momento claro de entrada na jornada
- cada agente tem trigger de ativação
- cada agente tem canal de comunicação
- cada agente tem autonomia limitada
- cada agente tem condição clara de saída

Objetivo: evitar "agente genérico" e transformar IA em fluxos funcionais, auditáveis e acionáveis.

## Princípios

- Regra da empresa sempre vence inferência da IA.
- Despesa ambígua nunca é aprovada automaticamente.
- Toda ação sensível precisa deixar trilha em auditoria.
- WhatsApp e e-mail são canais de comunicação; decisão final de risco e dinheiro continua controlada.
- O agente sugere, orienta, resume e acelera. Só executa sozinho quando o risco é baixo.

## Canais

- `App`: interface principal de configuração, revisão e operação.
- `WhatsApp`: coleta de comprovantes, nudges, resposta rápida ao colaborador.
- `E-mail`: convites, onboarding, cobrança de pendências, reativação e comunicação formal.

## Jornada do cliente

### 1. Entrada

Momento em que o cliente vira conta ativa ou trial.

Agentes principais:

- Agente de Prospecção
- Agente de Onboarding
- Agente de Política

### 2. Operação ativa

Momento em que colaboradores enviam despesas e gestores aprovam.

Agentes principais:

- Agente do Colaborador
- Agente de Compliance
- Agente do Aprovador
- Agente Financeiro
- Agente de Atendimento

### 3. Saída, risco ou reativação

Momento em que a conta reduz uso, trava operação ou ameaça churn.

Agentes principais:

- Agente de Churn e Sucesso
- Agente de Atendimento
- Agente de Prospecção de reativação

## 1. Agente de Prospecção

### Missão

Converter lead em oportunidade qualificada e entregar contexto comercial limpo para demo ou fechamento.

### Quando entra

- lead preenche formulário
- lead responde campanha outbound
- lead chama no WhatsApp comercial
- lead agenda demonstração

### Trigger

- novo lead criado no CRM
- nova conversa no WhatsApp comercial
- formulário enviado com porte, segmento ou volume de reembolsos

### Canais

- `WhatsApp`
- `E-mail`
- `Landing page + CRM`

### Habilidades

- qualificar ICP
- identificar volume de despesas, tamanho da equipe, aprovadores e dor atual
- entender processo atual: planilha, ERP, cartão, e-mail, WhatsApp
- marcar demo
- resumir objeções
- classificar urgência e potencial

### Ferramentas e dados

- CRM
- formulários
- base comercial
- playbook de ICP

### Pode fazer sozinho

- conduzir descoberta inicial
- sugerir demo
- classificar lead
- disparar follow-up

### Não pode fazer

- prometer feature inexistente
- negociar exceção comercial relevante sozinho
- vender integração não implementada

### Saída

- demo agendada
- lead desqualificado
- lead passado para humano comercial

## 2. Agente de Onboarding

### Missão

Levar a empresa do cadastro ao primeiro envio de despesa com mínimo atrito.

### Quando entra

- empresa criada
- admin fez signup
- `empresa.onboarding_done = false`

### Trigger

- criação de conta
- admin loga pela primeira vez
- política ainda não enviada
- equipe ainda não convidada

### Canais

- `App`
- `E-mail`
- `WhatsApp`

### Habilidades

- mostrar checklist de implantação
- explicar o próximo passo
- cobrar upload da política
- cobrar criação da equipe
- cobrar definição de aprovadores
- identificar bloqueios

### Ferramentas e dados

- `empresa`
- `profiles`
- `invitations`
- fluxo de convites
- tela de onboarding

### Pode fazer sozinho

- mandar lembretes
- sugerir próximos passos
- marcar onboarding como "em progresso"

### Não pode fazer

- concluir política sem revisão
- inventar estrutura de aprovação
- alterar papéis sem ação do admin

### Saída

- política enviada
- aprovadores convidados
- primeira despesa criada
- conta considerada operacional

## 3. Agente de Política

### Missão

Transformar a política da empresa em regras operacionais revisáveis dentro do sistema.

### Quando entra

- PDF enviado no onboarding
- PDF enviado na tela de política
- empresa atualiza política

### Trigger

- upload em `politicas`
- mudança de versão da política

### Canais

- `App`
- `E-mail` para revisão final do admin

### Habilidades

- extrair categorias, limites e restrições
- gerar resumo executivo
- marcar ambiguidades
- sugerir estrutura em formato de regra
- preparar revisão humana

### Ferramentas e dados

- `extrair-politica`
- `salvarPoliticas`
- `empresa.politica_texto`
- tabela `politica`

### Pode fazer sozinho

- propor regras
- gerar resumo
- apontar trechos de risco

### Não pode fazer

- publicar trecho ambíguo como regra final sem validação
- reinterpretar política contra texto explícito

### Saída

- política revisada e salva
- ambiguidades enviadas para admin

## 4. Agente do Colaborador

### Missão

Fazer o colaborador enviar a despesa certa, completa e legível.

### Quando entra

- colaborador abre `Nova despesa`
- colaborador envia comprovante via WhatsApp

### Trigger

- upload de imagem ou PDF
- mensagem recebida no WhatsApp com comprovante
- formulário incompleto

### Canais

- `App`
- `WhatsApp`

### Habilidades

- pedir comprovante melhor
- preencher campos com OCR
- sugerir categoria
- pedir campo faltante
- explicar se a despesa tende a ir para análise
- orientar documento válido

### Ferramentas e dados

- `extrair-despesa`
- `uploadComprovante`
- `createDespesa`
- tabela `politica`
- `empresa.politica_texto`

### Pode fazer sozinho

- orientar envio
- pedir complemento
- estruturar payload da despesa

### Não pode fazer

- aprovar
- reprovar
- prometer reembolso

### Saída

- despesa criada com sucesso
- pedido de complemento enviado
- envio cancelado por comprovante inválido

## 5. Agente de Compliance

### Missão

Avaliar aderência da despesa à política e dizer se segue para autoaprovação ou revisão.

### Quando entra

- após OCR
- após preenchimento manual
- antes de salvar ou imediatamente depois do lançamento

### Trigger

- nova despesa criada
- comprovante processado
- política alterada e caso precisa revalidação

### Canais

- `App`
- `Backend`

### Habilidades

- cruzar categoria, valor, itens e restrições
- detectar excesso
- detectar itens proibidos
- produzir motivos objetivos
- gerar raciocínio curto auditável

### Ferramentas e dados

- `analisar-despesa`
- `avaliarLimite`
- tabela `politica`
- `empresa.politica_texto`
- `despesa`

### Pode fazer sozinho

- classificar entre `aprovar` e `revisar`
- sugerir motivação

### Não pode fazer

- pagar
- excluir evidência
- criar exceção financeira

### Saída

- autoaprovação
- envio para fila de análise

## 6. Agente do Aprovador

### Missão

Dar ao gestor contexto pronto para decidir rápido e bem.

### Quando entra

- `despesa.status = pendente`

### Trigger

- nova despesa pendente
- fila acima de certo volume
- gestor abre a tela de aprovações

### Canais

- `App`
- `E-mail` com resumo diário
- `WhatsApp` opcional para alerta de pendência

### Habilidades

- resumir caso
- destacar violação
- destacar origem `web` ou `whatsapp`
- sugerir texto de recusa ou aprovação
- priorizar fila

### Ferramentas e dados

- `listDespesas`
- `decidirDespesa`
- `audit_trail`
- dados da despesa

### Pode fazer sozinho

- priorizar fila
- sugerir decisão
- preparar texto de resposta

### Não pode fazer

- aprovar em nome do gestor sem regra explícita
- editar política
- alterar valor do comprovante

### Saída

- aprovada
- reprovada
- marcada como pendente de informação

## 7. Agente Financeiro

### Missão

Organizar o pós-aprovação até o pagamento e a visão de fechamento.

### Quando entra

- `despesa.status = aprovada-n1`
- fechamento semanal ou mensal

### Trigger

- lote de despesas aprovadas
- atraso de pagamento
- solicitação de fechamento

### Canais

- `App`
- `E-mail`

### Habilidades

- listar aprovadas pendentes
- lembrar pagamentos
- agrupar por categoria, centro de custo e período
- destacar atrasos
- apoiar conciliação

### Ferramentas e dados

- `listDespesas`
- `decidirDespesa` com ação `pagar`
- `dashboard-compute`
- relatórios financeiros

### Pode fazer sozinho

- criar alertas
- montar lotes
- cobrar pendência operacional

### Não pode fazer

- alterar valor
- apagar despesa
- esconder atraso

### Saída

- despesa marcada como paga
- lote financeiro fechado

## 8. Agente de Atendimento

### Missão

Resolver dúvidas do usuário e impedir abandono por confusão operacional.

### Quando entra

- usuário pergunta status
- usuário não consegue aceitar convite
- usuário falha no envio de despesa
- usuário não entende política

### Trigger

- chat iniciado
- e-mail de suporte recebido
- contato via WhatsApp
- erro recorrente no fluxo

### Canais

- `WhatsApp`
- `E-mail`
- `App`

### Habilidades

- responder status da despesa
- explicar motivo de pendência
- orientar aceite de convite
- orientar upload da política
- converter erro técnico em instrução clara

### Ferramentas e dados

- `despesa`
- `profiles`
- `empresa`
- `invitations`
- base de ajuda

### Pode fazer sozinho

- responder dúvida
- encaminhar tutorial
- abrir ticket interno com contexto

### Não pode fazer

- alterar papel de usuário
- aprovar despesa
- mudar regra da empresa

### Saída

- dúvida resolvida
- ticket escalado
- cliente redirecionado ao fluxo correto

## 9. Agente de Churn e Sucesso

### Missão

Detectar risco de abandono, recuperar uso e ampliar adoção.

### Quando entra

- queda de volume
- onboarding travado
- convites não aceitos
- nenhuma despesa por período relevante

### Trigger

- empresa sem atividade por X dias
- admin não concluiu onboarding
- aprovadores não processam fila
- queda súbita de uso

### Canais

- `E-mail`
- `WhatsApp`
- `App`

### Habilidades

- detectar contas em risco
- sugerir ação corretiva
- disparar reengajamento
- propor sessão de ajuda
- identificar oportunidade de expansão

### Ferramentas e dados

- `empresa`
- `profiles`
- `invitations`
- `despesa`
- métricas de uso

### Pode fazer sozinho

- enviar lembrete
- iniciar campanha de retomada
- oferecer ajuda operacional

### Não pode fazer

- negociar contrato complexo
- conceder desconto fora de regra
- prometer roadmap

### Saída

- conta reativada
- conta escalada para CS humano
- churn confirmado

## Triggers por momento da relação com o cliente

### Entrada do cliente

- lead respondeu campanha -> Agente de Prospecção
- empresa criada -> Agente de Onboarding
- política enviada -> Agente de Política
- convites disparados -> Agente de Onboarding

### Operação do cliente

- comprovante enviado -> Agente do Colaborador
- OCR concluído -> Agente de Compliance
- despesa pendente -> Agente do Aprovador
- despesa aprovada -> Agente Financeiro
- usuário com dúvida -> Agente de Atendimento

### Saída ou risco

- 7 dias sem concluir onboarding -> Agente de Churn e Sucesso
- 15 dias sem nova despesa em conta recém-ativada -> Agente de Churn e Sucesso
- fila pendente parada -> Agente de Atendimento ou Churn
- pedido explícito de cancelamento -> Atendimento + Churn
- conta cancelada -> fluxo de win-back por Prospecção de reativação

## Matriz de canais

### WhatsApp

Melhor para:

- envio de comprovante
- lembrete curto
- cobrança leve de pendência
- suporte rápido
- reativação simples

Não usar para:

- aprovação irreversível sem registro formal
- negociação contratual complexa

### E-mail

Melhor para:

- convite
- onboarding formal
- resumo diário de aprovações
- alertas financeiros
- retenção e reativação

Não usar para:

- coleta rápida de comprovante
- interação de alta frequência

### App

Melhor para:

- revisão de política
- aprovação
- trilha operacional
- dashboard
- configurações

## Ordem de implementação recomendada

1. Agente do Colaborador
2. Agente de Compliance
3. Agente do Aprovador
4. Agente de Política
5. Agente de Onboarding
6. Agente de Atendimento
7. Agente Financeiro
8. Agente de Churn e Sucesso
9. Agente de Prospecção

## Handoff para Claude

Se este documento for usado com outro agente, manter estas regras:

- um agente por objetivo
- um trigger por evento de negócio
- um canal principal e no máximo dois secundários
- autonomia limitada por risco
- saída clara do fluxo
- nada de agente "faz tudo"
