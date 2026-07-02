-- FEATURE-PLANNING-001: Audit planning foundation — audit plans, activity, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.planning_status AS ENUM (
  'not_started',
  'in_progress',
  'pending_review',
  'returned',
  'approved',
  'superseded'
);

CREATE TYPE public.integration_readiness_status AS ENUM (
  'not_configured',
  'placeholder',
  'integrated'
);

-- ---------------------------------------------------------------------------
-- audit_plans
-- ---------------------------------------------------------------------------

CREATE TABLE public.audit_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  planning_status public.planning_status NOT NULL DEFAULT 'not_started',
  plan_version integer NOT NULL DEFAULT 1,
  audit_strategy text,
  engagement_objectives text,
  scope_of_audit text,
  financial_reporting_framework text,
  planning_notes text,
  materiality_status public.integration_readiness_status NOT NULL DEFAULT 'not_configured',
  risk_status public.integration_readiness_status NOT NULL DEFAULT 'not_configured',
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  team_planning jsonb NOT NULL DEFAULT '{}'::jsonb,
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT audit_plans_workspace_org_consistency CHECK (
    organization_id IS NOT NULL AND workspace_id IS NOT NULL AND engagement_id IS NOT NULL
  ),
  CONSTRAINT audit_plans_plan_version_positive CHECK (plan_version >= 1)
);

CREATE UNIQUE INDEX audit_plans_engagement_active_uidx
  ON public.audit_plans (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX audit_plans_organization_id_idx ON public.audit_plans (organization_id);
CREATE INDEX audit_plans_workspace_id_idx ON public.audit_plans (workspace_id);
CREATE INDEX audit_plans_engagement_id_idx ON public.audit_plans (engagement_id);
CREATE INDEX audit_plans_planning_status_idx ON public.audit_plans (planning_status);

-- ---------------------------------------------------------------------------
-- planning_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.planning_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT planning_activity_action_not_empty CHECK (char_length(trim(action)) > 0)
);

CREATE INDEX planning_activity_audit_plan_id_idx ON public.planning_activity (audit_plan_id);
CREATE INDEX planning_activity_engagement_id_idx ON public.planning_activity (engagement_id);
CREATE INDEX planning_activity_created_at_idx ON public.planning_activity (created_at DESC);
CREATE INDEX planning_activity_workspace_id_idx ON public.planning_activity (workspace_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_audit_plans_set_created_by
  BEFORE INSERT ON public.audit_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_audit_plans_set_updated_at
  BEFORE UPDATE ON public.audit_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_audit_plans_set_updated_by
  BEFORE UPDATE ON public.audit_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_audit_plans_set_row_version
  BEFORE INSERT OR UPDATE ON public.audit_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_planning_activity_set_created_by
  BEFORE INSERT ON public.planning_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_planning_activity_set_updated_at
  BEFORE UPDATE ON public.planning_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_planning_activity_set_updated_by
  BEFORE UPDATE ON public.planning_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_planning_activity_set_row_version
  BEFORE INSERT OR UPDATE ON public.planning_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_audit_plan(target_audit_plan_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.audit_plans ap
      WHERE ap.id = target_audit_plan_id
        AND ap.deleted_at IS NULL
        AND public.user_belongs_to_workspace(ap.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.audit_plans ap
      JOIN public.engagement_members em ON em.engagement_id = ap.engagement_id
      WHERE ap.id = target_audit_plan_id
        AND em.user_id = public.auth_user_id()
        AND em.deleted_at IS NULL
        AND em.status = 'active'
    );
$$;

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('planning.read', 'Read Planning', 'View audit planning workspace and documents', 'workspace', 'planning', 'active'),
  ('planning.create', 'Create Planning', 'Initiate audit planning for an engagement', 'workspace', 'planning', 'active'),
  ('planning.update', 'Update Planning', 'Modify audit planning content', 'workspace', 'planning', 'active'),
  ('planning.archive', 'Archive Planning', 'Archive audit planning records', 'workspace', 'planning', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.audit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_plans_select_authenticated ON public.audit_plans
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY audit_plans_insert_authenticated ON public.audit_plans
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY audit_plans_update_authenticated ON public.audit_plans
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY audit_plans_delete_service ON public.audit_plans
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY planning_activity_select_authenticated ON public.planning_activity
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_audit_plan(audit_plan_id)
  );

CREATE POLICY planning_activity_insert_authenticated ON public.planning_activity
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY planning_activity_update_service ON public.planning_activity
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY planning_activity_delete_service ON public.planning_activity
  FOR DELETE TO authenticated
  USING (public.is_service_role());
