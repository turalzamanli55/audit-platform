-- FEATURE-PLANNING-002: Planning production — workflow attribution, comments, permissions

-- ---------------------------------------------------------------------------
-- audit_plans workflow columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.audit_plans
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS returned_at timestamptz,
  ADD COLUMN IF NOT EXISTS returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS return_notes text,
  ADD COLUMN IF NOT EXISTS revision_history jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- planning_comments
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.planning_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  author_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  comment_type text NOT NULL DEFAULT 'review',
  body text NOT NULL,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT planning_comments_body_not_empty CHECK (char_length(trim(body)) > 0),
  CONSTRAINT planning_comments_type_valid CHECK (comment_type IN ('review', 'general', 'return'))
);

CREATE INDEX IF NOT EXISTS planning_comments_audit_plan_id_idx
  ON public.planning_comments (audit_plan_id);
CREATE INDEX IF NOT EXISTS planning_comments_engagement_id_idx
  ON public.planning_comments (engagement_id);
CREATE INDEX IF NOT EXISTS planning_comments_created_at_idx
  ON public.planning_comments (created_at DESC);

CREATE TRIGGER trg_planning_comments_set_created_by
  BEFORE INSERT ON public.planning_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_planning_comments_set_updated_at
  BEFORE UPDATE ON public.planning_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_planning_comments_set_updated_by
  BEFORE UPDATE ON public.planning_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_planning_comments_set_row_version
  BEFORE INSERT OR UPDATE ON public.planning_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('planning.submit', 'Submit Planning', 'Submit audit plan for partner review', 'workspace', 'planning', 'active'),
  ('planning.review', 'Review Planning', 'Review submitted audit plans', 'workspace', 'planning', 'active'),
  ('planning.approve', 'Approve Planning', 'Approve audit plans and enable fieldwork', 'workspace', 'planning', 'active'),
  ('planning.comment', 'Comment on Planning', 'Add review comments on audit planning', 'workspace', 'planning', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.planning_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY planning_comments_select_authenticated ON public.planning_comments
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_audit_plan(audit_plan_id)
  );

CREATE POLICY planning_comments_insert_authenticated ON public.planning_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY planning_comments_update_authenticated ON public.planning_comments
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY planning_comments_delete_service ON public.planning_comments
  FOR DELETE TO authenticated
  USING (public.is_service_role());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.planning_comments TO authenticated;
GRANT ALL ON public.planning_comments TO service_role;
