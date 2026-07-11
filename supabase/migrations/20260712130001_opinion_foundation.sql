-- FEATURE-OPINION-001: Engagement audit opinion foundation — packages, sections, comments, activity, versions, RLS, permissions

CREATE TYPE public.opinion_package_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'archived'
);

CREATE TYPE public.opinion_section_status AS ENUM (
  'pending',
  'under_review',
  'returned',
  'resolved'
);

CREATE TYPE public.opinion_section_type AS ENUM (
  'opinion_type',
  'basis_for_opinion',
  'key_audit_matters',
  'emphasis_of_matter',
  'other_information',
  'responsibilities',
  'signature'
);

CREATE TYPE public.opinion_type AS ENUM (
  'unqualified',
  'qualified',
  'adverse',
  'disclaimer'
);

CREATE TYPE public.opinion_comment_type AS ENUM (
  'opinion',
  'reviewer',
  'internal'
);

CREATE TABLE public.opinion_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  reporting_package_id uuid REFERENCES public.reporting_packages (id) ON DELETE SET NULL,
  package_status public.opinion_package_status NOT NULL DEFAULT 'draft',
  opinion_type public.opinion_type,
  package_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  pending_count integer NOT NULL DEFAULT 0,
  returned_count integer NOT NULL DEFAULT 0,
  resolved_count integer NOT NULL DEFAULT 0,
  pending_sections_count integer NOT NULL DEFAULT 0,
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
  CONSTRAINT opinion_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT opinion_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT opinion_packages_pending_count_non_negative CHECK (pending_count >= 0),
  CONSTRAINT opinion_packages_returned_count_non_negative CHECK (returned_count >= 0),
  CONSTRAINT opinion_packages_resolved_count_non_negative CHECK (resolved_count >= 0),
  CONSTRAINT opinion_packages_pending_sections_count_non_negative CHECK (pending_sections_count >= 0)
);

CREATE UNIQUE INDEX opinion_packages_engagement_active_uidx
  ON public.opinion_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX opinion_packages_workspace_id_idx ON public.opinion_packages (workspace_id);
CREATE INDEX opinion_packages_engagement_id_idx ON public.opinion_packages (engagement_id);
CREATE INDEX opinion_packages_audit_plan_id_idx ON public.opinion_packages (audit_plan_id);

CREATE TABLE public.opinion_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opinion_package_id uuid NOT NULL REFERENCES public.opinion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  section_type public.opinion_section_type NOT NULL,
  section_status public.opinion_section_status NOT NULL DEFAULT 'pending',
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
  CONSTRAINT opinion_sections_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX opinion_sections_package_id_idx ON public.opinion_sections (opinion_package_id);
CREATE INDEX opinion_sections_engagement_id_idx ON public.opinion_sections (engagement_id);
CREATE INDEX opinion_sections_status_idx ON public.opinion_sections (section_status);
CREATE INDEX opinion_sections_type_idx ON public.opinion_sections (section_type);

CREATE TABLE public.opinion_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opinion_package_id uuid NOT NULL REFERENCES public.opinion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT opinion_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX opinion_versions_package_version_uidx
  ON public.opinion_versions (opinion_package_id, version_number);

CREATE INDEX opinion_versions_package_id_idx ON public.opinion_versions (opinion_package_id);

CREATE TABLE public.opinion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opinion_package_id uuid NOT NULL REFERENCES public.opinion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.opinion_comment_type NOT NULL DEFAULT 'opinion',
  body text NOT NULL,
  parent_comment_id uuid REFERENCES public.opinion_comments (id) ON DELETE SET NULL,
  opinion_section_id uuid REFERENCES public.opinion_sections (id) ON DELETE SET NULL,
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
  CONSTRAINT opinion_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX opinion_comments_package_id_idx ON public.opinion_comments (opinion_package_id);

CREATE TABLE public.opinion_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opinion_package_id uuid NOT NULL REFERENCES public.opinion_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX opinion_activity_package_id_idx ON public.opinion_activity (opinion_package_id);
CREATE INDEX opinion_activity_created_at_idx ON public.opinion_activity (created_at DESC);

CREATE OR REPLACE FUNCTION public.user_can_access_opinion_package(target_opinion_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.opinion_packages op
      WHERE op.id = target_opinion_package_id
        AND op.deleted_at IS NULL
        AND public.user_belongs_to_workspace(op.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.opinion_packages op
      JOIN public.engagement_members em ON em.engagement_id = op.engagement_id
      WHERE op.id = target_opinion_package_id
        AND em.user_id = public.auth_user_id()
        AND em.deleted_at IS NULL
        AND em.status = 'active'
    );
$$;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('opinion.read', 'Read Opinion', 'View engagement audit opinion workspace and sections', 'workspace', 'opinion', 'active'),
  ('opinion.create', 'Create Opinion', 'Initiate audit opinion package for an engagement', 'workspace', 'opinion', 'active'),
  ('opinion.update', 'Update Opinion', 'Modify opinion sections and documentation', 'workspace', 'opinion', 'active'),
  ('opinion.review', 'Review Opinion', 'Review and return engagement opinion sections', 'workspace', 'opinion', 'active'),
  ('opinion.approve', 'Approve Opinion', 'Approve engagement audit opinion package', 'workspace', 'opinion', 'active'),
  ('opinion.archive', 'Archive Opinion', 'Archive opinion packages', 'workspace', 'opinion', 'active'),
  ('opinion.comment', 'Comment on Opinion', 'Add opinion and reviewer notes', 'workspace', 'opinion', 'active')
ON CONFLICT DO NOTHING;

ALTER TABLE public.opinion_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY opinion_packages_select ON public.opinion_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY opinion_packages_write ON public.opinion_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY opinion_sections_access ON public.opinion_sections
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_opinion_package(opinion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY opinion_versions_access ON public.opinion_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_opinion_package(opinion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY opinion_comments_access ON public.opinion_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_opinion_package(opinion_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY opinion_activity_select ON public.opinion_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_opinion_package(opinion_package_id));

CREATE POLICY opinion_activity_insert ON public.opinion_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_opinion_package(opinion_package_id));

CREATE TRIGGER opinion_packages_set_updated_at
  BEFORE UPDATE ON public.opinion_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER opinion_sections_set_updated_at
  BEFORE UPDATE ON public.opinion_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER opinion_comments_set_updated_at
  BEFORE UPDATE ON public.opinion_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
