-- FEATURE-FSME-001: Financial Statement Mapping Engine foundation
-- Maps Approved Trial Balance → Financial Statement Structure (mapping layer only).
-- Does NOT generate financial statements, IFRS notes, PDFs, or AI output.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.fs_mapping_set_status AS ENUM (
  'draft',
  'validated',
  'approved',
  'published',
  'archived'
);

CREATE TYPE public.fs_mapping_version_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE public.fs_mapping_standard AS ENUM (
  'ifrs',
  'sme_ifrs',
  'local_gaap',
  'custom'
);

CREATE TYPE public.fs_account_classification AS ENUM (
  'assets',
  'current_assets',
  'non_current_assets',
  'liabilities',
  'current_liabilities',
  'non_current_liabilities',
  'equity',
  'revenue',
  'cost_of_sales',
  'operating_expenses',
  'finance_costs',
  'tax',
  'oci',
  'cash_flow',
  'unclassified'
);

CREATE TYPE public.fs_mapping_rule_type AS ENUM (
  'one_to_one',
  'many_to_one',
  'one_to_many',
  'formula',
  'calculated',
  'conditional'
);

CREATE TYPE public.fs_aggregation_method AS ENUM (
  'sum',
  'subtract',
  'average',
  'ratio',
  'running_total',
  'weighted',
  'formula'
);

CREATE TYPE public.fs_statement_section AS ENUM (
  'statement_of_financial_position',
  'statement_of_profit_or_loss',
  'statement_of_comprehensive_income',
  'statement_of_changes_in_equity',
  'statement_of_cash_flows',
  'other'
);

CREATE TYPE public.fs_comparative_period AS ENUM (
  'current_year',
  'previous_year',
  'multi_year'
);

CREATE TYPE public.fs_mapping_history_action AS ENUM (
  'created',
  'updated',
  'validated',
  'approved',
  'published',
  'archived',
  'rolled_back',
  'rule_added',
  'rule_updated',
  'rule_removed',
  'line_mapped',
  'line_unmapped',
  'classified',
  'aggregated',
  'dataset_built'
);

-- ---------------------------------------------------------------------------
-- financial_statement_mapping_sets
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_mapping_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  trial_balance_package_id uuid REFERENCES public.trial_balance_packages (id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  standard public.fs_mapping_standard NOT NULL DEFAULT 'ifrs',
  set_status public.fs_mapping_set_status NOT NULL DEFAULT 'draft',
  set_version integer NOT NULL DEFAULT 1,
  comparative_mode public.fs_comparative_period NOT NULL DEFAULT 'current_year',
  coverage_pct numeric(5, 2) NOT NULL DEFAULT 0,
  mapped_account_count integer NOT NULL DEFAULT 0,
  unmapped_account_count integer NOT NULL DEFAULT 0,
  validation_error_count integer NOT NULL DEFAULT 0,
  validation_warning_count integer NOT NULL DEFAULT 0,
  version_count integer NOT NULL DEFAULT 0,
  summary_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  dataset_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validated_at timestamptz,
  validated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  published_at timestamptz,
  published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  archived_at timestamptz,
  archived_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_mapping_sets_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT financial_statement_mapping_sets_set_version_positive CHECK (set_version >= 1),
  CONSTRAINT financial_statement_mapping_sets_coverage_range CHECK (coverage_pct >= 0 AND coverage_pct <= 100),
  CONSTRAINT financial_statement_mapping_sets_counts_non_negative CHECK (
    mapped_account_count >= 0
    AND unmapped_account_count >= 0
    AND validation_error_count >= 0
    AND validation_warning_count >= 0
    AND version_count >= 0
  )
);

