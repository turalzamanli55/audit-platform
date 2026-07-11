-- FEATURE-FS-001: Financial Statements foundation — packages, sections, lines, values, versions, comments, activity, exports, RLS, permissions

CREATE TYPE public.financial_statement_package_status AS ENUM (
  'draft',
  'prepared',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'published',
  'archived'
);

CREATE TYPE public.financial_statement_section_status AS ENUM (
  'pending',
  'under_review',
  'returned',
  'resolved'
);

CREATE TYPE public.financial_statement_section_type AS ENUM (
  'balance_sheet',
  'income_statement',
  'cash_flow_statement',
  'changes_in_equity',
  'notes_links',
  'cross_references'
);

CREATE TYPE public.financial_statement_comment_type AS ENUM (
  'financial_statement',
  'reviewer',
  'internal'
);

CREATE TYPE public.financial_statement_line_kind AS ENUM (
  'header',
  'line',
  'subtotal',
  'total',
  'spacer'
);

CREATE TYPE public.financial_statement_export_status AS ENUM (
  'pending',
  'ready',
  'blocked',
  'archived'
);

CREATE TABLE public.financial_statement_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  opinion_package_id uuid REFERENCES public.opinion_packages (id) ON DELETE SET NULL,
  package_status public.financial_statement_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  pending_count integer NOT NULL DEFAULT 0,
  returned_count integer NOT NULL DEFAULT 0,
  resolved_count integer NOT NULL DEFAULT 0,
  pending_sections_count integer NOT NULL DEFAULT 0,
  mapping_coverage_pct integer NOT NULL DEFAULT 0,
  balance_check_status text NOT NULL DEFAULT 'unchecked',
  summary_notes text,
  prepared_at timestamptz,
  prepared_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  submitted_at timestamptz,
  submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  returned_at timestamptz,
  returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  return_notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  published_at timestamptz,
  published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT financial_statement_packages_mapping_coverage_pct_range CHECK (mapping_coverage_pct >= 0 AND mapping_coverage_pct <= 100),
  CONSTRAINT financial_statement_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT financial_statement_packages_pending_count_non_negative CHECK (pending_count >= 0),
  CONSTRAINT financial_statement_packages_returned_count_non_negative CHECK (returned_count >= 0),
  CONSTRAINT financial_statement_packages_resolved_count_non_negative CHECK (resolved_count >= 0),
  CONSTRAINT financial_statement_packages_pending_sections_count_non_negative CHECK (pending_sections_count >= 0)
);

CREATE UNIQUE INDEX financial_statement_packages_engagement_active_uidx
  ON public.financial_statement_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_packages_workspace_id_idx ON public.financial_statement_packages (workspace_id);
CREATE INDEX financial_statement_packages_engagement_id_idx ON public.financial_statement_packages (engagement_id);
CREATE INDEX financial_statement_packages_audit_plan_id_idx ON public.financial_statement_packages (audit_plan_id);
CREATE INDEX financial_statement_packages_opinion_package_id_idx ON public.financial_statement_packages (opinion_package_id);

CREATE TABLE public.financial_statement_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  section_type public.financial_statement_section_type NOT NULL,
  section_status public.financial_statement_section_status NOT NULL DEFAULT 'pending',
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
  CONSTRAINT financial_statement_sections_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX financial_statement_sections_package_id_idx ON public.financial_statement_sections (financial_statement_package_id);
CREATE INDEX financial_statement_sections_engagement_id_idx ON public.financial_statement_sections (engagement_id);
CREATE INDEX financial_statement_sections_status_idx ON public.financial_statement_sections (section_status);
CREATE INDEX financial_statement_sections_type_idx ON public.financial_statement_sections (section_type);

