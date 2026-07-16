-- ECP Sprint 1 / P4: Lead Sheet Composition foundation.
-- Summary schedules linking trial balance amounts to detailed testing
-- (PROJECT_BIBLE §13.2 Audit, Workflow 16 — Lead Sheet Generation).
-- Lead sheet totals must reconcile to the trial balance; unlinked accounts
-- are flagged; differences require documented explanation.

-- ---------------------------------------------------------------------------
-- lead_sheets
-- ---------------------------------------------------------------------------

CREATE TABLE public.lead_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  trial_balance_package_id uuid NOT NULL REFERENCES public.trial_balance_packages (id) ON DELETE RESTRICT,
  fs_area text NOT NULL,
  name text NOT NULL,
  sheet_status text NOT NULL DEFAULT 'draft',
  total_reported numeric(18, 2) NOT NULL DEFAULT 0,
  total_tested numeric(18, 2) NOT NULL DEFAULT 0,
  unreconciled_difference numeric(18, 2) NOT NULL DEFAULT 0,
  reconciliation_note text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT lead_sheets_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT lead_sheets_fs_area_not_empty CHECK (char_length(trim(fs_area)) > 0),
  CONSTRAINT lead_sheets_status_valid CHECK (
    sheet_status IN ('draft', 'in_review', 'reconciled', 'approved')
  )
);

CREATE UNIQUE INDEX lead_sheets_engagement_package_area_active_uidx
  ON public.lead_sheets (engagement_id, trial_balance_package_id, fs_area)
  WHERE deleted_at IS NULL;

CREATE INDEX lead_sheets_engagement_id_idx ON public.lead_sheets (engagement_id);
CREATE INDEX lead_sheets_workspace_id_idx ON public.lead_sheets (workspace_id);
CREATE INDEX lead_sheets_trial_balance_package_id_idx
  ON public.lead_sheets (trial_balance_package_id);
CREATE INDEX lead_sheets_sheet_status_idx ON public.lead_sheets (sheet_status);

-- ---------------------------------------------------------------------------
-- lead_sheet_lines
-- ---------------------------------------------------------------------------

CREATE TABLE public.lead_sheet_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_sheet_id uuid NOT NULL REFERENCES public.lead_sheets (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  trial_balance_line_id uuid REFERENCES public.trial_balance_lines (id) ON DELETE SET NULL,
  working_paper_id uuid REFERENCES public.working_papers (id) ON DELETE SET NULL,
  account_code text NOT NULL,
  account_name text NOT NULL,
  reported_amount numeric(18, 2) NOT NULL DEFAULT 0,
  tested_amount numeric(18, 2) NOT NULL DEFAULT 0,
  difference numeric(18, 2) NOT NULL DEFAULT 0,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT lead_sheet_lines_account_code_not_empty CHECK (char_length(trim(account_code)) > 0)
);

CREATE INDEX lead_sheet_lines_lead_sheet_id_idx ON public.lead_sheet_lines (lead_sheet_id);
CREATE INDEX lead_sheet_lines_engagement_id_idx ON public.lead_sheet_lines (engagement_id);
CREATE INDEX lead_sheet_lines_workspace_id_idx ON public.lead_sheet_lines (workspace_id);
CREATE INDEX lead_sheet_lines_trial_balance_line_id_idx
  ON public.lead_sheet_lines (trial_balance_line_id);
CREATE INDEX lead_sheet_lines_working_paper_id_idx
  ON public.lead_sheet_lines (working_paper_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_lead_sheets_set_created_by
  BEFORE INSERT ON public.lead_sheets
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_lead_sheets_set_updated_at
  BEFORE UPDATE ON public.lead_sheets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lead_sheets_set_updated_by
  BEFORE UPDATE ON public.lead_sheets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_lead_sheets_set_row_version
  BEFORE INSERT OR UPDATE ON public.lead_sheets
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_lead_sheet_lines_set_created_by
  BEFORE INSERT ON public.lead_sheet_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_lead_sheet_lines_set_updated_at
  BEFORE UPDATE ON public.lead_sheet_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lead_sheet_lines_set_updated_by
  BEFORE UPDATE ON public.lead_sheet_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_lead_sheet_lines_set_row_version
  BEFORE INSERT OR UPDATE ON public.lead_sheet_lines
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.lead_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sheet_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY lead_sheets_select_authenticated ON public.lead_sheets
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY lead_sheets_insert_authenticated ON public.lead_sheets
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY lead_sheets_update_authenticated ON public.lead_sheets
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY lead_sheets_delete_service ON public.lead_sheets
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY lead_sheet_lines_select_authenticated ON public.lead_sheet_lines
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY lead_sheet_lines_insert_authenticated ON public.lead_sheet_lines
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY lead_sheet_lines_update_authenticated ON public.lead_sheet_lines
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY lead_sheet_lines_delete_service ON public.lead_sheet_lines
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('lead_sheet.read', 'Read Lead Sheets', 'View lead sheets and reconciliation status', 'workspace', 'lead_sheet', 'active'),
  ('lead_sheet.create', 'Create Lead Sheets', 'Compose lead sheets from trial balance', 'workspace', 'lead_sheet', 'active'),
  ('lead_sheet.update', 'Update Lead Sheets', 'Update lead sheet lines and reconciliation', 'workspace', 'lead_sheet', 'active'),
  ('lead_sheet.approve', 'Approve Lead Sheets', 'Approve reconciled lead sheets', 'workspace', 'lead_sheet', 'active')
ON CONFLICT DO NOTHING;

-- Role backfill (mirrors seed role mappings; idempotent)
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'platform_owner'
  AND p.code IN ('lead_sheet.read', 'lead_sheet.create', 'lead_sheet.update', 'lead_sheet.approve')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'lead_sheet.read', 'lead_sheet.create', 'lead_sheet.update', 'lead_sheet.approve'
)
WHERE r.slug IN ('organization_owner', 'organization_admin', 'workspace_admin', 'manager')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'lead_sheet.read', 'lead_sheet.create', 'lead_sheet.update'
)
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'lead_sheet.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_sheets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_sheet_lines TO authenticated;
GRANT ALL ON public.lead_sheets TO service_role;
GRANT ALL ON public.lead_sheet_lines TO service_role;
