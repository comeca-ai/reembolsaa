-- Selo de autenticidade fiscal da despesa (validação OFFLINE da chave de acesso).
-- Aditivo e nullable: despesas antigas ficam com nf_selo nulo (renderizam como
-- "não verificável"). Já aplicado no projeto remoto via MCP em 25/05/2026; este
-- arquivo versiona o schema para ambientes novos / db reset.
alter table public.despesa
  add column if not exists nf_chave  text,
  add column if not exists nf_selo   text,
  add column if not exists nf_modelo text;

comment on column public.despesa.nf_chave  is 'Chave de acesso NF-e/NFC-e (44 díg) lida do comprovante, ou null.';
comment on column public.despesa.nf_selo   is 'Selo de autenticidade da chave fiscal (offline): valida | nao_verificavel | suspeita.';
comment on column public.despesa.nf_modelo is 'Modelo fiscal embutido na chave: 55 (NF-e) | 65 (NFC-e) | null.';