CREATE TABLE public.financial_statement_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  financial_statement_section_id uuid NOT NULL REFERENCES public.financial_statement_sections (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  line_code text NOT NULL,
  line_label text NOT NULL,
  line_kind public.financial_statement_line_kind NOT NULL DEFAULT 'line',
  parent_line_id uuid REFERENCES public.financial_statement_lines (id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_mapped boolean NOT NULL DEFAULT false,
  mapping_ref text,
  cross_ref text,
  notes_link_ref text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_lines_code_not_empty CHECK (char_length(trim(line_code)) > 0),
  CONSTRAINT financial_statement_lines_label_not_empty CHECK (char_length(trim(line_label)) > 0)
);

CREATE INDEX financial_statement_lines_package_id_idx ON public.financial_statement_lines (financial_statement_package_id);
CREATE INDEX financial_statement_lines_section_id_idx ON public.financial_statement_lines (financial_statement_section_id);
CREATE UNIQUE INDEX financial_statement_lines_package_code_uidx
  ON public.financial_statement_lines (financial_statement_package_id, line_code)
  WHERE deleted_at IS NULL;

CREATE TABLE public.financial_statement_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  financial_statement_line_id uuid NOT NULL REFERENCES public.financial_statement_lines (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  period_key text NOT NULL DEFAULT 'current',
  amount numeric(24, 6),
  currency_code text,
  is_comparative boolean NOT NULL DEFAULT false,
  source_ref text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_values_period_key_not_empty CHECK (char_length(trim(period_key)) > 0)
);

CREATE INDEX financial_statement_values_package_id_idx ON public.financial_statement_values (financial_statement_package_id);
CREATE INDEX financial_statement_values_line_id_idx ON public.financial_statement_values (financial_statement_line_id);
CREATE UNIQUE INDEX financial_statement_values_line_period_uidx
  ON public.financial_statement_values (financial_statement_line_id, period_key)
  WHERE deleted_at IS NULL;

CREATE TABLE public.financial_statement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT financial_statement_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX financial_statement_versions_package_version_uidx
  ON public.financial_statement_versions (financial_statement_package_id, version_number);

CREATE INDEX financial_statement_versions_package_id_idx ON public.financial_statement_versions (financial_statement_package_id);

CREATE TABLE public.financial_statement_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.financial_statement_comment_type NOT NULL DEFAULT 'financial_statement',
  body text NOT NULL,
  parent_comment_id uuid REFERENCES public.financial_statement_comments (id) ON DELETE SET NULL,
  financial_statement_section_id uuid REFERENCES public.financial_statement_sections (id) ON DELETE SET NULL,
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
  CONSTRAINT financial_statement_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX financial_statement_comments_package_id_idx ON public.financial_statement_comments (financial_statement_package_id);

CREATE TABLE public.financial_statement_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX financial_statement_activity_package_id_idx ON public.financial_statement_activity (financial_statement_package_id);
CREATE INDEX financial_statement_activity_created_at_idx ON public.financial_statement_activity (created_at DESC);

CREATE TABLE public.financial_statement_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_statement_package_id uuid NOT NULL REFERENCES public.financial_statement_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  export_status public.financial_statement_export_status NOT NULL DEFAULT 'blocked',
  export_format text,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE INDEX financial_statement_exports_package_id_idx ON public.financial_statement_exports (financial_statement_package_id);

CREATE OR REPLACE FUNCTION public.user_can_access_financial_statement_package(target_financial_statement_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.financial_statement_packages fsp
      WHERE fsp.id = target_financial_statement_package_id
        AND fsp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(fsp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.financial_statement_packages fsp
      JOIN public.engagement_members em ON em.engagement_id = fsp.engagement_id
      WHERE fsp.id = target_financial_statement_package_id
        AND em.user_id = public.auth_user_id()
        AND em.deleted_at IS NULL
        AND em.status = 'active'
    );
$$;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('financialStatements.read', 'Read Financial Statements', 'View engagement financial statement workspace and sections', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.create', 'Create Financial Statements', 'Initiate financial statement package for an engagement', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.update', 'Update Financial Statements', 'Modify financial statement sections and lines', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.review', 'Review Financial Statements', 'Review and return engagement financial statement sections', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.approve', 'Approve Financial Statements', 'Approve engagement financial statement package', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.archive', 'Archive Financial Statements', 'Archive financial statement packages', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.comment', 'Comment on Financial Statements', 'Add financial statement and reviewer notes', 'workspace', 'financial_statements', 'active'),
  ('financialStatements.export', 'Export Financial Statements', 'Export approved financial statement packages', 'workspace', 'financial_statements', 'active')
ON CONFLICT DO NOTHING;

ALTER TABLE public.financial_statement_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY financial_statement_packages_select ON public.financial_statement_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY financial_statement_packages_write ON public.financial_statement_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_sections_access ON public.financial_statement_sections
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_lines_access ON public.financial_statement_lines
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_values_access ON public.financial_statement_values
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_versions_access ON public.financial_statement_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_comments_access ON public.financial_statement_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY financial_statement_activity_select ON public.financial_statement_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id));

CREATE POLICY financial_statement_activity_insert ON public.financial_statement_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id));

CREATE POLICY financial_statement_exports_access ON public.financial_statement_exports
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_financial_statement_package(financial_statement_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE TRIGGER financial_statement_packages_set_updated_at
  BEFORE UPDATE ON public.financial_statement_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER financial_statement_sections_set_updated_at
  BEFORE UPDATE ON public.financial_statement_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER financial_statement_lines_set_updated_at
  BEFORE UPDATE ON public.financial_statement_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER financial_statement_values_set_updated_at
  BEFORE UPDATE ON public.financial_statement_values
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER financial_statement_comments_set_updated_at
  BEFORE UPDATE ON public.financial_statement_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER financial_statement_exports_set_updated_at
  BEFORE UPDATE ON public.financial_statement_exports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
