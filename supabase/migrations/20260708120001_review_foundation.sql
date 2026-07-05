-- FEATURE-REVIEW-001: Engagement review foundation — packages, items, comments, activity, versions, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.review_package_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'archived'
);

CREATE TYPE public.review_item_status AS ENUM (
  'pending',
  'under_review',
  'returned',
  'resolved'
);

CREATE TYPE public.review_source_module AS ENUM (
  'planning',
  'materiality',
  'risk_assessment',
  'fieldwork'
);

CREATE TYPE public.review_comment_type AS ENUM (
  'review',
  'reviewer',
  'internal'
);

-- ---------------------------------------------------------------------------
-- review_packages
-- ---------------------------------------------------------------------------

CREATE TABLE public.review_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  fieldwork_package_id uuid REFERENCES public.fieldwork_packages (id) ON DELETE SET NULL,
  package_status public.review_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  pending_count integer NOT NULL DEFAULT 0,
  returned_count integer NOT NULL DEFAULT 0,
  resolved_count integer NOT NULL DEFAULT 0,
  open_findings_count integer NOT NULL DEFAULT 0,
  summary_notes text,
  submitted_at timestamptz,
  submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  returned_at timestamptz,
  returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  return_notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT review_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT review_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT review_packages_pending_count_non_negative CHECK (pending_count >= 0),
  CONSTRAINT review_packages_returned_count_non_negative CHECK (returned_count >= 0),
  CONSTRAINT review_packages_resolved_count_non_negative CHECK (resolved_count >= 0),
  CONSTRAINT review_packages_open_findings_count_non_negative CHECK (open_findings_count >= 0)
);

CREATE UNIQUE INDEX review_packages_engagement_active_uidx
  ON public.review_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX review_packages_workspace_id_idx ON public.review_packages (workspace_id);
CREATE INDEX review_packages_engagement_id_idx ON public.review_packages (engagement_id);
CREATE INDEX review_packages_audit_plan_id_idx ON public.review_packages (audit_plan_id);

-- ---------------------------------------------------------------------------
-- review_items
-- ---------------------------------------------------------------------------

CREATE TABLE public.review_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_package_id uuid NOT NULL REFERENCES public.review_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  source_module public.review_source_module NOT NULL,
  source_entity_type text NOT NULL,
  source_entity_id uuid NOT NULL,
  item_status public.review_item_status NOT NULL DEFAULT 'pending',
  title text NOT NULL,
  description text,
  severity text,
  href text,
  assigned_reviewer_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  return_notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT review_items_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX review_items_package_id_idx ON public.review_items (review_package_id);
CREATE INDEX review_items_engagement_id_idx ON public.review_items (engagement_id);
CREATE INDEX review_items_status_idx ON public.review_items (item_status);
CREATE UNIQUE INDEX review_items_source_entity_uidx
  ON public.review_items (review_package_id, source_module, source_entity_type, source_entity_id)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- review_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.review_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_package_id uuid NOT NULL REFERENCES public.review_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT review_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX review_versions_package_version_uidx
  ON public.review_versions (review_package_id, version_number);

CREATE INDEX review_versions_package_id_idx ON public.review_versions (review_package_id);

-- ---------------------------------------------------------------------------
-- review_comments
-- ---------------------------------------------------------------------------

CREATE TABLE public.review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_package_id uuid NOT NULL REFERENCES public.review_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.review_comment_type NOT NULL DEFAULT 'review',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT review_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX review_comments_package_id_idx ON public.review_comments (review_package_id);

-- ---------------------------------------------------------------------------
-- review_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.review_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_package_id uuid NOT NULL REFERENCES public.review_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX review_activity_package_id_idx ON public.review_activity (review_package_id);
CREATE INDEX review_activity_created_at_idx ON public.review_activity (created_at DESC);

-- ---------------------------------------------------------------------------
-- Access helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_review_package(target_review_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.review_packages rp
      WHERE rp.id = target_review_package_id
        AND rp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(rp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.review_packages rp
      JOIN public.engagement_members em ON em.engagement_id = rp.engagement_id
      WHERE rp.id = target_review_package_id
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
  ('review.read', 'Read Review', 'View engagement review workspace and review queue', 'workspace', 'review', 'active'),
  ('review.create', 'Create Review', 'Initiate review package for an engagement', 'workspace', 'review', 'active'),
  ('review.update', 'Update Review', 'Modify review items and reviewer notes', 'workspace', 'review', 'active'),
  ('review.review', 'Review Items', 'Review and return engagement review items', 'workspace', 'review', 'active'),
  ('review.approve', 'Approve Review', 'Approve engagement review package', 'workspace', 'review', 'active'),
  ('review.archive', 'Archive Review', 'Archive review packages', 'workspace', 'review', 'active'),
  ('review.comment', 'Comment on Review', 'Add review and reviewer notes', 'workspace', 'review', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.review_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY review_packages_select ON public.review_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY review_packages_write ON public.review_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY review_items_access ON public.review_items
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_review_package(review_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY review_versions_access ON public.review_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_review_package(review_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY review_comments_access ON public.review_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_review_package(review_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY review_activity_select ON public.review_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_review_package(review_package_id));

CREATE POLICY review_activity_insert ON public.review_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_review_package(review_package_id));

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER review_packages_set_updated_at
  BEFORE UPDATE ON public.review_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER review_items_set_updated_at
  BEFORE UPDATE ON public.review_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER review_comments_set_updated_at
  BEFORE UPDATE ON public.review_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
