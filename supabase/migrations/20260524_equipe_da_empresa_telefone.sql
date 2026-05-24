-- Adiciona a coluna telefone ao retorno de equipe_da_empresa().
-- O DROP é necessário porque incluir um campo em RETURNS TABLE altera o tipo
-- de retorno da função, e CREATE OR REPLACE não permite mudar o tipo de retorno
-- de uma função existente. Como o DROP remove os privilégios, o bloco
-- revoke/grant é reaplicado ao final.
--
-- Sem regressão: mantém o filtro multi-tenant via current_empresa_id(),
-- a flag pending (last_sign_in_at is null), SECURITY DEFINER (para ler
-- auth.users), STABLE, search_path = public e a ordenação por created_at asc.
-- profiles.telefone já existe (migração add_telefone_to_profiles).
drop function if exists public.equipe_da_empresa();

create or replace function public.equipe_da_empresa()
returns table (id uuid, nome text, email text, telefone text, role text, created_at timestamptz, pending boolean)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.nome, p.email, p.telefone, p.role, p.created_at,
         (u.last_sign_in_at is null) as pending
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.empresa_id = public.current_empresa_id()
  order by p.created_at asc
$$;

revoke all on function public.equipe_da_empresa() from public;
grant execute on function public.equipe_da_empresa() to authenticated;
