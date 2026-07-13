-- FEATURE-FSRE-001: Financial Statement Rendering Engine foundation
-- Renders Normalized Financial Statement Dataset (FSME) into enterprise UI statements.
-- Does NOT generate PDFs, Word, Excel, IFRS notes, XBRL, or AI output.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.fs_render_presentation_status AS ENUM (
  'draft',
  'validated',
  'approved',
  'published',
  'archived'
);

CREATE TYPE public.fs_render_version_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE public.fs_render_standard AS ENUM (
  'ifrs',
  'sme_ifrs',
  'local_gaap',
  'custom'
);

CREATE TYPE public.fs_render_layout_mode AS ENUM (
  'collapsed',
  'expanded',
  'tree',
  'grouped',
  'flat'
);

CREATE TYPE public.fs_render_comparative_mode AS ENUM (
  'current_period',
  'previous_period',
  'multi_year'
);

CREATE TYPE public.fs_render_statement_type AS ENUM (
  'statement_of_financial_position',
  'statement_of_profit_or_loss',
  'statement_of_comprehensive_income',
  'statement_of_changes_in_equity',
  'statement_of_cash_flows'
);

CREATE TYPE public.fs_render_line_style AS ENUM (
  'normal',
  'subtotal',
  'total',
  'double_total',
  'bold',
  'hidden',
  'calculated',
  'reference',
  'cross_reference'
);

CREATE TYPE public.fs_render_history_action AS ENUM (
  'created',
  'updated',
  'validated',
  'approved',
  'published',
  'archived',
  'rolled_back',
  'layout_changed',
  'presentation_changed',
  'rendered',
  'revalidated'
);

-- ---------------------------------------------------------------------------
-- financial_statement_layouts
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  engagement_id uuid REFERENCES public.engagements (id) ON DELETE SET NULL,
  layout_code text NOT NULL,
  layout_name text NOT NULL,
  layout_mode public.fs_render_layout_mode NOT NULL DEFAULT 'expanded',
  standard public.fs_render_standard NOT NULL DEFAULT 'ifrs',
  is_system boolean NOT NULL DEFAULT false,
  formatting_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT financial_statement_layouts_code_not_empty CHECK (char_length(trim(layout_code)) > 0),
  CONSTRAINT financial_statement_layouts_name_not_empty CHECK (char_length(trim(layout_name)) > 0)
);

CREATE UNIQUE INDEX financial_statement_layouts_workspace_code_active_uidx
  ON public.financial_statement_layouts (workspace_id, layout_code)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_layouts_workspace_id_idx
  ON public.financial_statement_layouts (workspace_id);
CREATE INDEX financial_statement_layouts_mode_idx
  ON public.financial_statement_layouts (layout_mode);
CREATE INDEX financial_statement_layouts_standard_idx
  ON public.financial_statement_layouts (standard);

-- ---------------------------------------------------------------------------
-- financial_statement_presentations
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  mapping_set_id uuid REFERENCES public.financial_statement_mapping_sets (id) ON DELETE SET NULL,
  layout_id uuid REFERENCES public.financial_statement_layouts (id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  standard public.fs_render_standard NOT NULL DEFAULT 'ifrs',
  presentation_status public.fs_render_presentation_status NOT NULL DEFAULT 'draft',
  layout_mode public.fs_render_layout_mode NOT NULL DEFAULT 'expanded',
  comparative_mode public.fs_render_comparative_mode NOT NULL DEFAULT 'current_period',
  currency_code text NOT NULL DEFAULT 'AZN',
  presentation_version integer NOT NULL DEFAULT 1,
  version_count integer NOT NULL DEFAULT 0,
  rendered_statement_count integer NOT NULL DEFAULT 0,
  validation_error_count integer NOT NULL DEFAULT 0,
  validation_warning_count integer NOT NULL DEFAULT 0,
  presentation_coverage_pct numeric(5, 2) NOT NULL DEFAULT 0,
  formatting_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  render_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  history_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary_json jsonb NOT NULL DEFAULT '{}'::jsonb,
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
  CONSTRAINT financial_statement_presentations_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT financial_statement_presentations_version_positive CHECK (presentation_version >= 1),
  CONSTRAINT financial_statement_presentations_coverage_range CHECK (
    presentation_coverage_pct >= 0 AND presentation_coverage_pct <= 100
  ),
  CONSTRAINT financial_statement_presentations_counts_non_negative CHECK (
    version_count >= 0
    AND rendered_statement_count >= 0
    AND validation_error_count >= 0
    AND validation_warning_count >= 0
  )
);

