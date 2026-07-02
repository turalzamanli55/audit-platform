-- FEATURE-RISK-001: Risk Assessment foundation — assessments, register, matrix, responses, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.risk_assessment_status AS ENUM (
  'not_started',
  'in_progress',
  'submitted',
  'under_review',
  'approved',
  'archived'
);

CREATE TYPE public.risk_type AS ENUM (
  'inherent',
  'control',
  'detection',
  'fraud',
  'it',
  'compliance',
  'financial_statement',
  'assertion',
  'significant'
);

CREATE TYPE public.risk_rating_level AS ENUM (
  'low',
  'moderate',
  'high',
  'significant'
);

CREATE TYPE public.risk_likelihood AS ENUM (
  'low',
  'moderate',
  'high'
);

CREATE TYPE public.risk_impact AS ENUM (
  'low',
  'moderate',
  'high'
);

CREATE TYPE public.risk_response_type AS ENUM (
  'accept',
  'reduce',
  'transfer',
  'avoid',
  'substantive_procedures',
  'test_of_controls'
);

CREATE TYPE public.assertion_type AS ENUM (
  'existence',
  'completeness',
  'accuracy',
  'cutoff',
  'classification',
  'presentation'
);

CREATE TYPE public.risk_note_type AS ENUM (
  'review',
  'internal'
);

-- ---------------------------------------------------------------------------
-- risk_assessments
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  assessment_status public.risk_assessment_status NOT NULL DEFAULT 'not_started',
  assessment_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  significant_risks_acknowledged_at timestamptz,
  significant_risks_acknowledged_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
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
  CONSTRAINT risk_assessments_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT risk_assessments_assessment_version_positive CHECK (assessment_version >= 1)
);

CREATE UNIQUE INDEX risk_assessments_engagement_active_uidx
  ON public.risk_assessments (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX risk_assessments_workspace_id_idx ON public.risk_assessments (workspace_id);
CREATE INDEX risk_assessments_engagement_id_idx ON public.risk_assessments (engagement_id);
CREATE INDEX risk_assessments_audit_plan_id_idx ON public.risk_assessments (audit_plan_id);

-- ---------------------------------------------------------------------------
-- risk_categories
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT risk_categories_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX risk_categories_risk_assessment_id_idx ON public.risk_categories (risk_assessment_id);

-- ---------------------------------------------------------------------------
-- risk_register_items
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_register_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  risk_category_id uuid REFERENCES public.risk_categories (id) ON DELETE SET NULL,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  risk_type public.risk_type NOT NULL,
  title text NOT NULL,
  description text,
  audit_area text,
  account_name text,
  linked_assertion public.assertion_type,
  likelihood public.risk_likelihood,
  impact public.risk_impact,
  inherent_rating public.risk_rating_level,
  control_rating public.risk_rating_level,
  detection_rating public.risk_rating_level,
  residual_rating public.risk_rating_level,
  is_significant boolean NOT NULL DEFAULT false,
  owner_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  rationale text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT risk_register_items_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX risk_register_items_risk_assessment_id_idx ON public.risk_register_items (risk_assessment_id);
CREATE INDEX risk_register_items_risk_type_idx ON public.risk_register_items (risk_type);

-- ---------------------------------------------------------------------------
-- risk_assertion_ratings (account × assertion matrix)
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_assertion_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  account_name text NOT NULL,
  assertion public.assertion_type NOT NULL,
  inherent_rating public.risk_rating_level,
  control_rating public.risk_rating_level,
  composite_rating public.risk_rating_level,
  is_significant boolean NOT NULL DEFAULT false,
  rationale text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT risk_assertion_ratings_account_not_empty CHECK (char_length(trim(account_name)) > 0)
);

CREATE UNIQUE INDEX risk_assertion_ratings_account_assertion_uidx
  ON public.risk_assertion_ratings (risk_assessment_id, lower(account_name), assertion)
  WHERE deleted_at IS NULL;

CREATE INDEX risk_assertion_ratings_risk_assessment_id_idx ON public.risk_assertion_ratings (risk_assessment_id);

-- ---------------------------------------------------------------------------
-- risk_responses
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  risk_register_item_id uuid NOT NULL REFERENCES public.risk_register_items (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  response_type public.risk_response_type NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT risk_responses_description_not_empty CHECK (char_length(trim(description)) > 0)
);

CREATE INDEX risk_responses_risk_assessment_id_idx ON public.risk_responses (risk_assessment_id);
CREATE INDEX risk_responses_risk_register_item_id_idx ON public.risk_responses (risk_register_item_id);

-- ---------------------------------------------------------------------------
-- risk_procedure_links
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_procedure_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  risk_register_item_id uuid NOT NULL REFERENCES public.risk_register_items (id) ON DELETE RESTRICT,
  audit_procedure_id uuid REFERENCES public.audit_procedures (id) ON DELETE SET NULL,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  procedure_reference text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE INDEX risk_procedure_links_risk_assessment_id_idx ON public.risk_procedure_links (risk_assessment_id);
CREATE INDEX risk_procedure_links_risk_register_item_id_idx ON public.risk_procedure_links (risk_register_item_id);

-- ---------------------------------------------------------------------------
-- risk_notes
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  note_type public.risk_note_type NOT NULL DEFAULT 'review',
  body text NOT NULL,
  risk_register_item_id uuid REFERENCES public.risk_register_items (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT risk_notes_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX risk_notes_risk_assessment_id_idx ON public.risk_notes (risk_assessment_id);

-- ---------------------------------------------------------------------------
-- risk_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.risk_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_assessment_id uuid NOT NULL REFERENCES public.risk_assessments (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX risk_activity_risk_assessment_id_idx ON public.risk_activity (risk_assessment_id);
CREATE INDEX risk_activity_created_at_idx ON public.risk_activity (created_at DESC);

-- ---------------------------------------------------------------------------
-- Access helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_risk_assessment(target_risk_assessment_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.risk_assessments ra
      WHERE ra.id = target_risk_assessment_id
        AND ra.deleted_at IS NULL
        AND public.user_belongs_to_workspace(ra.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.risk_assessments ra
      JOIN public.engagement_members em ON em.engagement_id = ra.engagement_id
      WHERE ra.id = target_risk_assessment_id
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
  ('risk_assessment.read', 'Read Risk Assessment', 'View risk assessment workspace and register', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.create', 'Create Risk Assessment', 'Initiate risk assessment after planning approval', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.update', 'Update Risk Assessment', 'Modify risk ratings, responses, and register items', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.archive', 'Archive Risk Assessment', 'Archive risk assessment records', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.submit', 'Submit Risk Assessment', 'Submit risk assessment for review', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.review', 'Review Risk Assessment', 'Review and return risk assessment documentation', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.approve', 'Approve Risk Assessment', 'Approve risk assessment and acknowledge significant risks', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.comment', 'Comment on Risk Assessment', 'Add review and internal risk notes', 'workspace', 'risk_assessment', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_register_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assertion_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_procedure_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY risk_assessments_select ON public.risk_assessments
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY risk_assessments_write ON public.risk_assessments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_activity_select ON public.risk_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id));

CREATE POLICY risk_activity_insert ON public.risk_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id));

CREATE POLICY risk_categories_access ON public.risk_categories
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_register_items_access ON public.risk_register_items
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_assertion_ratings_access ON public.risk_assertion_ratings
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_responses_access ON public.risk_responses
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_procedure_links_access ON public.risk_procedure_links
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY risk_notes_access ON public.risk_notes
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_risk_assessment(risk_assessment_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
