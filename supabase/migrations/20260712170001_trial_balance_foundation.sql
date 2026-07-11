-- FEATURE-FS-002: Enterprise Trial Balance Engine foundation

CREATE TYPE public.trial_balance_package_status AS ENUM (
  'draft',
  'validated',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'locked',
  'archived'
);

CREATE TYPE public.trial_balance_account_type AS ENUM (
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense',
  'other_income',
  'other_expense',
  'oci',
  'unknown'
);

CREATE TYPE public.trial_balance_period_type AS ENUM (
  'opening',
  'current',
  'closing',
  'monthly',
  'quarterly',
  'yearly',
  'comparative',
  'prior_year'
);

CREATE TYPE public.trial_balance_adjustment_type AS ENUM (
  'adjustment',
  'journal_entry',
  'reclassification',
  'correction',
  'audit_entry',
  'proposed',
  'approved_entry',
  'rejected_entry'
);

CREATE TYPE public.trial_balance_adjustment_status AS ENUM (
  'draft',
  'proposed',
  'approved',
  'rejected',
  'posted',
  'reversed'
);

CREATE TYPE public.trial_balance_mapping_framework AS ENUM (
  'ifrs',
  'ias',
  'local_gaap',
  'company',
  'ai_future'
);

CREATE TYPE public.trial_balance_lead_schedule AS ENUM (
  'cash',
  'receivables',
  'inventory',
  'ppe',
  'payables',
  'loans',
  'revenue',
  'expenses',
  'equity',
  'other',
  'unmapped'
);

CREATE TYPE public.trial_balance_fs_statement AS ENUM (
  'statement_of_financial_position',
  'statement_of_profit_or_loss',
  'oci',
  'cash_flow',
  'equity',
  'notes',
  'unmapped'
);

CREATE TABLE public.trial_balance_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  import_session_id uuid REFERENCES public.uaie_import_sessions (id) ON DELETE SET NULL,
  fiscal_year integer NOT NULL,
  period_label text NOT NULL DEFAULT 'FY',
  period_type public.trial_balance_period_type NOT NULL DEFAULT 'yearly',
  functional_currency text NOT NULL DEFAULT 'AZN',
  presentation_currency text,
  package_status public.trial_balance_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  is_balanced boolean NOT NULL DEFAULT false,
  out_of_balance_amount numeric(24, 6) NOT NULL DEFAULT 0,
  account_count integer NOT NULL DEFAULT 0,
  warning_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  adjustment_count integer NOT NULL DEFAULT 0,
  mapped_count integer NOT NULL DEFAULT 0,
  unmapped_count integer NOT NULL DEFAULT 0,
  summary_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  rolled_forward_from_id uuid REFERENCES public.trial_balance_packages (id) ON DELETE SET NULL,
  submitted_at timestamptz,
  submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  returned_at timestamptz,
  returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  return_notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  locked_at timestamptz,
  locked_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT trial_balance_packages_fiscal_year_positive CHECK (fiscal_year >= 1900),
  CONSTRAINT trial_balance_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT trial_balance_packages_counts_non_negative CHECK (
    account_count >= 0 AND warning_count >= 0 AND error_count >= 0
    AND adjustment_count >= 0 AND mapped_count >= 0 AND unmapped_count >= 0
  )
);

CREATE UNIQUE INDEX trial_balance_packages_engagement_active_uidx
  ON public.trial_balance_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX trial_balance_packages_workspace_id_idx ON public.trial_balance_packages (workspace_id);
CREATE INDEX trial_balance_packages_company_id_idx ON public.trial_balance_packages (company_id);
CREATE INDEX trial_balance_packages_import_session_id_idx ON public.trial_balance_packages (import_session_id);

CREATE TABLE public.trial_balance_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  parent_line_id uuid REFERENCES public.trial_balance_lines (id) ON DELETE SET NULL,
  account_code text NOT NULL,
  account_name text NOT NULL,
  account_level integer NOT NULL DEFAULT 1,
  account_type public.trial_balance_account_type NOT NULL DEFAULT 'unknown',
  category text,
  subcategory text,
  classification_confidence numeric(5,2) NOT NULL DEFAULT 0,
  opening_debit numeric(24, 6) NOT NULL DEFAULT 0,
  opening_credit numeric(24, 6) NOT NULL DEFAULT 0,
  movement_debit numeric(24, 6) NOT NULL DEFAULT 0,
  movement_credit numeric(24, 6) NOT NULL DEFAULT 0,
  closing_debit numeric(24, 6) NOT NULL DEFAULT 0,
  closing_credit numeric(24, 6) NOT NULL DEFAULT 0,
  closing_balance numeric(24, 6) NOT NULL DEFAULT 0,
  adjusted_closing_balance numeric(24, 6) NOT NULL DEFAULT 0,
  original_currency text,
  exchange_rate numeric(18, 8) NOT NULL DEFAULT 1,
  functional_amount numeric(24, 6) NOT NULL DEFAULT 0,
  presentation_amount numeric(24, 6),
  fx_gain_loss numeric(24, 6) NOT NULL DEFAULT 0,
  lead_schedule public.trial_balance_lead_schedule NOT NULL DEFAULT 'unmapped',
  fs_statement public.trial_balance_fs_statement NOT NULL DEFAULT 'unmapped',
  is_material boolean NOT NULL DEFAULT false,
  is_mapped boolean NOT NULL DEFAULT false,
  is_adjusted boolean NOT NULL DEFAULT false,
  is_orphan boolean NOT NULL DEFAULT false,
  source_row_number integer,
  sort_order integer NOT NULL DEFAULT 0,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT trial_balance_lines_code_not_empty CHECK (char_length(trim(account_code)) > 0),
  CONSTRAINT trial_balance_lines_name_not_empty CHECK (char_length(trim(account_name)) > 0),
  CONSTRAINT trial_balance_lines_level_positive CHECK (account_level >= 1),
  CONSTRAINT trial_balance_lines_confidence_range CHECK (classification_confidence >= 0 AND classification_confidence <= 100)
);

