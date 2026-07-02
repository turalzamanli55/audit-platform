-- FEATURE-FIELDWORK-001: Fieldwork foundation — packages, programs, procedures, evidence, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.fieldwork_package_status AS ENUM (
  'not_started',
  'in_progress',
  'substantially_complete',
  'archived'
);

CREATE TYPE public.audit_program_status AS ENUM (
  'draft',
  'approved',
  'in_execution',
  'substantially_complete',
  'superseded'
);

CREATE TYPE public.procedure_type AS ENUM (
  'test_of_controls',
  'substantive',
  'analytical',
  'sampling',
  'inquiry',
  'observation',
  'inspection',
  'reperformance'
);

CREATE TYPE public.procedure_status AS ENUM (
  'not_started',
  'in_progress',
  'pending_evidence',
  'submitted_for_review',
  'review_in_progress',
  'returned',
  'review_cleared',
  'complete',
  'blocked',
  'deferred'
);

CREATE TYPE public.working_paper_status AS ENUM (
  'draft',
  'in_progress',
  'submitted',
  'under_review',
  'returned',
  'cleared',
  'complete',
  'archived'
);

CREATE TYPE public.fieldwork_evidence_status AS ENUM (
  'pending',
  'recorded',
  'verified',
  'archived'
);

CREATE TYPE public.fieldwork_finding_status AS ENUM (
  'open',
  'in_review',
  'resolved',
  'closed'
);

CREATE TYPE public.fieldwork_note_type AS ENUM (
  'auditor',
  'review',
  'internal'
);

-- ---------------------------------------------------------------------------
-- fieldwork_packages
-- ---------------------------------------------------------------------------

CREATE TABLE public.fieldwork_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  package_status public.fieldwork_package_status NOT NULL DEFAULT 'not_started',
  program_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT fieldwork_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT fieldwork_packages_program_version_positive CHECK (program_version >= 1)
);

CREATE UNIQUE INDEX fieldwork_packages_engagement_active_uidx
  ON public.fieldwork_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX fieldwork_packages_workspace_id_idx ON public.fieldwork_packages (workspace_id);
CREATE INDEX fieldwork_packages_engagement_id_idx ON public.fieldwork_packages (engagement_id);
CREATE INDEX fieldwork_packages_audit_plan_id_idx ON public.fieldwork_packages (audit_plan_id);

-- ---------------------------------------------------------------------------
-- audit_programs
-- ---------------------------------------------------------------------------

CREATE TABLE public.audit_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  program_status public.audit_program_status NOT NULL DEFAULT 'draft',
  program_version integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT audit_programs_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX audit_programs_fieldwork_package_id_idx ON public.audit_programs (fieldwork_package_id);
CREATE INDEX audit_programs_engagement_id_idx ON public.audit_programs (engagement_id);

-- ---------------------------------------------------------------------------
-- procedure_groups
-- ---------------------------------------------------------------------------

CREATE TABLE public.procedure_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_program_id uuid NOT NULL REFERENCES public.audit_programs (id) ON DELETE RESTRICT,
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  progress_pct integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT procedure_groups_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT procedure_groups_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100)
);

CREATE INDEX procedure_groups_audit_program_id_idx ON public.procedure_groups (audit_program_id);
CREATE INDEX procedure_groups_fieldwork_package_id_idx ON public.procedure_groups (fieldwork_package_id);

-- ---------------------------------------------------------------------------
-- audit_procedures
-- ---------------------------------------------------------------------------

CREATE TABLE public.audit_procedures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_group_id uuid NOT NULL REFERENCES public.procedure_groups (id) ON DELETE RESTRICT,
  audit_program_id uuid NOT NULL REFERENCES public.audit_programs (id) ON DELETE RESTRICT,
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  procedure_type public.procedure_type NOT NULL DEFAULT 'substantive',
  assertion text,
  procedure_status public.procedure_status NOT NULL DEFAULT 'not_started',
  assigned_auditor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  due_date date,
  completion_pct integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT audit_procedures_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT audit_procedures_completion_pct_range CHECK (completion_pct >= 0 AND completion_pct <= 100)
);

CREATE INDEX audit_procedures_procedure_group_id_idx ON public.audit_procedures (procedure_group_id);
CREATE INDEX audit_procedures_fieldwork_package_id_idx ON public.audit_procedures (fieldwork_package_id);
CREATE INDEX audit_procedures_assigned_auditor_id_idx ON public.audit_procedures (assigned_auditor_id);
CREATE INDEX audit_procedures_procedure_status_idx ON public.audit_procedures (procedure_status);

-- ---------------------------------------------------------------------------
-- working_papers
-- ---------------------------------------------------------------------------

CREATE TABLE public.working_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_procedure_id uuid NOT NULL REFERENCES public.audit_procedures (id) ON DELETE RESTRICT,
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  title text NOT NULL,
  reference_code text,
  paper_status public.working_paper_status NOT NULL DEFAULT 'draft',
  content_notes text,
  tickmarks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT working_papers_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX working_papers_audit_procedure_id_idx ON public.working_papers (audit_procedure_id);
CREATE INDEX working_papers_fieldwork_package_id_idx ON public.working_papers (fieldwork_package_id);

-- ---------------------------------------------------------------------------
-- fieldwork_evidence
-- ---------------------------------------------------------------------------

