-- ECP Sprint 4: Enterprise SaaS Core
-- Identity · Licensing · Multi-Tenant · Administration
-- Completes PROJECT_BIBLE organization / foundation / users / enterprise contracts.

-- ---------------------------------------------------------------------------
-- Tenant model extensions (solo | business | enterprise)
-- ---------------------------------------------------------------------------

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS tenant_type text NOT NULL DEFAULT 'business',
  ADD COLUMN IF NOT EXISTS platform_owner_managed boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'organizations_tenant_type_valid'
  ) THEN
    ALTER TABLE public.organizations
      ADD CONSTRAINT organizations_tenant_type_valid CHECK (
        tenant_type IN ('solo', 'business', 'enterprise')
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- subscription_and_licensing — plans, seats, module entitlements
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.subscription_and_licensing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  plan_code text NOT NULL,
  tenant_type text NOT NULL DEFAULT 'business',
  subscription_status text NOT NULL DEFAULT 'trial',
  seat_limit integer NOT NULL DEFAULT 1,
  seats_used integer NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL DEFAULT public.utc_now(),
  ends_at timestamptz,
  trial_ends_at timestamptz,
  module_entitlements jsonb NOT NULL DEFAULT '{}'::jsonb,
  usage_limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT subscription_and_licensing_plans_code_not_empty CHECK (char_length(trim(plan_code)) > 0),
  CONSTRAINT subscription_and_licensing_plans_tenant_type_valid CHECK (
    tenant_type IN ('solo', 'business', 'enterprise')
  ),
  CONSTRAINT subscription_and_licensing_plans_status_valid CHECK (
    subscription_status IN ('trial', 'active', 'expired', 'suspended', 'cancelled')
  ),
  CONSTRAINT subscription_and_licensing_plans_seats_non_negative CHECK (
    seat_limit >= 0 AND seats_used >= 0 AND seats_used <= seat_limit
  )
);

CREATE INDEX IF NOT EXISTS subscription_and_licensing_plans_organization_id_idx
  ON public.subscription_and_licensing_plans (organization_id);

-- ---------------------------------------------------------------------------
-- user_provisioning — invitation-only onboarding
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_provisioning_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  email citext NOT NULL,
  role_slug text NOT NULL DEFAULT 'auditor',
  invitation_token text NOT NULL,
  invitation_status text NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  accepted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT user_provisioning_invitations_email_not_empty CHECK (char_length(trim(email::text)) > 0),
  CONSTRAINT user_provisioning_invitations_token_not_empty CHECK (char_length(trim(invitation_token)) > 0),
  CONSTRAINT user_provisioning_invitations_status_valid CHECK (
    invitation_status IN ('pending', 'accepted', 'revoked', 'expired')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS user_provisioning_invitations_token_active_uidx
  ON public.user_provisioning_invitations (invitation_token)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS user_provisioning_invitations_organization_id_idx
  ON public.user_provisioning_invitations (organization_id);
CREATE INDEX IF NOT EXISTS user_provisioning_invitations_email_idx
  ON public.user_provisioning_invitations (email);

-- ---------------------------------------------------------------------------
-- organization_management / entity_management / methodology / templates
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.organization_management_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  display_name text NOT NULL,
  legal_name text,
  branding jsonb NOT NULL DEFAULT '{}'::jsonb,
  smtp_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  custom_domain text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT organization_management_profiles_name_not_empty CHECK (char_length(trim(display_name)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS organization_management_profiles_org_active_uidx
  ON public.organization_management_profiles (organization_id)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.entity_management_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  parent_entity_id uuid REFERENCES public.entity_management_units (id) ON DELETE SET NULL,
  entity_code text NOT NULL,
  entity_name text NOT NULL,
  entity_kind text NOT NULL DEFAULT 'company',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT entity_management_units_code_not_empty CHECK (char_length(trim(entity_code)) > 0),
  CONSTRAINT entity_management_units_kind_valid CHECK (
    entity_kind IN ('company', 'department', 'branch', 'region', 'team')
  )
);

CREATE INDEX IF NOT EXISTS entity_management_units_organization_id_idx
  ON public.entity_management_units (organization_id);

CREATE TABLE IF NOT EXISTS public.methodology_configuration_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  methodology_code text NOT NULL,
  methodology_name text NOT NULL,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT methodology_configuration_profiles_code_not_empty CHECK (char_length(trim(methodology_code)) > 0)
);

CREATE INDEX IF NOT EXISTS methodology_configuration_profiles_organization_id_idx
  ON public.methodology_configuration_profiles (organization_id);

CREATE TABLE IF NOT EXISTS public.template_management_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  template_code text NOT NULL,
  template_name text NOT NULL,
  template_kind text NOT NULL DEFAULT 'engagement',
  body jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT template_management_items_code_not_empty CHECK (char_length(trim(template_code)) > 0)
);

CREATE INDEX IF NOT EXISTS template_management_items_organization_id_idx
  ON public.template_management_items (organization_id);

