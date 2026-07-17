-- ECP Sprint 3: IFRS Classification / Disclosure Drafting / Note Management
-- Bridges existing IFRS notes foundation to capability aliases required by
-- mod_ifrs-classification contracts (PROJECT_BIBLE §13.1 / §13.2).
-- Reuses ifrs_note_* tables; adds classification & disclosure drafting registries.

-- ---------------------------------------------------------------------------
-- ifrs_classification_rules — account → IFRS class mapping registry
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_classification_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  standard text NOT NULL DEFAULT 'ifrs',
  account_pattern text NOT NULL,
  ifrs_class text NOT NULL,
  statement_area text NOT NULL DEFAULT 'other',
  priority integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_classification_rules_pattern_not_empty CHECK (char_length(trim(account_pattern)) > 0),
  CONSTRAINT ifrs_classification_rules_class_not_empty CHECK (char_length(trim(ifrs_class)) > 0)
);

CREATE INDEX ifrs_classification_rules_workspace_id_idx
  ON public.ifrs_classification_rules (workspace_id);
CREATE INDEX ifrs_classification_rules_standard_idx
  ON public.ifrs_classification_rules (standard);

-- ---------------------------------------------------------------------------
-- ifrs_disclosure_drafting_items — disclosure checklist drafting trail
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_disclosure_drafting_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  ifrs_note_package_id uuid REFERENCES public.ifrs_note_packages (id) ON DELETE SET NULL,
  disclosure_code text NOT NULL,
  disclosure_title text NOT NULL,
  drafting_status text NOT NULL DEFAULT 'draft',
  draft_body text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_disclosure_drafting_items_code_not_empty CHECK (char_length(trim(disclosure_code)) > 0),
  CONSTRAINT ifrs_disclosure_drafting_items_status_valid CHECK (
    drafting_status IN ('draft', 'in_review', 'approved', 'published')
  )
);

CREATE INDEX ifrs_disclosure_drafting_items_engagement_id_idx
  ON public.ifrs_disclosure_drafting_items (engagement_id);
CREATE INDEX ifrs_disclosure_drafting_items_workspace_id_idx
  ON public.ifrs_disclosure_drafting_items (workspace_id);
CREATE INDEX ifrs_disclosure_drafting_items_note_package_id_idx
  ON public.ifrs_disclosure_drafting_items (ifrs_note_package_id);

-- ---------------------------------------------------------------------------
-- ifrs_note_management_links — note package ↔ FS mapping / rendering linkage
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_management_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  ifrs_note_package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE RESTRICT,
  mapping_set_id uuid,
  presentation_id uuid,
  link_role text NOT NULL DEFAULT 'source_dataset',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_note_management_links_role_valid CHECK (
    link_role IN ('source_dataset', 'presentation', 'opinion_input', 'reporting_input')
  )
);

CREATE INDEX ifrs_note_management_links_engagement_id_idx
  ON public.ifrs_note_management_links (engagement_id);
CREATE INDEX ifrs_note_management_links_package_id_idx
  ON public.ifrs_note_management_links (ifrs_note_package_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_ifrs_classification_rules_set_created_by
  BEFORE INSERT ON public.ifrs_classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_ifrs_classification_rules_set_updated_at
  BEFORE UPDATE ON public.ifrs_classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_ifrs_classification_rules_set_updated_by
  BEFORE UPDATE ON public.ifrs_classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_ifrs_classification_rules_set_row_version
  BEFORE INSERT OR UPDATE ON public.ifrs_classification_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_ifrs_disclosure_drafting_items_set_created_by
  BEFORE INSERT ON public.ifrs_disclosure_drafting_items
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_ifrs_disclosure_drafting_items_set_updated_at
  BEFORE UPDATE ON public.ifrs_disclosure_drafting_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_ifrs_disclosure_drafting_items_set_updated_by
  BEFORE UPDATE ON public.ifrs_disclosure_drafting_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_ifrs_disclosure_drafting_items_set_row_version
  BEFORE INSERT OR UPDATE ON public.ifrs_disclosure_drafting_items
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_ifrs_note_management_links_set_created_by
  BEFORE INSERT ON public.ifrs_note_management_links
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_ifrs_note_management_links_set_updated_at
  BEFORE UPDATE ON public.ifrs_note_management_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_ifrs_note_management_links_set_updated_by
  BEFORE UPDATE ON public.ifrs_note_management_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_ifrs_note_management_links_set_row_version
  BEFORE INSERT OR UPDATE ON public.ifrs_note_management_links
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.ifrs_classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_disclosure_drafting_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_management_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY ifrs_classification_rules_select_authenticated ON public.ifrs_classification_rules
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_classification_rules_insert_authenticated ON public.ifrs_classification_rules
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_classification_rules_update_authenticated ON public.ifrs_classification_rules
  FOR UPDATE TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_classification_rules_delete_service ON public.ifrs_classification_rules
  FOR DELETE TO authenticated USING (public.is_service_role());

CREATE POLICY ifrs_disclosure_drafting_items_select_authenticated ON public.ifrs_disclosure_drafting_items
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_engagement(engagement_id));
CREATE POLICY ifrs_disclosure_drafting_items_insert_authenticated ON public.ifrs_disclosure_drafting_items
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_disclosure_drafting_items_update_authenticated ON public.ifrs_disclosure_drafting_items
  FOR UPDATE TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_disclosure_drafting_items_delete_service ON public.ifrs_disclosure_drafting_items
  FOR DELETE TO authenticated USING (public.is_service_role());

CREATE POLICY ifrs_note_management_links_select_authenticated ON public.ifrs_note_management_links
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_engagement(engagement_id));
CREATE POLICY ifrs_note_management_links_insert_authenticated ON public.ifrs_note_management_links
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_note_management_links_update_authenticated ON public.ifrs_note_management_links
  FOR UPDATE TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));
CREATE POLICY ifrs_note_management_links_delete_service ON public.ifrs_note_management_links
  FOR DELETE TO authenticated USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_classification_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_disclosure_drafting_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_management_links TO authenticated;
GRANT ALL ON public.ifrs_classification_rules TO service_role;
GRANT ALL ON public.ifrs_disclosure_drafting_items TO service_role;
GRANT ALL ON public.ifrs_note_management_links TO service_role;
