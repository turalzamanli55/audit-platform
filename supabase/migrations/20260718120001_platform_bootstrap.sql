-- ECP Sprint 4A: Enterprise Platform Bootstrap
-- Platform Owner · Platform Administration · Platform Provisioning
-- Adds platform-global tables that live ABOVE all tenants (no organization_id).
-- Access is restricted to the service role; the platform dashboard reads these
-- tables server-side with the service client after verifying Platform Owner.

-- ---------------------------------------------------------------------------
-- platform_bootstrap_status — singleton bootstrap ledger (runs once)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_bootstrap_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true,
  bootstrap_completed boolean NOT NULL DEFAULT false,
  owner_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  owner_email citext,
  environment text NOT NULL DEFAULT 'development',
  completed_at timestamptz,
  last_run_at timestamptz,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT platform_bootstrap_status_singleton_valid CHECK (singleton = true)
);

-- Enforce a single bootstrap ledger row.
CREATE UNIQUE INDEX IF NOT EXISTS platform_bootstrap_status_singleton_uidx
  ON public.platform_bootstrap_status (singleton);

-- ---------------------------------------------------------------------------
-- platform_plan_templates — reusable subscription plan blueprints
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_plan_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code text NOT NULL,
  plan_name text NOT NULL,
  tenant_type text NOT NULL DEFAULT 'business',
  seat_limit integer NOT NULL DEFAULT 1,
  module_entitlements jsonb NOT NULL DEFAULT '{}'::jsonb,
  usage_limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT platform_plan_templates_code_not_empty CHECK (char_length(trim(plan_code)) > 0),
  CONSTRAINT platform_plan_templates_tenant_type_valid CHECK (
    tenant_type IN ('solo', 'business', 'enterprise')
  ),
  CONSTRAINT platform_plan_templates_seats_non_negative CHECK (seat_limit >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS platform_plan_templates_code_active_uidx
  ON public.platform_plan_templates (plan_code)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- platform_license_templates — reusable license blueprints
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_license_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_code text NOT NULL,
  license_name text NOT NULL,
  duration_days integer,
  is_trial boolean NOT NULL DEFAULT false,
  default_plan_code text,
  entitlements jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT platform_license_templates_code_not_empty CHECK (char_length(trim(license_code)) > 0),
  CONSTRAINT platform_license_templates_duration_non_negative CHECK (
    duration_days IS NULL OR duration_days >= 0
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS platform_license_templates_code_active_uidx
  ON public.platform_license_templates (license_code)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Triggers + RLS — service-role only (platform-global, above all tenants)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'platform_bootstrap_status',
    'platform_plan_templates',
    'platform_license_templates'
  ]
  LOOP
    EXECUTE format('CREATE TRIGGER trg_%s_set_created_by BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_created_by()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_updated_by BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_by()', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_set_row_version BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_row_version()', t, t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I_service_role_all ON public.%I FOR ALL TO service_role USING (public.is_service_role()) WITH CHECK (public.is_service_role())',
      t, t
    );
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;
