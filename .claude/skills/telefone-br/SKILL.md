---
name: telefone-br
description: Regras de normalização e validação de número de WhatsApp/telefone brasileiro no Reembolsaaí. Use ao gravar, comparar ou validar telefone em QUALQUER camada (Edge Function, RPC, API client, UI) para manter consistência no roteamento de despesas por WhatsApp. Sem isso, o match remetente→cadastro falha.
---

# Telefone BR — normalização e validação (Reembolsaaí)

O WhatsApp do colaborador é a **chave de roteamento** de despesas (Fase 8 do `ajustes.md`): a `whatsapp-evolution` acha a empresa pelo telefone do remetente em `profiles.telefone`. Todas as camadas precisam tratar o número do **mesmo jeito**.

## Armazenamento
- Guarde **só dígitos**, com DDI: `5511954686897`.
- Normalize na escrita: `String(v).replace(/\D/g, "")`.

## Comparação (remetente → cadastro)
- Compare normalizado (só dígitos).
- Tolere ausência de DDI comparando os **últimos 11 dígitos** (DDD + 9 dígitos): `a.slice(-11) === b.slice(-11)`.
- A função `whatsapp-evolution` já faz exatamente isso — replique a mesma regra em qualquer lookup novo (RPC, etc.).

## Validação na UI
- Aceite entrada amigável (`( ) - ` e espaços), mas **salve só dígitos**.
- Celular BR com DDI = 13 dígitos (`55` + DDD(2) + `9` + 8). Aceite 12–13; avise se < 12 (provável faltar DDI/DDD).
- Bloqueie o envio com formato inválido antes de bater no backend.

## Unicidade
- 1 telefone → 1 colaborador/empresa. Antes de criar índice UNIQUE em `regexp_replace(telefone,'\D','','g')`, **trate duplicados legados** (senão a migração falha).

## Borda conhecida
- 9º dígito do celular (com/sem o `9`): o match por "últimos 11" cobre parcialmente. Em não-match, registre o telefone bruto para diagnóstico em vez de falhar silencioso.
