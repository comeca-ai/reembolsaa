-- Lista a equipe da empresa do caller já com a flag de convite pendente.
-- SECURITY DEFINER para ler auth.users (last_sign_in_at) — escopado por empresa
-- via current_empresa_id(). O front não acessa o schema auth diretamente.
create or replace function public.equipe_da_empresa()
returns table (id uuid, nome text, email text, role text, created_at timestamptz, pending boolean)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.nome, p.email, p.role, p.created_at,
         (u.last_sign_in_at is null) as pending
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.empresa_id = public.current_empresa_id()
  order by p.created_at asc
$$;

revoke all on function public.equipe_da_empresa() from public;
grant execute on function public.equipe_da_empresa() to authenticated;
