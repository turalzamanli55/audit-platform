-- ECP Sprint 3: General ledger exploration + account mapping governance
-- Completes remaining schema evidence for FR domain contracts.

CREATE TABLE public.general_ledger_exploration_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  trial_balance_package_id uuid REFERENCES public.trial_balance_packages (id) ON DELETE SET NULL,
  account_code text NOT NULL,
  account_name text NOT NULL,
  opening_balance numeric(24, 6) NOT NULL DEFAULT 0,
  movement_debit numeric(24, 6) NOT NULL DEFAULT 0,
  movement_credit numeric(24, 6) NOT NULL DEFAULT 0,
  closing_balance numeric(24, 6) NOT NULL DEFAULT 0,
  source_import_session_id uuid,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT general_ledger_exploration_views_account_code_not_empty CHECK (char_length(trim(account_code)) > 0)
);

CREATE INDEX general_ledger_exploration_views_engagement_id_idx
  ON public.general_ledger_exploration_views (engagement_id);
CREATE INDEX general_ledger_exploration_views_workspace_id_idx
  ON public.general_ledger_exploration_views (workspace_id);
CREATE INDEX general_ledger_exploration_views_account_code_idx
  ON public.general_ledger_exploration_views (account_code);

CREATE TABLE public.account_mapping_governance_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  mapping_set_id uuid,
  account_code text NOT NULL,
  fs_line_code text NOT NULL,
  governance_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT account_mapping_governance_entries_codes_not_empty CHECK (
    char_length(trim(account_code)) > 0 AND char_length(trim(fs_line_code)) > 0
  ),
  CONSTRAINT account_mapping_governance_entries_status_valid CHECK (
    governance_status IN ('draft', 'validated', 'approved', 'published')
  )
);

CREATE INDEX account_mapping_governance_entries_engagement_id_idx
  ON public.account_mapping_governance_entries (engagement_id);
CREATE INDEX account_mapping_governance_entries_workspace_id_idx
  ON public.account_mapping_governance_entries (workspace_id);

-- Triggers
CREATE TRIGGER trg_general_ledger_exploration_views_set_created_by
  BEFORE INSERT ON public.general_ledger_exploration_views
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_general_ledger_exploration_views_set_updated_at
  BEFORE UPDATE ON public.general_ledger_exploration_views
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_general_ledger_exploration_views_set_updated_by
  BEFORE UPDATE ON public.general_ledger_exploration_views
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_general_ledger_exploration_views_set_row_version
  BEFORE INSERT OR UPDATE ON public.general_ledger_exploration_views
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_account_mapping_governance_entries_set_created_by
  BEFORE INSERT ON public.account_mapping_governance_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_account_mapping_governance_entries_set_updated_at
  BEFORE UPDATE ON public.account_mapping_governance_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_account_mapping_governance_entries_set_updated_by
  BEFORE UPDATE ON public.account_mapping_governance_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_account_mapping_governance_entries_set_row_version
  BEFORE INSERT OR UPDATE ON public.account_mapping_governance_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- RLS
ALTER TABLE public.general_ledger_exploration_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_mapping_governance_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY general_ledger_exploration_views_select_authenticated ON public.general_ledger_exploration_views
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_engagement(engagement_id));
CREATE POLICY general_ledger_exploration_views_write_authenticated ON public.general_ledger_exploration_views
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY account_mapping_governance_entries_select_authenticated ON public.account_mapping_governance_entries
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_engagement(engagement_id));
CREATE POLICY account_mapping_governance_entries_write_authenticated ON public.account_mapping_governance_entries
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.general_ledger_exploration_views TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.account_mapping_governance_entries TO authenticated;
GRANT ALL ON public.general_ledger_exploration_views TO service_role;
GRANT ALL ON public.account_mapping_governance_entries TO service_role;
