# Supabase — reembolsaa

O schema de produção vive no projeto Supabase `rqcvxnauxmgwgiqdlzuv` (não estava
versionado neste repo). Esta pasta passa a registrar as **alterações de schema**
como migrations idempotentes, para que cada mudança no banco fique rastreável.

## Aplicar uma migration

Pelo painel (SQL Editor) ou CLI:

```bash
supabase db push          # se o projeto estiver linkado via `supabase link`
# ou cole o conteúdo do .sql no SQL Editor do painel
```

As migrations aqui são escritas para serem **seguras de rodar mais de uma vez**
(`add column if not exists`, checagem de constraint antes de criar).

## Migrations

- `migrations/20260522_despesa_canal.sql` — adiciona `despesa.canal`
  (`web` | `whatsapp`) para exibir a origem da despesa no card de Aprovações.
