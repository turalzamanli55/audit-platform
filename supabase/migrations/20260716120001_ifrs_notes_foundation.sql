-- FEATURE-IFRSNE-001: Enterprise IFRS Notes Engine foundation
-- Structured, editable, versioned IFRS notes from Normalized Financial Statement Dataset.
-- Does NOT generate PDFs, Word, XBRL, AI explanations, or audit opinions.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.ifrs_note_package_status AS ENUM (
  'draft',
  'validated',
  'in_review',
  'manager_review',
  'partner_review',
  'approved',
  'published',
  'archived'
);

CREATE TYPE public.ifrs_note_version_status AS ENUM (
  'draft',
  'in_review',
  'approved',
  'published',
  'archived'
);

CREATE TYPE public.ifrs_note_standard AS ENUM (
  'ifrs',
  'ias',
  'ifric',
  'sic',
  'sme_ifrs'
);

CREATE TYPE public.ifrs_note_type AS ENUM (
  'accounting_policies',
  'judgements',
  'estimates',
  'property_plant_equipment',
  'intangible_assets',
  'inventories',
  'receivables',
  'cash',
  'borrowings',
  'leases',
  'revenue',
  'expenses',
  'tax',
  'deferred_tax',
  'employee_benefits',
  'share_capital',
  'financial_instruments',
  'related_parties',
  'events_after_reporting_period',
  'going_concern',
  'commitments',
  'contingencies',
  'segment_reporting',
  'other_notes'
);

CREATE TYPE public.ifrs_disclosure_kind AS ENUM (
  'mandatory',
  'conditional',
  'optional',
  'custom'
);

CREATE TYPE public.ifrs_note_item_kind AS ENUM (
  'section',
  'subsection',
  'paragraph',
  'table',
  'list',
  'cross_reference',
  'attachment'
);

CREATE TYPE public.ifrs_note_history_action AS ENUM (
  'created',
  'updated',
  'validated',
  'submitted_review',
  'manager_approved',
  'partner_approved',
  'approved',
  'published',
  'archived',
  'rolled_back',
  'comment_added',
  'section_added',
  'item_updated',
  'cross_reference_added',
  'rebuilt'
);

-- ---------------------------------------------------------------------------
-- ifrs_note_packages
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  mapping_set_id uuid REFERENCES public.financial_statement_mapping_sets (id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  standard public.ifrs_note_standard NOT NULL DEFAULT 'ifrs',
  package_status public.ifrs_note_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  version_count integer NOT NULL DEFAULT 0,
  required_note_count integer NOT NULL DEFAULT 0,
  completed_note_count integer NOT NULL DEFAULT 0,
  missing_note_count integer NOT NULL DEFAULT 0,
  validation_error_count integer NOT NULL DEFAULT 0,
  validation_warning_count integer NOT NULL DEFAULT 0,
  coverage_pct numeric(5, 2) NOT NULL DEFAULT 0,
  summary_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  structure_json jsonb NOT NULL DEFAULT '{}'::jsonb,
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
  CONSTRAINT ifrs_note_packages_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT ifrs_note_packages_version_positive CHECK (package_version >= 1),
  CONSTRAINT ifrs_note_packages_coverage_range CHECK (coverage_pct >= 0 AND coverage_pct <= 100),
  CONSTRAINT ifrs_note_packages_counts_non_negative CHECK (
    version_count >= 0
    AND required_note_count >= 0
    AND completed_note_count >= 0
    AND missing_note_count >= 0
    AND validation_error_count >= 0
    AND validation_warning_count >= 0
  )
);

CREATE UNIQUE INDEX ifrs_note_packages_engagement_active_uidx
  ON public.ifrs_note_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX ifrs_note_packages_workspace_id_idx ON public.ifrs_note_packages (workspace_id);
CREATE INDEX ifrs_note_packages_mapping_set_id_idx ON public.ifrs_note_packages (mapping_set_id);
CREATE INDEX ifrs_note_packages_status_idx ON public.ifrs_note_packages (package_status);

