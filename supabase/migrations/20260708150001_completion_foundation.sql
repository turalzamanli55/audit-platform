-- FEATURE-COMPLETION-001: Engagement completion foundation — packages, items, comments, activity, versions, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.completion_package_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'archived'
);

CREATE TYPE public.completion_item_status AS ENUM (
  'pending',
  'under_review',
  'returned',
  'resolved'
);

CREATE TYPE public.completion_item_type AS ENUM (
  'checklist',
  'outstanding_item',
  'management_letter',
  'subsequent_events',
  'going_concern',
  'representation_letter',
  'final_analytics'
);

CREATE TYPE public.completion_comment_type AS ENUM (
  'completion',
  'reviewer',
  'internal'
);

-- ---------------------------------------------------------------------------
-- completion_packages
-- ---------------------------------------------------------------------------

CREATE TABLE public.completion_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  review_package_id uuid REFERENCES public.review_packages (id) ON DELETE SET NULL,
  package_status public.completion_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  pending_count integer NOT NULL DEFAULT 0,
  returned_count integer NOT NULL DEFAULT 0,
  resolved_count integer NOT NULL DEFAULT 0,
  outstanding_count integer NOT NULL DEFAULT 0,
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
  CONSTRAINT completion_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT completion_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT completion_packages_pending_count_non_negative CHECK (pending_count >= 0),
  CONSTRAINT completion_packages_returned_count_non_negative CHECK (returned_count >= 0),
  CONSTRAINT completion_packages_resolved_count_non_negative CHECK (resolved_count >= 0),
  CONSTRAINT completion_packages_outstanding_count_non_negative CHECK (outstanding_count >= 0)
);

CREATE UNIQUE INDEX completion_packages_engagement_active_uidx
  ON public.completion_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX completion_packages_workspace_id_idx ON public.completion_packages (workspace_id);
CREATE INDEX completion_packages_engagement_id_idx ON public.completion_packages (engagement_id);
CREATE INDEX completion_packages_audit_plan_id_idx ON public.completion_packages (audit_plan_id);

-- ---------------------------------------------------------------------------
-- completion_items
-- ---------------------------------------------------------------------------

CREATE TABLE public.completion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_package_id uuid NOT NULL REFERENCES public.completion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  item_type public.completion_item_type NOT NULL,
  item_status public.completion_item_status NOT NULL DEFAULT 'pending',
  title text NOT NULL,
  description text,
  severity text,
  priority text,
  due_date date,
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
  CONSTRAINT completion_items_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX completion_items_package_id_idx ON public.completion_items (completion_package_id);
CREATE INDEX completion_items_engagement_id_idx ON public.completion_items (engagement_id);
CREATE INDEX completion_items_status_idx ON public.completion_items (item_status);
CREATE INDEX completion_items_type_idx ON public.completion_items (item_type);

-- ---------------------------------------------------------------------------
-- completion_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.completion_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_package_id uuid NOT NULL REFERENCES public.completion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT completion_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX completion_versions_package_version_uidx
  ON public.completion_versions (completion_package_id, version_number);

CREATE INDEX completion_versions_package_id_idx ON public.completion_versions (completion_package_id);

-- ---------------------------------------------------------------------------
-- completion_comments
-- ---------------------------------------------------------------------------

CREATE TABLE public.completion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_package_id uuid NOT NULL REFERENCES public.completion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.completion_comment_type NOT NULL DEFAULT 'completion',
  body text NOT NULL,
  parent_comment_id uuid REFERENCES public.completion_comments (id) ON DELETE SET NULL,
  completion_item_id uuid REFERENCES public.completion_items (id) ON DELETE SET NULL,
  mentions jsonb NOT NULL DEFAULT '[]'::jsonb,
  attachment_metadata jsonb NOT NULL DEFAULT '[]'::jsonb,
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
  CONSTRAINT completion_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX completion_comments_package_id_idx ON public.completion_comments (completion_package_id);

-- ---------------------------------------------------------------------------
-- completion_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.completion_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_package_id uuid NOT NULL REFERENCES public.completion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX completion_activity_package_id_idx ON public.completion_activity (completion_package_id);
CREATE INDEX completion_activity_created_at_idx ON public.completion_activity (created_at DESC);

-- ---------------------------------------------------------------------------
-- Access helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_completion_package(target_completion_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.completion_packages cp
      WHERE cp.id = target_completion_package_id
        AND cp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(cp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.completion_packages cp
      JOIN public.engagement_members em ON em.engagement_id = cp.engagement_id
      WHERE cp.id = target_completion_package_id
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
  ('completion.read', 'Read Completion', 'View engagement completion workspace and checklist', 'workspace', 'completion', 'active'),
  ('completion.create', 'Create Completion', 'Initiate completion package for an engagement', 'workspace', 'completion', 'active'),
  ('completion.update', 'Update Completion', 'Modify completion items and documentation', 'workspace', 'completion', 'active'),
  ('completion.review', 'Review Completion', 'Review and return engagement completion items', 'workspace', 'completion', 'active'),
  ('completion.approve', 'Approve Completion', 'Approve engagement completion package', 'workspace', 'completion', 'active'),
  ('completion.archive', 'Archive Completion', 'Archive completion packages', 'workspace', 'completion', 'active'),
  ('completion.comment', 'Comment on Completion', 'Add completion and reviewer notes', 'workspace', 'completion', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.completion_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completion_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completion_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY completion_packages_select ON public.completion_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY completion_packages_write ON public.completion_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY completion_items_access ON public.completion_items
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_completion_package(completion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY completion_versions_access ON public.completion_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_completion_package(completion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY completion_comments_access ON public.completion_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_completion_package(completion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY completion_activity_select ON public.completion_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_completion_package(completion_package_id));

CREATE POLICY completion_activity_insert ON public.completion_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_completion_package(completion_package_id));

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER completion_packages_set_updated_at
  BEFORE UPDATE ON public.completion_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER completion_items_set_updated_at
  BEFORE UPDATE ON public.completion_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER completion_comments_set_updated_at
  BEFORE UPDATE ON public.completion_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
