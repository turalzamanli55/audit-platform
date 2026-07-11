-- FEATURE-REPORTING-001: Engagement reporting foundation — packages, sections, comments, activity, versions, RLS, permissions

CREATE TYPE public.reporting_package_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'archived'
);

CREATE TYPE public.report_section_status AS ENUM (
  'pending',
  'under_review',
  'returned',
  'resolved'
);

CREATE TYPE public.report_section_type AS ENUM (
  'executive_summary',
  'financial_statements',
  'ifrs_notes',
  'management_letter',
  'audit_findings',
  'recommendations',
  'appendices'
);

CREATE TYPE public.report_comment_type AS ENUM (
  'reporting',
  'reviewer',
  'internal'
);

CREATE TABLE public.reporting_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  completion_package_id uuid REFERENCES public.completion_packages (id) ON DELETE SET NULL,
  package_status public.reporting_package_status NOT NULL DEFAULT 'draft',
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
  CONSTRAINT reporting_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT reporting_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT reporting_packages_pending_count_non_negative CHECK (pending_count >= 0),
  CONSTRAINT reporting_packages_returned_count_non_negative CHECK (returned_count >= 0),
  CONSTRAINT reporting_packages_resolved_count_non_negative CHECK (resolved_count >= 0),
  CONSTRAINT reporting_packages_pending_sections_count_non_negative CHECK (pending_sections_count >= 0)
);

CREATE UNIQUE INDEX reporting_packages_engagement_active_uidx
  ON public.reporting_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX reporting_packages_workspace_id_idx ON public.reporting_packages (workspace_id);
CREATE INDEX reporting_packages_engagement_id_idx ON public.reporting_packages (engagement_id);
CREATE INDEX reporting_packages_audit_plan_id_idx ON public.reporting_packages (audit_plan_id);

CREATE TABLE public.report_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporting_package_id uuid NOT NULL REFERENCES public.reporting_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  section_type public.report_section_type NOT NULL,
  section_status public.report_section_status NOT NULL DEFAULT 'pending',
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
  CONSTRAINT report_sections_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX report_sections_package_id_idx ON public.report_sections (reporting_package_id);
CREATE INDEX report_sections_engagement_id_idx ON public.report_sections (engagement_id);
CREATE INDEX report_sections_status_idx ON public.report_sections (section_status);
CREATE INDEX report_sections_type_idx ON public.report_sections (section_type);

CREATE TABLE public.report_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporting_package_id uuid NOT NULL REFERENCES public.reporting_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT report_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX report_versions_package_version_uidx
  ON public.report_versions (reporting_package_id, version_number);

CREATE INDEX report_versions_package_id_idx ON public.report_versions (reporting_package_id);

CREATE TABLE public.report_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporting_package_id uuid NOT NULL REFERENCES public.reporting_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.report_comment_type NOT NULL DEFAULT 'reporting',
  body text NOT NULL,
  parent_comment_id uuid REFERENCES public.report_comments (id) ON DELETE SET NULL,
  report_section_id uuid REFERENCES public.report_sections (id) ON DELETE SET NULL,
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
  CONSTRAINT report_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX report_comments_package_id_idx ON public.report_comments (reporting_package_id);

CREATE TABLE public.report_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporting_package_id uuid NOT NULL REFERENCES public.reporting_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX report_activity_package_id_idx ON public.report_activity (reporting_package_id);
CREATE INDEX report_activity_created_at_idx ON public.report_activity (created_at DESC);

CREATE OR REPLACE FUNCTION public.user_can_access_reporting_package(target_reporting_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.reporting_packages rp
      WHERE rp.id = target_reporting_package_id
        AND rp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(rp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.reporting_packages rp
      JOIN public.engagement_members em ON em.engagement_id = rp.engagement_id
      WHERE rp.id = target_reporting_package_id
        AND em.user_id = public.auth_user_id()
        AND em.deleted_at IS NULL
        AND em.status = 'active'
    );
$$;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('reporting.read', 'Read Reporting', 'View engagement reporting workspace and report sections', 'workspace', 'reporting', 'active'),
  ('reporting.create', 'Create Reporting', 'Initiate reporting package for an engagement', 'workspace', 'reporting', 'active'),
  ('reporting.update', 'Update Reporting', 'Modify report sections and documentation', 'workspace', 'reporting', 'active'),
  ('reporting.review', 'Review Reporting', 'Review and return engagement report sections', 'workspace', 'reporting', 'active'),
  ('reporting.approve', 'Approve Reporting', 'Approve engagement reporting package', 'workspace', 'reporting', 'active'),
  ('reporting.archive', 'Archive Reporting', 'Archive reporting packages', 'workspace', 'reporting', 'active'),
  ('reporting.comment', 'Comment on Reporting', 'Add reporting and reviewer notes', 'workspace', 'reporting', 'active')
ON CONFLICT DO NOTHING;

ALTER TABLE public.reporting_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY reporting_packages_select ON public.reporting_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY reporting_packages_write ON public.reporting_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY report_sections_access ON public.report_sections
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_reporting_package(reporting_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY report_versions_access ON public.report_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_reporting_package(reporting_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY report_comments_access ON public.report_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_reporting_package(reporting_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY report_activity_select ON public.report_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_reporting_package(reporting_package_id));

CREATE POLICY report_activity_insert ON public.report_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_reporting_package(reporting_package_id));

CREATE TRIGGER reporting_packages_set_updated_at
  BEFORE UPDATE ON public.reporting_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER report_sections_set_updated_at
  BEFORE UPDATE ON public.report_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER report_comments_set_updated_at
  BEFORE UPDATE ON public.report_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