-- ---------------------------------------------------------------------------
-- role_and_permission_management — custom role bundles
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.role_and_permission_management_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE RESTRICT,
  bundle_code text NOT NULL,
  permission_codes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT role_and_permission_management_bundles_code_not_empty CHECK (char_length(trim(bundle_code)) > 0)
);

CREATE INDEX IF NOT EXISTS role_and_permission_management_bundles_organization_id_idx
  ON public.role_and_permission_management_bundles (organization_id);

-- ---------------------------------------------------------------------------
-- workspace_management
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.workspace_management_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  feature_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE UNIQUE INDEX IF NOT EXISTS workspace_management_settings_workspace_active_uidx
  ON public.workspace_management_settings (workspace_id)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- session_management / single_sign_on / security events / legal hold / export
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.session_management_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  max_concurrent_sessions integer NOT NULL DEFAULT 5,
  idle_timeout_minutes integer NOT NULL DEFAULT 60,
  absolute_timeout_hours integer NOT NULL DEFAULT 12,
  remember_device_days integer NOT NULL DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.single_sign_on_integration_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  provider_code text NOT NULL,
  protocol text NOT NULL DEFAULT 'oidc',
  issuer_url text,
  client_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT single_sign_on_integration_providers_code_not_empty CHECK (char_length(trim(provider_code)) > 0),
  CONSTRAINT single_sign_on_integration_providers_protocol_valid CHECK (
    protocol IN ('oidc', 'saml', 'scim')
  )
);

CREATE TABLE IF NOT EXISTS public.security_event_monitoring_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE SET NULL,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  event_code text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT security_event_monitoring_events_code_not_empty CHECK (char_length(trim(event_code)) > 0),
  CONSTRAINT security_event_monitoring_events_severity_valid CHECK (
    severity IN ('info', 'warning', 'critical')
  )
);

CREATE TABLE IF NOT EXISTS public.legal_hold_and_retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  policy_code text NOT NULL,
  retention_days integer NOT NULL DEFAULT 2555,
  legal_hold_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT legal_hold_and_retention_policies_code_not_empty CHECK (char_length(trim(policy_code)) > 0)
);

CREATE TABLE IF NOT EXISTS public.export_and_portability_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  requested_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  export_scope text NOT NULL DEFAULT 'tenant',
  request_status text NOT NULL DEFAULT 'queued',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT export_and_portability_requests_status_valid CHECK (
    request_status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')
  )
);

CREATE TABLE IF NOT EXISTS public.encryption_in_transit_and_at_rest_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  tls_required boolean NOT NULL DEFAULT true,
  at_rest_encryption_required boolean NOT NULL DEFAULT true,
  key_rotation_days integer NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.role_based_access_control_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role_slug text NOT NULL,
  scope_level text NOT NULL DEFAULT 'tenant',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT role_based_access_control_assignments_role_not_empty CHECK (char_length(trim(role_slug)) > 0),
  CONSTRAINT role_based_access_control_assignments_scope_valid CHECK (
    scope_level IN ('platform', 'tenant', 'workspace', 'module')
  )
);

-- ---------------------------------------------------------------------------
-- Feature flags (platform / tenant / workspace / user)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.saas_feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations (id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES public.workspaces (id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  flag_code text NOT NULL,
  flag_state text NOT NULL DEFAULT 'disabled',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT saas_feature_flags_code_not_empty CHECK (char_length(trim(flag_code)) > 0),
  CONSTRAINT saas_feature_flags_state_valid CHECK (
    flag_state IN ('enabled', 'disabled', 'preview', 'experimental', 'deprecated')
  )
);

CREATE INDEX IF NOT EXISTS saas_feature_flags_code_idx ON public.saas_feature_flags (flag_code);

-- ---------------------------------------------------------------------------
-- Triggers + RLS (abbreviated helpers)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'subscription_and_licensing_plans',
    'user_provisioning_invitations',
    'organization_management_profiles',
    'entity_management_units',
    'methodology_configuration_profiles',
    'template_management_items',
    'role_and_permission_management_bundles',
    'workspace_management_settings',
    'session_management_policies',
    'single_sign_on_integration_providers',
    'security_event_monitoring_events',
    'legal_hold_and_retention_policies',
    'export_and_portability_requests',
    'encryption_in_transit_and_at_rest_controls',
    'role_based_access_control_assignments',
    'saas_feature_flags'
  ]
  LOOP
    EXECUTE format('CREATE TRIGGER trg_%s_set_created_by BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_created_by()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_updated_by BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_by()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_row_version BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_row_version()', t, t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I_select_authenticated ON public.%I FOR SELECT TO authenticated USING (public.is_service_role() OR organization_id IS NULL OR public.user_belongs_to_organization(organization_id))',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY %I_write_authenticated ON public.%I FOR ALL TO authenticated USING (public.is_service_role() OR organization_id IS NULL OR public.user_belongs_to_organization(organization_id)) WITH CHECK (public.is_service_role() OR organization_id IS NULL OR public.user_belongs_to_organization(organization_id))',
      t, t
    );
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;
