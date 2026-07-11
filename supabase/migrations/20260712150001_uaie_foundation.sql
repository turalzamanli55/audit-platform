-- FEATURE-UAIE-001: Universal Accounting Import Engine foundation

CREATE TYPE public.uaie_import_status AS ENUM (
  'uploaded',
  'scanning',
  'mapping_required',
  'mapped',
  'validating',
  'validated',
  'staged',
  'failed',
  'cancelled',
  'superseded',
  'archived'
);

CREATE TYPE public.uaie_data_type AS ENUM (
  'trial_balance',
  'general_ledger',
  'chart_of_accounts',
  'supporting_schedule',
  'unknown'
);

CREATE TYPE public.uaie_erp_system AS ENUM (
  'sap',
  'sap_business_one',
  'oracle',
  'oracle_netsuite',
  'microsoft_dynamics',
  'dynamics_365',
  '1c',
  'logo',
  'netsis',
  'mikro',
  'quickbooks',
  'xero',
  'sage',
  'zoho_books',
  'odoo',
  'manual_excel',
  'unknown'
);

CREATE TYPE public.uaie_issue_severity AS ENUM (
  'info',
  'warning',
  'error',
  'blocking'
);

CREATE TYPE public.uaie_canonical_field AS ENUM (
  'account_code',
  'account_name',
  'debit',
  'credit',
  'balance',
  'currency',
  'department',
  'cost_center',
  'ignore'
);

CREATE TABLE public.uaie_import_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid REFERENCES public.engagements (id) ON DELETE SET NULL,
  data_type public.uaie_data_type NOT NULL DEFAULT 'trial_balance',
  import_status public.uaie_import_status NOT NULL DEFAULT 'uploaded',
  source_filename text NOT NULL,
  source_mime_type text,
  source_byte_size bigint,
  source_storage_path text,
  source_sha256 text,
  detected_erp public.uaie_erp_system NOT NULL DEFAULT 'unknown',
  erp_confidence numeric(5,2) NOT NULL DEFAULT 0,
  detected_language text,
  language_confidence numeric(5,2) NOT NULL DEFAULT 0,
  detected_currency text,
  currency_confidence numeric(5,2) NOT NULL DEFAULT 0,
  selected_sheet_name text,
  sheet_confidence numeric(5,2) NOT NULL DEFAULT 0,
  overall_confidence numeric(5,2) NOT NULL DEFAULT 0,
  workbook_hash text,
  header_hash text,
  layout_fingerprint text,
  mapping_profile_id uuid,
  mapping_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  detection_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  processing_ms integer,
  error_message text,
  version_number integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT public.utc_now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT uaie_import_sessions_filename_not_empty CHECK (char_length(trim(source_filename)) > 0),
  CONSTRAINT uaie_import_sessions_confidence_range CHECK (
    erp_confidence >= 0 AND erp_confidence <= 100
    AND language_confidence >= 0 AND language_confidence <= 100
    AND currency_confidence >= 0 AND currency_confidence <= 100
    AND sheet_confidence >= 0 AND sheet_confidence <= 100
    AND overall_confidence >= 0 AND overall_confidence <= 100
  ),
  CONSTRAINT uaie_import_sessions_version_positive CHECK (version_number >= 1)
);

CREATE INDEX uaie_import_sessions_workspace_id_idx ON public.uaie_import_sessions (workspace_id);
CREATE INDEX uaie_import_sessions_company_id_idx ON public.uaie_import_sessions (company_id);
CREATE INDEX uaie_import_sessions_status_idx ON public.uaie_import_sessions (import_status);
CREATE INDEX uaie_import_sessions_created_at_idx ON public.uaie_import_sessions (created_at DESC);

CREATE TABLE public.uaie_sheet_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_session_id uuid NOT NULL REFERENCES public.uaie_import_sessions (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  sheet_name text NOT NULL,
  sheet_index integer NOT NULL DEFAULT 0,
  row_count integer NOT NULL DEFAULT 0,
  column_count integer NOT NULL DEFAULT 0,
  score numeric(5,2) NOT NULL DEFAULT 0,
  is_selected boolean NOT NULL DEFAULT false,
  preview_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  headers_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT uaie_sheet_scans_score_range CHECK (score >= 0 AND score <= 100)
);

CREATE INDEX uaie_sheet_scans_session_id_idx ON public.uaie_sheet_scans (import_session_id);

CREATE TABLE public.uaie_column_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_session_id uuid NOT NULL REFERENCES public.uaie_import_sessions (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  source_column_index integer NOT NULL,
  source_header text,
  canonical_field public.uaie_canonical_field NOT NULL DEFAULT 'ignore',
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  is_manual boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT uaie_column_mappings_confidence_range CHECK (confidence >= 0 AND confidence <= 100)
);

