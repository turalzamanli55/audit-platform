-- cap_subscription-and-licensing migration evidence
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
  status public.record_status NOT NULL DEFAULT 'active'
);
