-- Idempotência de webhooks externos (ex.: Chatwoot message id) — evita processar
-- a mesma mensagem 2x (webhook pode reenviar). Usado pela Edge Function chatwoot-ingest.
-- Só o service_role (Edge Functions) acessa; sem policies = clientes não leem/escrevem.
create table if not exists public.webhook_dedupe (
  provider   text not null,
  ext_id     text not null,
  created_at timestamptz not null default now(),
  primary key (provider, ext_id)
);
comment on table public.webhook_dedupe is 'Idempotência de webhooks externos (provider+ext_id). Ex.: chatwoot message id.';
alter table public.webhook_dedupe enable row level security;