-- ---------------------------------------------------------------------------
-- ifrs_note_sections
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  note_type public.ifrs_note_type NOT NULL,
  note_code text NOT NULL,
  title text NOT NULL,
  standard_ref text,
  disclosure_kind public.ifrs_disclosure_kind NOT NULL DEFAULT 'mandatory',
  sort_order integer NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT true,
  is_completed boolean NOT NULL DEFAULT false,
  is_applicable boolean NOT NULL DEFAULT true,
  parent_section_id uuid REFERENCES public.ifrs_note_sections (id) ON DELETE SET NULL,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_note_sections_code_not_empty CHECK (char_length(trim(note_code)) > 0),
  CONSTRAINT ifrs_note_sections_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE UNIQUE INDEX ifrs_note_sections_package_code_active_uidx
  ON public.ifrs_note_sections (package_id, note_code)
  WHERE deleted_at IS NULL;

CREATE INDEX ifrs_note_sections_package_id_idx ON public.ifrs_note_sections (package_id);
CREATE INDEX ifrs_note_sections_note_type_idx ON public.ifrs_note_sections (note_type);

-- ---------------------------------------------------------------------------
-- ifrs_note_items
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.ifrs_note_sections (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  item_kind public.ifrs_note_item_kind NOT NULL DEFAULT 'paragraph',
  item_code text NOT NULL,
  title text,
  body_text text NOT NULL DEFAULT '',
  table_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  list_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_editable boolean NOT NULL DEFAULT true,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_note_items_code_not_empty CHECK (char_length(trim(item_code)) > 0)
);

CREATE UNIQUE INDEX ifrs_note_items_section_code_active_uidx
  ON public.ifrs_note_items (section_id, item_code)
  WHERE deleted_at IS NULL;

CREATE INDEX ifrs_note_items_package_id_idx ON public.ifrs_note_items (package_id);
CREATE INDEX ifrs_note_items_section_id_idx ON public.ifrs_note_items (section_id);

-- ---------------------------------------------------------------------------
-- ifrs_note_cross_references
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_cross_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  from_section_id uuid REFERENCES public.ifrs_note_sections (id) ON DELETE CASCADE,
  from_item_id uuid REFERENCES public.ifrs_note_items (id) ON DELETE SET NULL,
  to_section_id uuid REFERENCES public.ifrs_note_sections (id) ON DELETE SET NULL,
  statement_line_code text,
  disclosure_code text,
  source_account_code text,
  reference_label text NOT NULL,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_note_cross_references_label_not_empty CHECK (char_length(trim(reference_label)) > 0)
);

CREATE INDEX ifrs_note_cross_references_package_id_idx ON public.ifrs_note_cross_references (package_id);
CREATE INDEX ifrs_note_cross_references_from_section_idx ON public.ifrs_note_cross_references (from_section_id);
CREATE INDEX ifrs_note_cross_references_statement_line_idx ON public.ifrs_note_cross_references (statement_line_code);

-- ---------------------------------------------------------------------------
-- ifrs_note_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  version_status public.ifrs_note_version_status NOT NULL DEFAULT 'draft',
  change_summary text,
  snapshot_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  rolled_back_from_version integer,
  published_at timestamptz,
  published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  archived_at timestamptz,
  archived_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT ifrs_note_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX ifrs_note_versions_package_version_uidx
  ON public.ifrs_note_versions (package_id, version_number);

CREATE INDEX ifrs_note_versions_package_id_idx ON public.ifrs_note_versions (package_id);
CREATE INDEX ifrs_note_versions_status_idx ON public.ifrs_note_versions (version_status);