CREATE INDEX trial_balance_lines_package_id_idx ON public.trial_balance_lines (package_id);
CREATE INDEX trial_balance_lines_account_code_idx ON public.trial_balance_lines (account_code);
CREATE INDEX trial_balance_lines_account_type_idx ON public.trial_balance_lines (account_type);
CREATE INDEX trial_balance_lines_parent_line_id_idx ON public.trial_balance_lines (parent_line_id);

CREATE TABLE public.trial_balance_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  adjustment_type public.trial_balance_adjustment_type NOT NULL DEFAULT 'adjustment',
  adjustment_status public.trial_balance_adjustment_status NOT NULL DEFAULT 'draft',
  reference_code text,
  description text NOT NULL,
  reason text,
  debit_line_id uuid REFERENCES public.trial_balance_lines (id) ON DELETE SET NULL,
  credit_line_id uuid REFERENCES public.trial_balance_lines (id) ON DELETE SET NULL,
  amount numeric(24, 6) NOT NULL DEFAULT 0,
  currency_code text,
  preserves_source boolean NOT NULL DEFAULT true,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejected_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  rejection_notes text,
  posted_at timestamptz,
  posted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT trial_balance_adjustments_description_not_empty CHECK (char_length(trim(description)) > 0)
);

CREATE INDEX trial_balance_adjustments_package_id_idx ON public.trial_balance_adjustments (package_id);

CREATE TABLE public.trial_balance_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  line_id uuid NOT NULL REFERENCES public.trial_balance_lines (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  framework public.trial_balance_mapping_framework NOT NULL DEFAULT 'ifrs',
  mapping_code text,
  mapping_label text,
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  is_manual boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT trial_balance_mappings_confidence_range CHECK (confidence >= 0 AND confidence <= 100)
);

CREATE INDEX trial_balance_mappings_package_id_idx ON public.trial_balance_mappings (package_id);
CREATE INDEX trial_balance_mappings_line_id_idx ON public.trial_balance_mappings (line_id);

CREATE TABLE public.trial_balance_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  period_type public.trial_balance_period_type NOT NULL,
  period_label text NOT NULL,
  fiscal_year integer NOT NULL,
  start_date date,
  end_date date,
  is_comparative boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT trial_balance_periods_label_not_empty CHECK (char_length(trim(period_label)) > 0)
);

CREATE INDEX trial_balance_periods_package_id_idx ON public.trial_balance_periods (package_id);

CREATE TABLE public.trial_balance_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  change_summary text NOT NULL,
  snapshot_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  diff_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT trial_balance_versions_version_positive CHECK (version_number >= 1),
  CONSTRAINT trial_balance_versions_summary_not_empty CHECK (char_length(trim(change_summary)) > 0)
);

CREATE INDEX trial_balance_versions_package_id_idx ON public.trial_balance_versions (package_id);

CREATE TABLE public.trial_balance_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX trial_balance_activity_package_id_idx ON public.trial_balance_activity (package_id);
CREATE INDEX trial_balance_activity_created_at_idx ON public.trial_balance_activity (created_at DESC);

CREATE OR REPLACE FUNCTION public.user_can_access_trial_balance_package(target_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.trial_balance_packages p
      WHERE p.id = target_package_id
        AND p.deleted_at IS NULL
        AND public.user_belongs_to_workspace(p.workspace_id)
    );
$$;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('trial_balance.read', 'Read Trial Balance', 'View trial balance packages and lines', 'workspace', 'trial_balance', 'active'),
  ('trial_balance.create', 'Create Trial Balance', 'Create trial balance from staged imports', 'workspace', 'trial_balance', 'active'),
  ('trial_balance.update', 'Update Trial Balance', 'Adjust, map, merge, and split trial balance accounts', 'workspace', 'trial_balance', 'active'),
  ('trial_balance.review', 'Review Trial Balance', 'Review and return trial balance packages', 'workspace', 'trial_balance', 'active'),
  ('trial_balance.approve', 'Approve Trial Balance', 'Approve and lock trial balance packages', 'workspace', 'trial_balance', 'active'),
  ('trial_balance.archive', 'Archive Trial Balance', 'Archive trial balance packages', 'workspace', 'trial_balance', 'active')
ON CONFLICT DO NOTHING;

ALTER TABLE public.trial_balance_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_balance_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY trial_balance_packages_access ON public.trial_balance_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_lines_access ON public.trial_balance_lines
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_adjustments_access ON public.trial_balance_adjustments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_mappings_access ON public.trial_balance_mappings
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_periods_access ON public.trial_balance_periods
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_versions_access ON public.trial_balance_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY trial_balance_activity_select ON public.trial_balance_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id));

CREATE POLICY trial_balance_activity_insert ON public.trial_balance_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_trial_balance_package(package_id));

CREATE TRIGGER trial_balance_packages_set_updated_at
  BEFORE UPDATE ON public.trial_balance_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trial_balance_lines_set_updated_at
  BEFORE UPDATE ON public.trial_balance_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trial_balance_adjustments_set_updated_at
  BEFORE UPDATE ON public.trial_balance_adjustments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trial_balance_mappings_set_updated_at
  BEFORE UPDATE ON public.trial_balance_mappings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
