-- Row Level Security — deny by default
-- Sprint 2B — Enterprise Database Foundation

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------

CREATE POLICY organizations_select_authenticated ON public.organizations
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_organization(id)
  );

CREATE POLICY organizations_insert_service ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role());

CREATE POLICY organizations_update_authenticated ON public.organizations
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_organization(id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_organization(id)
  );

CREATE POLICY organizations_delete_service ON public.organizations
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------

CREATE POLICY workspaces_select_authenticated ON public.workspaces
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(id)
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY workspaces_insert_service ON public.workspaces
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role());

CREATE POLICY workspaces_update_authenticated ON public.workspaces
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(id)
    OR public.user_belongs_to_organization(organization_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(id)
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY workspaces_delete_service ON public.workspaces
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------

CREATE POLICY companies_select_authenticated ON public.companies
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY companies_insert_authenticated ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY companies_update_authenticated ON public.companies
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY companies_delete_service ON public.companies
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- roles — platform roles readable by all authenticated; org roles scoped
-- ---------------------------------------------------------------------------

CREATE POLICY roles_select_authenticated ON public.roles
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR (scope = 'platform' AND deleted_at IS NULL)
    OR (organization_id IS NOT NULL AND public.user_belongs_to_organization(organization_id))
  );

CREATE POLICY roles_write_service ON public.roles
  FOR ALL TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- ---------------------------------------------------------------------------
-- permissions — platform catalog readable by authenticated users
-- ---------------------------------------------------------------------------

CREATE POLICY permissions_select_authenticated ON public.permissions
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR deleted_at IS NULL
  );

CREATE POLICY permissions_write_service ON public.permissions
  FOR ALL TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- ---------------------------------------------------------------------------
-- role_permissions
-- ---------------------------------------------------------------------------

CREATE POLICY role_permissions_select_authenticated ON public.role_permissions
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR deleted_at IS NULL
  );

CREATE POLICY role_permissions_write_service ON public.role_permissions
  FOR ALL TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------

CREATE POLICY memberships_select_authenticated ON public.memberships
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR user_id = public.auth_user_id()
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY memberships_insert_service ON public.memberships
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role());

CREATE POLICY memberships_update_service ON public.memberships
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY memberships_delete_service ON public.memberships
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------

CREATE POLICY organization_settings_select ON public.organization_settings
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY organization_settings_write ON public.organization_settings
  FOR ALL TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_organization(organization_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_organization(organization_id)
  );

CREATE POLICY workspace_settings_select ON public.workspace_settings
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY workspace_settings_write ON public.workspace_settings
  FOR ALL TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY company_settings_select ON public.company_settings
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.id = company_id
        AND public.user_belongs_to_workspace(c.workspace_id)
    )
  );

CREATE POLICY company_settings_write ON public.company_settings
  FOR ALL TO authenticated
  USING (
    public.is_service_role()
    OR EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.id = company_id
        AND public.user_belongs_to_workspace(c.workspace_id)
    )
  )
  WITH CHECK (
    public.is_service_role()
    OR EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.id = company_id
        AND public.user_belongs_to_workspace(c.workspace_id)
    )
  );

-- ---------------------------------------------------------------------------
-- audit_logs — read within tenant; insert by authenticated members
-- ---------------------------------------------------------------------------

CREATE POLICY audit_logs_select ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR (
      organization_id IS NOT NULL
      AND public.user_belongs_to_organization(organization_id)
    )
  );

CREATE POLICY audit_logs_insert ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR (
      organization_id IS NOT NULL
      AND public.user_belongs_to_organization(organization_id)
    )
  );

CREATE POLICY audit_logs_update_service ON public.audit_logs
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY audit_logs_delete_service ON public.audit_logs
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- Revoke anonymous access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