CREATE UNIQUE INDEX financial_statement_mapping_sets_engagement_active_uidx
  ON public.financial_statement_mapping_sets (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_mapping_sets_workspace_id_idx
  ON public.financial_statement_mapping_sets (workspace_id);
CREATE INDEX financial_statement_mapping_sets_company_id_idx
  ON public.financial_statement_mapping_sets (company_id);
CREATE INDEX financial_statement_mapping_sets_tb_package_id_idx
  ON public.financial_statement_mapping_sets (trial_balance_package_id);
CREATE INDEX financial_statement_mapping_sets_status_idx
  ON public.financial_statement_mapping_sets (set_status);

-- ---------------------------------------------------------------------------
-- financial_statement_mapping_rules
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_mapping_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_set_id uuid NOT NULL REFERENCES public.financial_statement_mapping_sets (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  rule_code text NOT NULL,
  rule_name text NOT NULL,
  rule_type public.fs_mapping_rule_type NOT NULL DEFAULT 'one_to_one',
  source_account_codes text[] NOT NULL DEFAULT '{}'::text[],
  target_line_code text NOT NULL,
  target_section public.fs_statement_section NOT NULL DEFAULT 'statement_of_financial_position',
  classification public.fs_account_classification NOT NULL DEFAULT 'unclassified',
  aggregation_method public.fs_aggregation_method NOT NULL DEFAULT 'sum',
  formula_expression text,
  condition_expression text,
  weight numeric(18, 6),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  allows_negative boolean NOT NULL DEFAULT true,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_mapping_rules_code_not_empty CHECK (char_length(trim(rule_code)) > 0),
  CONSTRAINT financial_statement_mapping_rules_name_not_empty CHECK (char_length(trim(rule_name)) > 0),
  CONSTRAINT financial_statement_mapping_rules_target_not_empty CHECK (char_length(trim(target_line_code)) > 0)
);

CREATE UNIQUE INDEX financial_statement_mapping_rules_set_code_active_uidx
  ON public.financial_statement_mapping_rules (mapping_set_id, rule_code)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_mapping_rules_set_id_idx
  ON public.financial_statement_mapping_rules (mapping_set_id);
CREATE INDEX financial_statement_mapping_rules_target_line_idx
  ON public.financial_statement_mapping_rules (target_line_code);
CREATE INDEX financial_statement_mapping_rules_section_idx
  ON public.financial_statement_mapping_rules (target_section);

-- ---------------------------------------------------------------------------
-- financial_statement_mapping_lines
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_mapping_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_set_id uuid NOT NULL REFERENCES public.financial_statement_mapping_sets (id) ON DELETE CASCADE,
  mapping_rule_id uuid REFERENCES public.financial_statement_mapping_rules (id) ON DELETE SET NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  trial_balance_line_id uuid REFERENCES public.trial_balance_lines (id) ON DELETE SET NULL,
  account_code text NOT NULL,
  account_name text NOT NULL,
  classification public.fs_account_classification NOT NULL DEFAULT 'unclassified',
  classification_confidence numeric(5, 2) NOT NULL DEFAULT 0,
  statement_section public.fs_statement_section NOT NULL DEFAULT 'other',
  target_line_code text,
  target_line_label text,
  parent_line_code text,
  hierarchy_level integer NOT NULL DEFAULT 1,
  aggregation_method public.fs_aggregation_method NOT NULL DEFAULT 'sum',
  current_year_amount numeric(18, 2) NOT NULL DEFAULT 0,
  previous_year_amount numeric(18, 2),
  multi_year_amounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_mapped boolean NOT NULL DEFAULT false,
  is_orphan boolean NOT NULL DEFAULT false,
  is_calculated boolean NOT NULL DEFAULT false,
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
  CONSTRAINT financial_statement_mapping_lines_account_code_not_empty CHECK (char_length(trim(account_code)) > 0),
  CONSTRAINT financial_statement_mapping_lines_account_name_not_empty CHECK (char_length(trim(account_name)) > 0),
  CONSTRAINT financial_statement_mapping_lines_level_positive CHECK (hierarchy_level >= 1),
  CONSTRAINT financial_statement_mapping_lines_confidence_range CHECK (
    classification_confidence >= 0 AND classification_confidence <= 100
  )
);

CREATE UNIQUE INDEX financial_statement_mapping_lines_set_account_active_uidx
  ON public.financial_statement_mapping_lines (mapping_set_id, account_code)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_mapping_lines_set_id_idx
  ON public.financial_statement_mapping_lines (mapping_set_id);
CREATE INDEX financial_statement_mapping_lines_rule_id_idx
  ON public.financial_statement_mapping_lines (mapping_rule_id);
CREATE INDEX financial_statement_mapping_lines_classification_idx
  ON public.financial_statement_mapping_lines (classification);
CREATE INDEX financial_statement_mapping_lines_mapped_idx
  ON public.financial_statement_mapping_lines (mapping_set_id, is_mapped);

