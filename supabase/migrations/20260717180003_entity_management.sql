-- cap_entity-management migration evidence
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
  status public.record_status NOT NULL DEFAULT 'active'
);
