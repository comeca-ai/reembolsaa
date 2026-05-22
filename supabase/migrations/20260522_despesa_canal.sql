-- Origem da despesa: por qual canal o colaborador a enviou.
--   'web'      -> formulário do app (Nova Despesa)
--   'whatsapp' -> webhook do bot de WhatsApp
--
-- Aditiva e segura: a coluna tem DEFAULT 'web', então toda linha existente e todo
-- INSERT futuro já ficam marcados sem precisar mudar o código de criação. O front
-- (ApprovalPage) lê `despesa.canal` e exibe o badge de origem no card de aprovação.
alter table public.despesa
  add column if not exists canal text not null default 'web';

-- Garante valores consistentes (idempotente).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'despesa_canal_check'
  ) then
    alter table public.despesa
      add constraint despesa_canal_check check (canal in ('web', 'whatsapp'));
  end if;
end $$;
