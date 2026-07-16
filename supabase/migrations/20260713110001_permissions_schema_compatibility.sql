-- SCHEMA-COMPAT-001: Permissions / RBAC column compatibility repair
-- MUST run BEFORE fs_mapping / fs_rendering / ifrs_notes permission inserts.
-- Timestamp ordered ahead of 20260713120001 so clean rebuilds succeed.
--
-- Root cause:
--   Foundation (20260630000002) defines public.permissions with
--   (scope, resource, status) and NO module column.
--   Later feature migrations (fs_mapping / fs_rendering / ifrs_notes)
--   INSERT into (code, name, description, module, status).
--   Remote databases that only applied foundation therefore fail those inserts.
--
-- Rules:
--   - Do NOT edit historical migrations
--   - Do NOT recreate / drop tables
--   - ADD COLUMN IF NOT EXISTS + backfill only
--
-- Also hardens roles / role_permissions status columns for diverged remotes.
-- workspace_permissions is not defined in historical migrations or generated types;
-- memberships remains the workspace RBAC binding table.

-- ---------------------------------------------------------------------------
-- permissions
-- ---------------------------------------------------------------------------

ALTER TABLE public.permissions
  ADD COLUMN IF NOT EXISTS module text;

ALTER TABLE public.permissions
  ADD COLUMN IF NOT EXISTS resource text;

ALTER TABLE public.permissions
  ADD COLUMN IF NOT EXISTS scope public.permission_scope;

ALTER TABLE public.permissions
  ADD COLUMN IF NOT EXISTS status public.record_status;

-- Defaults so later INSERT (module, status) rows remain valid when scope omitted
ALTER TABLE public.permissions
  ALTER COLUMN scope SET DEFAULT 'workspace'::public.permission_scope;

ALTER TABLE public.permissions
  ALTER COLUMN status SET DEFAULT 'active'::public.record_status;

-- Backfill existing rows (no data loss)
UPDATE public.permissions
SET
  status = COALESCE(status, 'active'::public.record_status),
  scope = COALESCE(scope, 'workspace'::public.permission_scope),
  module = COALESCE(
    NULLIF(btrim(module), ''),
    NULLIF(btrim(resource), ''),
    NULLIF(split_part(code::text, '.', 1), '')
  ),
  resource = COALESCE(
    NULLIF(btrim(resource), ''),
    NULLIF(btrim(module), ''),
    NULLIF(split_part(code::text, '.', 1), '')
  )
WHERE
  status IS NULL
  OR scope IS NULL
  OR module IS NULL
  OR btrim(COALESCE(module, '')) = ''
  OR resource IS NULL
  OR btrim(COALESCE(resource, '')) = '';

-- Enforce NOT NULL only after backfill (safe when column already NOT NULL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'permissions'
      AND column_name = 'status'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.permissions
      ALTER COLUMN status SET NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'permissions'
      AND column_name = 'scope'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.permissions
      ALTER COLUMN scope SET NOT NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS permissions_module_idx
  ON public.permissions (module)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS permissions_status_idx
  ON public.permissions (status)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------

ALTER TABLE public.roles
  ADD COLUMN IF NOT EXISTS status public.record_status;

ALTER TABLE public.roles
  ALTER COLUMN status SET DEFAULT 'active'::public.record_status;

UPDATE public.roles
SET status = 'active'::public.record_status
WHERE status IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'roles'
      AND column_name = 'status'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.roles
      ALTER COLUMN status SET NOT NULL;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- role_permissions
-- ---------------------------------------------------------------------------

ALTER TABLE public.role_permissions
  ADD COLUMN IF NOT EXISTS status public.record_status;

ALTER TABLE public.role_permissions
  ALTER COLUMN status SET DEFAULT 'active'::public.record_status;

UPDATE public.role_permissions
SET status = 'active'::public.record_status
WHERE status IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'role_permissions'
      AND column_name = 'status'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.role_permissions
      ALTER COLUMN status SET NOT NULL;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Notes
-- ---------------------------------------------------------------------------
-- public.workspace_permissions: not present in foundation migrations or
-- src/types/supabase.ts. Workspace access continues via memberships + roles.
