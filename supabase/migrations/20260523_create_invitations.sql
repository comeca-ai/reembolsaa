-- Cria a tabela invitations se não existir
-- Campos: id (uuid), empresa_id (uuid), email, role, invited_by (uuid), accepted_at, created_at
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null,
  email text not null,
  role text not null default 'colaborador',
  invited_by uuid not null,
  accepted_at timestamptz null,
  created_at timestamptz not null default now()
);

-- Índice para busca por empresa/email
create index if not exists invitations_empresa_email_idx on public.invitations (empresa_id, lower(email));

-- Restrição de papéis (coincide com roles.js)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invitations_role_check'
  ) THEN
    ALTER TABLE public.invitations
      ADD CONSTRAINT invitations_role_check CHECK (role IN ('admin','aprovador','financeiro','colaborador'));
  END IF;
END $$;

-- Permissões mínimas: permitir execução (a ser ajustado pelo fluxo de migrations do projeto)
REVOKE ALL ON public.invitations FROM public;
GRANT SELECT, INSERT, DELETE ON public.invitations TO authenticated;
