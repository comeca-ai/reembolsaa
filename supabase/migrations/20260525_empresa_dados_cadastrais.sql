-- Fase 3 (ajustes.md): persistir dados cadastrais da empresa.
-- Antes, CompanySettings.jsx usava dados mock em memória (não persistia).
-- A RLS já permite o admin atualizar a própria empresa (policy empresa_admin_update).
alter table public.empresa add column if not exists cnpj text;
alter table public.empresa add column if not exists email_financeiro text;
alter table public.empresa add column if not exists moeda text not null default 'BRL';
alter table public.empresa add column if not exists inicio_ano_fiscal text not null default '01';

comment on column public.empresa.cnpj is 'CNPJ da empresa (texto livre formatado)';
comment on column public.empresa.email_financeiro is 'E-mail financeiro usado em relatórios/comunicações';
comment on column public.empresa.moeda is 'Moeda padrão (BRL|USD|EUR)';
comment on column public.empresa.inicio_ano_fiscal is 'Mês de início do ano fiscal (01-12)';