-- ---------------------------------------------------------------------------
-- ifrs_note_comments
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.ifrs_note_sections (id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.ifrs_note_items (id) ON DELETE SET NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  body text NOT NULL,
  author_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT ifrs_note_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX ifrs_note_comments_package_id_idx ON public.ifrs_note_comments (package_id);
CREATE INDEX ifrs_note_comments_section_id_idx ON public.ifrs_note_comments (section_id);

-- ---------------------------------------------------------------------------
-- ifrs_note_history
-- ---------------------------------------------------------------------------

CREATE TABLE public.ifrs_note_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.ifrs_note_packages (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  action public.ifrs_note_history_action NOT NULL,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  entity_type text,
  entity_id uuid,
  summary text NOT NULL,
  details_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT ifrs_note_history_summary_not_empty CHECK (char_length(trim(summary)) > 0)
);

CREATE INDEX ifrs_note_history_package_id_idx ON public.ifrs_note_history (package_id);
CREATE INDEX ifrs_note_history_created_at_idx ON public.ifrs_note_history (created_at DESC);
CREATE INDEX ifrs_note_history_action_idx ON public.ifrs_note_history (action);

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, module, status)
VALUES
  ('ifrs_notes.read', 'Read IFRS Notes', 'View IFRS note packages and disclosures', 'ifrs_notes', 'active'),
  ('ifrs_notes.create', 'Create IFRS Notes', 'Create IFRS note packages', 'ifrs_notes', 'active'),
  ('ifrs_notes.update', 'Update IFRS Notes', 'Edit note sections and items', 'ifrs_notes', 'active'),
  ('ifrs_notes.validate', 'Validate IFRS Notes', 'Validate note packages', 'ifrs_notes', 'active'),
  ('ifrs_notes.review', 'Review IFRS Notes', 'Submit and perform note reviews', 'ifrs_notes', 'active'),
  ('ifrs_notes.approve', 'Approve IFRS Notes', 'Approve note packages', 'ifrs_notes', 'active'),
  ('ifrs_notes.publish', 'Publish IFRS Notes', 'Publish note versions', 'ifrs_notes', 'active'),
  ('ifrs_notes.archive', 'Archive IFRS Notes', 'Archive note packages', 'ifrs_notes', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.ifrs_note_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_cross_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifrs_note_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY ifrs_note_packages_select ON public.ifrs_note_packages
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);
CREATE POLICY ifrs_note_packages_insert ON public.ifrs_note_packages
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_packages_update ON public.ifrs_note_packages
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_sections_select ON public.ifrs_note_sections
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);
CREATE POLICY ifrs_note_sections_insert ON public.ifrs_note_sections
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_sections_update ON public.ifrs_note_sections
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_items_select ON public.ifrs_note_items
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);
CREATE POLICY ifrs_note_items_insert ON public.ifrs_note_items
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_items_update ON public.ifrs_note_items
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_cross_references_select ON public.ifrs_note_cross_references
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);
CREATE POLICY ifrs_note_cross_references_insert ON public.ifrs_note_cross_references
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_cross_references_update ON public.ifrs_note_cross_references
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_versions_select ON public.ifrs_note_versions
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_versions_insert ON public.ifrs_note_versions
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_versions_update ON public.ifrs_note_versions
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id))
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_comments_select ON public.ifrs_note_comments
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);
CREATE POLICY ifrs_note_comments_insert ON public.ifrs_note_comments
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_comments_update ON public.ifrs_note_comments
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY ifrs_note_history_select ON public.ifrs_note_history
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id));
CREATE POLICY ifrs_note_history_insert ON public.ifrs_note_history
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_cross_references TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ifrs_note_comments TO authenticated;
GRANT SELECT, INSERT ON public.ifrs_note_history TO authenticated;

GRANT ALL ON public.ifrs_note_packages TO service_role;
GRANT ALL ON public.ifrs_note_sections TO service_role;
GRANT ALL ON public.ifrs_note_items TO service_role;
GRANT ALL ON public.ifrs_note_cross_references TO service_role;
GRANT ALL ON public.ifrs_note_versions TO service_role;
GRANT ALL ON public.ifrs_note_comments TO service_role;
GRANT ALL ON public.ifrs_note_history TO service_role;
