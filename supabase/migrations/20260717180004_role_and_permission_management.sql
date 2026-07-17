-- cap_role-and-permission-management migration evidence
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
  status public.record_status NOT NULL DEFAULT 'active'
);
