-- FEATURE-MATERIALITY-001: ISA 320 Materiality foundation — packages, benchmarks, calculations, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.materiality_package_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'returned',
  'approved',
  'archived'
);

CREATE TYPE public.materiality_benchmark_type AS ENUM (
  'revenue',
  'profit_before_tax',
  'ebitda',
  'total_assets',
  'equity',
  'expenses',
  'manual'
);

CREATE TYPE public.materiality_calculation_type AS ENUM (
  'overall',
  'performance',
  'specific',
  'trivial'
);

CREATE TYPE public.materiality_comment_type AS ENUM (
  'review',
  'internal'
);

-- ---------------------------------------------------------------------------
-- materiality_packages
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  audit_plan_id uuid NOT NULL REFERENCES public.audit_plans (id) ON DELETE RESTRICT,
  package_status public.materiality_package_status NOT NULL DEFAULT 'draft',
  package_version integer NOT NULL DEFAULT 1,
  progress_pct integer NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'AZN',
  overall_materiality numeric(18, 2),
  performance_materiality numeric(18, 2),
  performance_materiality_pct numeric(5, 2),
  specific_materiality jsonb NOT NULL DEFAULT '[]'::jsonb,
  trivial_threshold numeric(18, 2),
  trivial_threshold_pct numeric(5, 2),
  basis_notes text,
  selected_benchmark_id uuid,
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
  CONSTRAINT materiality_packages_progress_pct_range CHECK (progress_pct >= 0 AND progress_pct <= 100),
  CONSTRAINT materiality_packages_package_version_positive CHECK (package_version >= 1),
  CONSTRAINT materiality_packages_performance_pct_range CHECK (
    performance_materiality_pct IS NULL
    OR (performance_materiality_pct > 0 AND performance_materiality_pct <= 100)
  ),
  CONSTRAINT materiality_packages_trivial_pct_range CHECK (
    trivial_threshold_pct IS NULL
    OR (trivial_threshold_pct > 0 AND trivial_threshold_pct <= 100)
  )
);

CREATE UNIQUE INDEX materiality_packages_engagement_active_uidx
  ON public.materiality_packages (engagement_id)
  WHERE deleted_at IS NULL;

CREATE INDEX materiality_packages_workspace_id_idx ON public.materiality_packages (workspace_id);
CREATE INDEX materiality_packages_engagement_id_idx ON public.materiality_packages (engagement_id);
CREATE INDEX materiality_packages_audit_plan_id_idx ON public.materiality_packages (audit_plan_id);

-- ---------------------------------------------------------------------------
-- materiality_versions
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materiality_package_id uuid NOT NULL REFERENCES public.materiality_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT materiality_versions_version_positive CHECK (version_number >= 1)
);

CREATE UNIQUE INDEX materiality_versions_package_version_uidx
  ON public.materiality_versions (materiality_package_id, version_number);

CREATE INDEX materiality_versions_package_id_idx ON public.materiality_versions (materiality_package_id);

-- ---------------------------------------------------------------------------
-- materiality_benchmarks
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materiality_package_id uuid NOT NULL REFERENCES public.materiality_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  benchmark_type public.materiality_benchmark_type NOT NULL,
  benchmark_label text,
  benchmark_amount numeric(18, 2) NOT NULL,
  percentage numeric(5, 2) NOT NULL,
  calculated_materiality numeric(18, 2),
  is_selected boolean NOT NULL DEFAULT false,
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
  CONSTRAINT materiality_benchmarks_amount_positive CHECK (benchmark_amount >= 0),
  CONSTRAINT materiality_benchmarks_percentage_range CHECK (percentage > 0 AND percentage <= 100)
);

CREATE INDEX materiality_benchmarks_package_id_idx ON public.materiality_benchmarks (materiality_package_id);

ALTER TABLE public.materiality_packages
  ADD CONSTRAINT materiality_packages_selected_benchmark_fkey
  FOREIGN KEY (selected_benchmark_id) REFERENCES public.materiality_benchmarks (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- materiality_calculations
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materiality_package_id uuid NOT NULL REFERENCES public.materiality_packages (id) ON DELETE RESTRICT,
  benchmark_id uuid REFERENCES public.materiality_benchmarks (id) ON DELETE SET NULL,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  calculation_type public.materiality_calculation_type NOT NULL,
  input_amount numeric(18, 2),
  percentage numeric(5, 2),
  result_amount numeric(18, 2),
  is_manual_override boolean NOT NULL DEFAULT false,
  explanation text,
  formula text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX materiality_calculations_package_id_idx ON public.materiality_calculations (materiality_package_id);
CREATE INDEX materiality_calculations_created_at_idx ON public.materiality_calculations (created_at DESC);

-- ---------------------------------------------------------------------------
-- materiality_comments
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materiality_package_id uuid NOT NULL REFERENCES public.materiality_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  comment_type public.materiality_comment_type NOT NULL DEFAULT 'review',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT materiality_comments_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX materiality_comments_package_id_idx ON public.materiality_comments (materiality_package_id);

-- ---------------------------------------------------------------------------
-- materiality_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.materiality_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materiality_package_id uuid NOT NULL REFERENCES public.materiality_packages (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX materiality_activity_package_id_idx ON public.materiality_activity (materiality_package_id);
CREATE INDEX materiality_activity_created_at_idx ON public.materiality_activity (created_at DESC);

-- ---------------------------------------------------------------------------
-- Access helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_materiality_package(target_materiality_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.materiality_packages mp
      WHERE mp.id = target_materiality_package_id
        AND mp.deleted_at IS NULL
        AND public.user_belongs_to_workspace(mp.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.materiality_packages mp
      JOIN public.engagement_members em ON em.engagement_id = mp.engagement_id
      WHERE mp.id = target_materiality_package_id
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
  ('materiality.read', 'Read Materiality', 'View materiality workspace and ISA 320 documentation', 'workspace', 'materiality', 'active'),
  ('materiality.create', 'Create Materiality', 'Initiate materiality package for an engagement', 'workspace', 'materiality', 'active'),
  ('materiality.update', 'Update Materiality', 'Modify materiality thresholds, benchmarks, and calculations', 'workspace', 'materiality', 'active'),
  ('materiality.review', 'Review Materiality', 'Review and return materiality documentation', 'workspace', 'materiality', 'active'),
  ('materiality.approve', 'Approve Materiality', 'Approve materiality thresholds per ISA 320', 'workspace', 'materiality', 'active'),
  ('materiality.archive', 'Archive Materiality', 'Archive materiality packages', 'workspace', 'materiality', 'active'),
  ('materiality.comment', 'Comment on Materiality', 'Add review and internal materiality notes', 'workspace', 'materiality', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.materiality_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiality_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY materiality_packages_select ON public.materiality_packages
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY materiality_packages_write ON public.materiality_packages
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY materiality_versions_access ON public.materiality_versions
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY materiality_benchmarks_access ON public.materiality_benchmarks
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY materiality_calculations_access ON public.materiality_calculations
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY materiality_comments_access ON public.materiality_comments
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY materiality_activity_select ON public.materiality_activity
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id));

CREATE POLICY materiality_activity_insert ON public.materiality_activity
  FOR INSERT TO authenticated
  WITH CHECK (public.is_service_role() OR public.user_can_access_materiality_package(materiality_package_id));