CREATE TABLE public.fieldwork_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  audit_procedure_id uuid REFERENCES public.audit_procedures (id) ON DELETE SET NULL,
  working_paper_id uuid REFERENCES public.working_papers (id) ON DELETE SET NULL,
  name text NOT NULL,
  document_type text NOT NULL DEFAULT 'supporting_document',
  evidence_status public.fieldwork_evidence_status NOT NULL DEFAULT 'pending',
  mime_type text,
  file_size bigint,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT fieldwork_evidence_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX fieldwork_evidence_fieldwork_package_id_idx ON public.fieldwork_evidence (fieldwork_package_id);
CREATE INDEX fieldwork_evidence_working_paper_id_idx ON public.fieldwork_evidence (working_paper_id);

-- ---------------------------------------------------------------------------
-- fieldwork_findings
-- ---------------------------------------------------------------------------

CREATE TABLE public.fieldwork_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  audit_procedure_id uuid REFERENCES public.audit_procedures (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'informational',
  finding_status public.fieldwork_finding_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT fieldwork_findings_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX fieldwork_findings_fieldwork_package_id_idx ON public.fieldwork_findings (fieldwork_package_id);

-- ---------------------------------------------------------------------------
-- fieldwork_notes
-- ---------------------------------------------------------------------------

CREATE TABLE public.fieldwork_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  audit_procedure_id uuid REFERENCES public.audit_procedures (id) ON DELETE SET NULL,
  working_paper_id uuid REFERENCES public.working_papers (id) ON DELETE SET NULL,
  note_type public.fieldwork_note_type NOT NULL DEFAULT 'auditor',
  body text NOT NULL,
  author_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT fieldwork_notes_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX fieldwork_notes_fieldwork_package_id_idx ON public.fieldwork_notes (fieldwork_package_id);
CREATE INDEX fieldwork_notes_note_type_idx ON public.fieldwork_notes (note_type);

-- ---------------------------------------------------------------------------
-- fieldwork_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.fieldwork_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fieldwork_package_id uuid NOT NULL REFERENCES public.fieldwork_packages (id) ON DELETE RESTRICT,
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
  CONSTRAINT fieldwork_activity_action_not_empty CHECK (char_length(trim(action)) > 0)
);

CREATE INDEX fieldwork_activity_fieldwork_package_id_idx ON public.fieldwork_activity (fieldwork_package_id);
CREATE INDEX fieldwork_activity_created_at_idx ON public.fieldwork_activity (created_at DESC);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_fieldwork_packages_set_created_by
  BEFORE INSERT ON public.fieldwork_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_fieldwork_packages_set_updated_at
  BEFORE UPDATE ON public.fieldwork_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fieldwork_packages_set_updated_by
  BEFORE UPDATE ON public.fieldwork_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_fieldwork_packages_set_row_version
  BEFORE INSERT OR UPDATE ON public.fieldwork_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_fieldwork_activity_set_created_by
  BEFORE INSERT ON public.fieldwork_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_fieldwork_activity_set_updated_at
  BEFORE UPDATE ON public.fieldwork_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fieldwork_activity_set_updated_by
  BEFORE UPDATE ON public.fieldwork_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_fieldwork_activity_set_row_version
  BEFORE INSERT OR UPDATE ON public.fieldwork_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_fieldwork_package(target_fieldwork_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.fieldwork_packages fp
      WHERE fp.id = target_fieldwork_package_id
        AND fp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(fp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.fieldwork_packages fp
      JOIN public.engagement_members em ON em.engagement_id = fp.engagement_id
      WHERE fp.id = target_fieldwork_package_id
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
  ('fieldwork.read', 'Read Fieldwork', 'View fieldwork workspace, procedures, and working papers', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.create', 'Create Fieldwork', 'Initiate fieldwork for an approved engagement plan', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.update', 'Update Fieldwork', 'Modify fieldwork procedures and working papers', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.archive', 'Archive Fieldwork', 'Archive fieldwork records', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.assign', 'Assign Fieldwork', 'Assign audit procedures to auditors', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.review', 'Review Fieldwork', 'Review and return fieldwork documentation', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.comment', 'Comment on Fieldwork', 'Add auditor, review, and internal fieldwork notes', 'workspace', 'fieldwork', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.fieldwork_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fieldwork_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fieldwork_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fieldwork_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fieldwork_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY fieldwork_packages_select_authenticated ON public.fieldwork_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY fieldwork_packages_insert_authenticated ON public.fieldwork_packages
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY fieldwork_packages_update_authenticated ON public.fieldwork_packages
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY fieldwork_packages_delete_service ON public.fieldwork_packages
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY fieldwork_activity_select_authenticated ON public.fieldwork_activity
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_fieldwork_package(fieldwork_package_id)
  );

CREATE POLICY fieldwork_activity_insert_authenticated ON public.fieldwork_activity
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_can_access_fieldwork_package(fieldwork_package_id)
  );

CREATE POLICY fieldwork_child_select ON public.audit_programs
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY fieldwork_child_insert ON public.audit_programs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY fieldwork_child_update ON public.audit_programs
  FOR UPDATE TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY procedure_groups_select ON public.procedure_groups
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY procedure_groups_write ON public.procedure_groups
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY audit_procedures_select ON public.audit_procedures
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY audit_procedures_write ON public.audit_procedures
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY working_papers_select ON public.working_papers
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY working_papers_write ON public.working_papers
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY fieldwork_evidence_select ON public.fieldwork_evidence
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY fieldwork_evidence_write ON public.fieldwork_evidence
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY fieldwork_findings_select ON public.fieldwork_findings
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY fieldwork_findings_write ON public.fieldwork_findings
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY fieldwork_notes_select ON public.fieldwork_notes
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_fieldwork_package(fieldwork_package_id));

CREATE POLICY fieldwork_notes_write ON public.fieldwork_notes
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
