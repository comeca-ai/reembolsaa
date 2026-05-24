-- Fase 8 — hardening (gate tech-lead).
-- #5 Unicidade do telefone (multi-tenant): impede o mesmo número rotear p/ empresas diferentes.
-- Compara pelos últimos 11 dígitos (mesma regra do roteamento whatsapp-evolution / mesmosUltimos11).
create unique index if not exists uq_profiles_telefone_ult11
  on public.profiles ((right(regexp_replace(telefone, '\D', '', 'g'), 11)))
  where telefone is not null and telefone <> '';

-- #6 Bloqueia auto-promoção: usuário autenticado não-admin não pode mudar o próprio role/empresa_id.
-- Não afeta service_role (auth.uid() = null) nem admin alterando OUTRO usuário (auth.uid() <> new.id).
create or replace function public.profiles_block_self_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() = new.id
     and not public.is_admin()
     and (new.role is distinct from old.role or new.empresa_id is distinct from old.empresa_id) then
    raise exception 'Voce nao pode alterar seu proprio papel ou empresa.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_block_self_escalation on public.profiles;
create trigger trg_profiles_block_self_escalation
  before update on public.profiles
  for each row execute function public.profiles_block_self_escalation();