-- ---------------------------------------------------------------------------
-- financial_statement_mapping_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_mapping_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_set_id uuid NOT NULL REFERENCES public.financial_statement_mapping_sets (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  version_status public.fs_mapping_version_status NOT NULL DEFAULT 'draft',
  change_summary text,
  snapshot_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  rolled_back_from_version integer,
  published_at timestamptz,
  published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  archived_at timestamptz,
  archived_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT financial_statement_mapping_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX financial_statement_mapping_versions_set_version_uidx
  ON public.financial_statement_mapping_versions (mapping_set_id, version_number);

CREATE INDEX financial_statement_mapping_versions_set_id_idx
  ON public.financial_statement_mapping_versions (mapping_set_id);
CREATE INDEX financial_statement_mapping_versions_status_idx
  ON public.financial_statement_mapping_versions (version_status);

-- ---------------------------------------------------------------------------
-- financial_statement_mapping_history
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_mapping_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_set_id uuid NOT NULL REFERENCES public.financial_statement_mapping_sets (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  action public.fs_mapping_history_action NOT NULL,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  entity_type text,
  entity_id uuid,
  summary text NOT NULL,
  details_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT financial_statement_mapping_history_summary_not_empty CHECK (char_length(trim(summary)) > 0)
);

CREATE INDEX financial_statement_mapping_history_set_id_idx
  ON public.financial_statement_mapping_history (mapping_set_id);
CREATE INDEX financial_statement_mapping_history_created_at_idx
  ON public.financial_statement_mapping_history (created_at DESC);
CREATE INDEX financial_statement_mapping_history_action_idx
  ON public.financial_statement_mapping_history (action);

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, module, status)
VALUES
  ('fs_mapping.read', 'Read FS Mapping', 'View financial statement mapping sets', 'fs_mapping', 'active'),
  ('fs_mapping.create', 'Create FS Mapping', 'Create financial statement mapping sets', 'fs_mapping', 'active'),
  ('fs_mapping.update', 'Update FS Mapping', 'Update mapping rules and lines', 'fs_mapping', 'active'),
  ('fs_mapping.validate', 'Validate FS Mapping', 'Run mapping validation', 'fs_mapping', 'active'),
  ('fs_mapping.approve', 'Approve FS Mapping', 'Approve mapping sets', 'fs_mapping', 'active'),
  ('fs_mapping.publish', 'Publish FS Mapping', 'Publish mapping versions', 'fs_mapping', 'active'),
  ('fs_mapping.archive', 'Archive FS Mapping', 'Archive mapping sets', 'fs_mapping', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.financial_statement_mapping_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_mapping_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_mapping_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_mapping_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_mapping_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY financial_statement_mapping_sets_select ON public.financial_statement_mapping_sets
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);

CREATE POLICY financial_statement_mapping_sets_insert ON public.financial_statement_mapping_sets
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_sets_update ON public.financial_statement_mapping_sets
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_rules_select ON public.financial_statement_mapping_rules
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);

CREATE POLICY financial_statement_mapping_rules_insert ON public.financial_statement_mapping_rules
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_rules_update ON public.financial_statement_mapping_rules
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_lines_select ON public.financial_statement_mapping_lines
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);

CREATE POLICY financial_statement_mapping_lines_insert ON public.financial_statement_mapping_lines
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_lines_update ON public.financial_statement_mapping_lines
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_versions_select ON public.financial_statement_mapping_versions
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_versions_insert ON public.financial_statement_mapping_versions
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_versions_update ON public.financial_statement_mapping_versions
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id))
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_history_select ON public.financial_statement_mapping_history
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_mapping_history_insert ON public.financial_statement_mapping_history
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_mapping_sets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_mapping_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_mapping_lines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_mapping_versions TO authenticated;
GRANT SELECT, INSERT ON public.financial_statement_mapping_history TO authenticated;

GRANT ALL ON public.financial_statement_mapping_sets TO service_role;
GRANT ALL ON public.financial_statement_mapping_rules TO service_role;
GRANT ALL ON public.financial_statement_mapping_lines TO service_role;
GRANT ALL ON public.financial_statement_mapping_versions TO service_role;
GRANT ALL ON public.financial_statement_mapping_history TO service_role;
