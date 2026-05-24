-- Fase 8: WhatsApp do colaborador como chave de roteamento de despesas.
-- Adiciona profiles.telefone (E.164/dígitos) + índice por dígitos.
alter table public.profiles add column if not exists telefone text;

create index if not exists idx_profiles_telefone_digits
  on public.profiles ((regexp_replace(telefone, '\D', '', 'g')))
  where telefone is not null;

comment on column public.profiles.telefone is
  'WhatsApp do colaborador (E.164/dígitos); chave para rotear despesas recebidas por WhatsApp ao tenant correto';
