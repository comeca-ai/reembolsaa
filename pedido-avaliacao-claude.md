# Pedido de avaliação para Claude

Quero que você avalie o documento [agentes-funcionais.md](./agentes-funcionais.md) como se fosse uma revisão de arquitetura operacional de agentes para o produto Reembolsaa.

## Objetivo da avaliação

Validar se os agentes propostos estão:

- funcionais no mundo real
- separados por responsabilidade
- acionados por triggers corretos
- conectados aos canais certos (`app`, `e-mail`, `WhatsApp`)
- seguros em termos de autonomia
- alinhados com um produto SaaS de reembolso multi-tenant com política, aprovação e auditoria

## O que eu quero que você critique

1. Se algum agente está amplo demais ou genérico demais.
2. Se faltam agentes importantes para a jornada completa.
3. Se algum agente deveria ser workflow determinístico em vez de agente.
4. Se os triggers estão mal definidos ou sobrepostos.
5. Se os canais de comunicação estão errados para algum caso.
6. Se a autonomia de algum agente está perigosa.
7. Se faltam handoffs claros entre agentes.
8. Se há risco de confusão entre atendimento, onboarding, churn e prospecção.
9. Se há alguma parte que não parece implementável no produto atual.
10. Se a ordem de implementação deveria mudar.

## Como responder

Quero uma resposta objetiva, com esta estrutura:

### 1. Achados críticos

Liste problemas que inviabilizam ou enfraquecem bastante a proposta.

### 2. Riscos médios

Liste ambiguidades, overlap entre agentes, lacunas de trigger ou problemas de canal.

### 3. O que está forte

Diga o que está bem dividido e bem pensado.

### 4. Mudanças recomendadas

Dê sugestões concretas de ajuste, com nome do agente e mudança proposta.

### 5. Versão mais enxuta, se aplicável

Se você achar que há agentes demais, proponha uma versão reduzida para começar, sem perder funcionalidade.

## Contexto do produto

O produto é o Reembolsaa, um SaaS de gestão de reembolso com:

- upload de política em PDF
- extração de regras por IA
- envio de despesas via web
- pipeline previsto também para WhatsApp
- análise automática de conformidade
- fila de aprovação humana
- operação financeira pós-aprovação
- gestão de usuários e convites
- preocupação com multi-tenant, auditoria e rastreabilidade

## Regras da avaliação

- Não elogie de forma genérica.
- Aja como arquiteto de produto e operações.
- Se algo estiver bom, diga por quê.
- Se algo estiver ruim, diga o impacto prático.
- Prefira clareza operacional a entusiasmo.
