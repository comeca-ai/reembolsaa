# Webhook WhatsApp Evolution

Endpoint único para receber mensagens do WhatsApp via Evolution API.

## URL do Webhook

```
POST https://<seu-projeto>.supabase.co/functions/v1/whatsapp-evolution
```

## Como Configurar no Evolution

1. Acesse o painel da Evolution API
2. Vá em **Webhooks** → **Criar Webhook**
3. Configure:
   - **URL**: `https://<seu-projeto>.supabase.co/functions/v1/whatsapp-evolution`
   - **Eventos**: `MESSAGES_UPSERT`
   - **Método**: `POST`

## Fluxo de Funcionamento

```
Colaborador envia comprovante no WhatsApp
    ↓
Evolution API recebe e chama o webhook
    ↓
whatsapp-evolution identifica o telefone
    ↓
Busca usuário em profiles.telefone
    ↓
Encaminha para whatsapp-ingest
    ↓
OCR/IA processa o comprovante
    ↓
Cria despesa no banco
    ↓
Responde no WhatsApp com status
```

## Respostas no WhatsApp

### Despesa Aprovada
```
✅ Despesa registrada e *aprovada automaticamente*!
Colaborador: João Silva
Categoria: Alimentação
Valor: R$ 87.40
```

### Despesa para Análise
```
🔎 Despesa registrada e enviada para *análise*.
Colaborador: João Silva
Categoria: Alimentação
Valor: R$ 150.00
Motivo: Acima do limite de R$ 100
```

## Erros Possíveis

| Mensagem | Significado |
|----------|-------------|
| "Seu número ainda não está cadastrado" | Telefone não está em `profiles.telefone` |
| "Sua empresa está sem configuração" | Empresa sem `webhook_token` |
| "Não consegui interpretar o comprovante" | OCR falhou (imagem ruim) |

## Variáveis de Ambiente Necessárias

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
```
