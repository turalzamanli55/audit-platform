-- Foundation tables — Sprint 2B
-- Enterprise column standard on every table

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug citext NOT NULL,
  legal_name text,
  description text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT organizations_slug_not_empty CHECK (char_length(trim(slug::text)) > 0),
  CONSTRAINT organizations_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE UNIQUE INDEX organizations_slug_active_uidx
  ON public.organizations (slug)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------

CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug citext NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT workspaces_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT workspaces_slug_not_empty CHECK (char_length(trim(slug::text)) > 0)
);

CREATE UNIQUE INDEX workspaces_org_slug_active_uidx
  ON public.workspaces (organization_id, slug)
  WHERE deleted_at IS NULL;

CREATE INDEX workspaces_organization_id_idx ON public.workspaces (organization_id);

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  name text NOT NULL,
  legal_name text,
  registration_number text,
  description text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT companies_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT companies_workspace_org_consistency CHECK (
    organization_id IS NOT NULL AND workspace_id IS NOT NULL
  )
);

CREATE INDEX companies_organization_id_idx ON public.companies (organization_id);
CREATE INDEX companies_workspace_id_idx ON public.companies (workspace_id);

CREATE UNIQUE INDEX companies_workspace_registration_active_uidx
  ON public.companies (workspace_id, registration_number)
  WHERE deleted_at IS NULL AND registration_number IS NOT NULL;

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------

CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE RESTRICT,
  slug citext NOT NULL,
  name text NOT NULL,
  description text,
  scope public.role_scope NOT NULL,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT roles_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT roles_slug_not_empty CHECK (char_length(trim(slug::text)) > 0),
  CONSTRAINT roles_platform_org_null CHECK (
    (scope = 'platform' AND organization_id IS NULL)
    OR (scope <> 'platform' AND organization_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX roles_platform_slug_active_uidx
  ON public.roles (slug)
  WHERE deleted_at IS NULL AND scope = 'platform';

CREATE UNIQUE INDEX roles_org_slug_active_uidx
  ON public.roles (organization_id, slug)
  WHERE deleted_at IS NULL AND scope <> 'platform';

-- ---------------------------------------------------------------------------
-- permissions
-- ---------------------------------------------------------------------------

CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code citext NOT NULL,
  name text NOT NULL,
  description text,
  scope public.permission_scope NOT NULL,
  resource text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT permissions_code_not_empty CHECK (char_length(trim(code::text)) > 0),
  CONSTRAINT permissions_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE UNIQUE INDEX permissions_code_active_uidx
  ON public.permissions (code)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- role_permissions
-- ---------------------------------------------------------------------------

CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE RESTRICT,
  permission_id uuid NOT NULL REFERENCES public.permissions (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE UNIQUE INDEX role_permissions_role_permission_active_uidx
  ON public.role_permissions (role_id, permission_id)
  WHERE deleted_at IS NULL;

CREATE INDEX role_permissions_role_id_idx ON public.role_permissions (role_id);
CREATE INDEX role_permissions_permission_id_idx ON public.role_permissions (permission_id);

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------

CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE RESTRICT,
  membership_scope public.membership_scope NOT NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT memberships_scope_workspace_consistency CHECK (
    (membership_scope = 'organization' AND workspace_id IS NULL)
    OR (membership_scope = 'workspace' AND workspace_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX memberships_user_org_active_uidx
  ON public.memberships (user_id, organization_id)
  WHERE deleted_at IS NULL AND membership_scope = 'organization';

CREATE UNIQUE INDEX memberships_user_workspace_active_uidx
  ON public.memberships (user_id, workspace_id)
  WHERE deleted_at IS NULL AND membership_scope = 'workspace';

CREATE INDEX memberships_user_id_idx ON public.memberships (user_id);
CREATE INDEX memberships_organization_id_idx ON public.memberships (organization_id);
CREATE INDEX memberships_workspace_id_idx ON public.memberships (workspace_id);
CREATE INDEX memberships_role_id_idx ON public.memberships (role_id);

-- ---------------------------------------------------------------------------
-- settings tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.organizations (id) ON DELETE RESTRICT,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE TABLE public.workspace_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL UNIQUE REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE TABLE public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL UNIQUE REFERENCES public.companies (id) ON DELETE RESTRICT,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

-- ---------------------------------------------------------------------------
-- audit_logs (append-oriented; soft delete column reserved for legal hold)
-- ---------------------------------------------------------------------------

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT audit_logs_action_not_empty CHECK (char_length(trim(action)) > 0),
  CONSTRAINT audit_logs_resource_type_not_empty CHECK (char_length(trim(resource_type)) > 0)
);

CREATE INDEX audit_logs_organization_id_idx ON public.audit_logs (organization_id);
CREATE INDEX audit_logs_workspace_id_idx ON public.audit_logs (workspace_id);
CREATE INDEX audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX audit_logs_resource_idx ON public.audit_logs (resource_type, resource_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- Enterprise triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_organizations_set_created_by
  BEFORE INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_organizations_set_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_organizations_set_updated_by
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_organizations_set_row_version
  BEFORE INSERT OR UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_workspaces_set_created_by
  BEFORE INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_workspaces_set_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_workspaces_set_updated_by
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_workspaces_set_row_version
  BEFORE INSERT OR UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_companies_set_created_by
  BEFORE INSERT ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_companies_set_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_companies_set_updated_by
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_companies_set_row_version
  BEFORE INSERT OR UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_roles_set_created_by
  BEFORE INSERT ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_roles_set_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_roles_set_updated_by
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_roles_set_row_version
  BEFORE INSERT OR UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_permissions_set_created_by
  BEFORE INSERT ON public.permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_permissions_set_updated_at
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_permissions_set_updated_by
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_permissions_set_row_version
  BEFORE INSERT OR UPDATE ON public.permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_role_permissions_set_created_by
  BEFORE INSERT ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_role_permissions_set_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_role_permissions_set_updated_by
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_role_permissions_set_row_version
  BEFORE INSERT OR UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_memberships_set_created_by
  BEFORE INSERT ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_memberships_set_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_memberships_set_updated_by
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_memberships_set_row_version
  BEFORE INSERT OR UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_organization_settings_set_created_by
  BEFORE INSERT ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_organization_settings_set_updated_at
  BEFORE UPDATE ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_organization_settings_set_updated_by
  BEFORE UPDATE ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_organization_settings_set_row_version
  BEFORE INSERT OR UPDATE ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_workspace_settings_set_created_by
  BEFORE INSERT ON public.workspace_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_workspace_settings_set_updated_at
  BEFORE UPDATE ON public.workspace_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_workspace_settings_set_updated_by
  BEFORE UPDATE ON public.workspace_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_workspace_settings_set_row_version
  BEFORE INSERT OR UPDATE ON public.workspace_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_company_settings_set_created_by
  BEFORE INSERT ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_company_settings_set_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_company_settings_set_updated_by
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_company_settings_set_row_version
  BEFORE INSERT OR UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_audit_logs_set_created_by
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_audit_logs_set_updated_at
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_audit_logs_set_updated_by
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_audit_logs_set_row_version
  BEFORE INSERT OR UPDATE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- RLS helper functions (require memberships table)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_belongs_to_organization(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.memberships m
      WHERE m.user_id = public.auth_user_id()
        AND m.organization_id = target_organization_id
        AND m.deleted_at IS NULL
        AND m.status = 'active'
    );
$$;

CREATE OR REPLACE FUNCTION public.user_belongs_to_workspace(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.memberships m
      WHERE m.user_id = public.auth_user_id()
        AND m.workspace_id = target_workspace_id
        AND m.deleted_at IS NULL
        AND m.status = 'active'
    );
$$;

CREATE OR REPLACE FUNCTION public.user_organization_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT m.organization_id
  FROM public.memberships m
  WHERE m.user_id = public.auth_user_id()
    AND m.deleted_at IS NULL
    AND m.status = 'active';
$$;

CREATE OR REPLACE FUNCTION public.user_workspace_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT m.workspace_id
  FROM public.memberships m
  WHERE m.user_id = public.auth_user_id()
    AND m.workspace_id IS NOT NULL
    AND m.deleted_at IS NULL
    AND m.status = 'active';
$$;

-- Search indexes
CREATE INDEX organizations_name_search_idx ON public.organizations USING gin (to_tsvector('simple', name));
CREATE INDEX workspaces_name_search_idx ON public.workspaces USING gin (to_tsvector('simple', name));
CREATE INDEX companies_name_search_idx ON public.companies USING gin (to_tsvector('simple', name));