CREATE INDEX uaie_column_mappings_session_id_idx ON public.uaie_column_mappings (import_session_id);

CREATE TABLE public.uaie_mapping_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  profile_name text NOT NULL,
  detected_erp public.uaie_erp_system NOT NULL DEFAULT 'unknown',
  workbook_hash text,
  header_hash text,
  layout_fingerprint text,
  mapping_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  success_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT uaie_mapping_profiles_name_not_empty CHECK (char_length(trim(profile_name)) > 0)
);

CREATE INDEX uaie_mapping_profiles_workspace_id_idx ON public.uaie_mapping_profiles (workspace_id);
CREATE INDEX uaie_mapping_profiles_fingerprint_idx ON public.uaie_mapping_profiles (layout_fingerprint);
CREATE INDEX uaie_mapping_profiles_header_hash_idx ON public.uaie_mapping_profiles (header_hash);

ALTER TABLE public.uaie_import_sessions
  ADD CONSTRAINT uaie_import_sessions_mapping_profile_id_fkey
  FOREIGN KEY (mapping_profile_id) REFERENCES public.uaie_mapping_profiles (id) ON DELETE SET NULL;

CREATE TABLE public.uaie_validation_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_session_id uuid NOT NULL REFERENCES public.uaie_import_sessions (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  issue_code text NOT NULL,
  severity public.uaie_issue_severity NOT NULL DEFAULT 'warning',
  message text NOT NULL,
  row_number integer,
  column_index integer,
  account_code text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT uaie_validation_issues_message_not_empty CHECK (char_length(trim(message)) > 0)
);

CREATE INDEX uaie_validation_issues_session_id_idx ON public.uaie_validation_issues (import_session_id);

CREATE TABLE public.uaie_normalized_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_session_id uuid NOT NULL REFERENCES public.uaie_import_sessions (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  row_number integer NOT NULL,
  account_code text,
  account_name text,
  debit numeric(24, 6),
  credit numeric(24, 6),
  balance numeric(24, 6),
  currency_code text,
  department text,
  cost_center text,
  source_ref text,
  is_valid boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT public.utc_now()
);

CREATE INDEX uaie_normalized_rows_session_id_idx ON public.uaie_normalized_rows (import_session_id);
CREATE INDEX uaie_normalized_rows_account_code_idx ON public.uaie_normalized_rows (account_code);

CREATE TABLE public.uaie_import_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_session_id uuid NOT NULL REFERENCES public.uaie_import_sessions (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX uaie_import_activity_session_id_idx ON public.uaie_import_activity (import_session_id);
CREATE INDEX uaie_import_activity_created_at_idx ON public.uaie_import_activity (created_at DESC);

CREATE OR REPLACE FUNCTION public.user_can_access_uaie_session(target_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.uaie_import_sessions s
      WHERE s.id = target_session_id
        AND s.deleted_at IS NULL
        AND public.user_belongs_to_workspace(s.workspace_id)
    );
$$;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('uaie.read', 'Read Accounting Imports', 'View Universal Accounting Import Engine sessions and history', 'workspace', 'uaie', 'active'),
  ('uaie.create', 'Create Accounting Imports', 'Upload and start accounting import sessions', 'workspace', 'uaie', 'active'),
  ('uaie.update', 'Update Accounting Imports', 'Adjust mappings and reprocess import sessions', 'workspace', 'uaie', 'active'),
  ('uaie.validate', 'Validate Accounting Imports', 'Run validation and stage normalized datasets', 'workspace', 'uaie', 'active'),
  ('uaie.archive', 'Archive Accounting Imports', 'Archive or cancel import sessions', 'workspace', 'uaie', 'active'),
  ('uaie.learn', 'Manage Import Learning', 'Save and reuse ERP mapping fingerprints', 'workspace', 'uaie', 'active')
ON CONFLICT DO NOTHING;

ALTER TABLE public.uaie_import_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_sheet_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_column_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_mapping_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_validation_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_normalized_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_import_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY uaie_import_sessions_access ON public.uaie_import_sessions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_sheet_scans_access ON public.uaie_sheet_scans
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_column_mappings_access ON public.uaie_column_mappings
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_mapping_profiles_access ON public.uaie_mapping_profiles
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_validation_issues_access ON public.uaie_validation_issues
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_normalized_rows_access ON public.uaie_normalized_rows
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_import_activity_select ON public.uaie_import_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id));

CREATE POLICY uaie_import_activity_insert ON public.uaie_import_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_uaie_session(import_session_id));

CREATE TRIGGER uaie_import_sessions_set_updated_at
  BEFORE UPDATE ON public.uaie_import_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER uaie_column_mappings_set_updated_at
  BEFORE UPDATE ON public.uaie_column_mappings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER uaie_mapping_profiles_set_updated_at
  BEFORE UPDATE ON public.uaie_mapping_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