CREATE UNIQUE INDEX financial_statement_presentations_engagement_active_uidx
  ON public.financial_statement_presentations (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX financial_statement_presentations_workspace_id_idx
  ON public.financial_statement_presentations (workspace_id);
CREATE INDEX financial_statement_presentations_mapping_set_id_idx
  ON public.financial_statement_presentations (mapping_set_id);
CREATE INDEX financial_statement_presentations_layout_id_idx
  ON public.financial_statement_presentations (layout_id);
CREATE INDEX financial_statement_presentations_status_idx
  ON public.financial_statement_presentations (presentation_status);

-- ---------------------------------------------------------------------------
-- financial_statement_render_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.financial_statement_render_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid NOT NULL REFERENCES public.financial_statement_presentations (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  version_status public.fs_render_version_status NOT NULL DEFAULT 'draft',
  change_summary text,
  snapshot_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  rolled_back_from_version integer,
  published_at timestamptz,
  published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  archived_at timestamptz,
  archived_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT financial_statement_render_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX financial_statement_render_versions_presentation_version_uidx
  ON public.financial_statement_render_versions (presentation_id, version_number);

CREATE INDEX financial_statement_render_versions_presentation_id_idx
  ON public.financial_statement_render_versions (presentation_id);
CREATE INDEX financial_statement_render_versions_status_idx
  ON public.financial_statement_render_versions (version_status);

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, module, status)
VALUES
  ('fs_rendering.read', 'Read FS Rendering', 'View financial statement presentations', 'fs_rendering', 'active'),
  ('fs_rendering.create', 'Create FS Rendering', 'Create presentations and layouts', 'fs_rendering', 'active'),
  ('fs_rendering.update', 'Update FS Rendering', 'Update presentation and layout settings', 'fs_rendering', 'active'),
  ('fs_rendering.validate', 'Validate FS Rendering', 'Validate rendered presentations', 'fs_rendering', 'active'),
  ('fs_rendering.approve', 'Approve FS Rendering', 'Approve presentations', 'fs_rendering', 'active'),
  ('fs_rendering.publish', 'Publish FS Rendering', 'Publish render versions', 'fs_rendering', 'active'),
  ('fs_rendering.archive', 'Archive FS Rendering', 'Archive presentations', 'fs_rendering', 'active')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.financial_statement_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_render_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY financial_statement_layouts_select ON public.financial_statement_layouts
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);

CREATE POLICY financial_statement_layouts_insert ON public.financial_statement_layouts
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_layouts_update ON public.financial_statement_layouts
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_presentations_select ON public.financial_statement_presentations
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL);

CREATE POLICY financial_statement_presentations_insert ON public.financial_statement_presentations
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_presentations_update ON public.financial_statement_presentations
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_render_versions_select ON public.financial_statement_render_versions
  FOR SELECT TO authenticated
  USING (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_render_versions_insert ON public.financial_statement_render_versions
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_workspace(workspace_id));

CREATE POLICY financial_statement_render_versions_update ON public.financial_statement_render_versions
  FOR UPDATE TO authenticated
  USING (public.user_can_access_workspace(workspace_id))
  WITH CHECK (public.user_can_access_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_layouts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_presentations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_render_versions TO authenticated;

GRANT ALL ON public.financial_statement_layouts TO service_role;
GRANT ALL ON public.financial_statement_presentations TO service_role;
GRANT ALL ON public.financial_statement_render_versions TO service_role;
