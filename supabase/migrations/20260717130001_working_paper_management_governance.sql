-- ECP Sprint 1 / P4: Working Paper Management governance.
-- Immutable version snapshots + sign-off records for working papers
-- (PROJECT_BIBLE §13.2 Audit — working papers are versioned and reviewed).

-- ---------------------------------------------------------------------------
-- working_paper_versions — immutable snapshots of working paper state
-- ---------------------------------------------------------------------------

CREATE TABLE public.working_paper_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  working_paper_id uuid NOT NULL REFERENCES public.working_papers (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  title text NOT NULL,
  paper_status public.working_paper_status NOT NULL,
  content_notes text,
  tickmarks jsonb NOT NULL DEFAULT '[]'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT working_paper_versions_number_positive CHECK (version_number >= 1),
  CONSTRAINT working_paper_versions_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE UNIQUE INDEX working_paper_versions_paper_number_active_uidx
  ON public.working_paper_versions (working_paper_id, version_number)
  WHERE deleted_at IS NULL;

CREATE INDEX working_paper_versions_working_paper_id_idx
  ON public.working_paper_versions (working_paper_id);
CREATE INDEX working_paper_versions_engagement_id_idx
  ON public.working_paper_versions (engagement_id);
CREATE INDEX working_paper_versions_workspace_id_idx
  ON public.working_paper_versions (workspace_id);

-- ---------------------------------------------------------------------------
-- working_paper_sign_offs — preparer/reviewer/partner sign-off trail
-- ---------------------------------------------------------------------------

CREATE TABLE public.working_paper_sign_offs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  working_paper_id uuid NOT NULL REFERENCES public.working_papers (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  sign_off_role text NOT NULL,
  signed_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  signed_at timestamptz NOT NULL DEFAULT public.utc_now(),
  note text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT working_paper_sign_offs_number_positive CHECK (version_number >= 1),
  CONSTRAINT working_paper_sign_offs_role_valid CHECK (
    sign_off_role IN ('preparer', 'reviewer', 'partner')
  )
);

CREATE UNIQUE INDEX working_paper_sign_offs_paper_version_role_active_uidx
  ON public.working_paper_sign_offs (working_paper_id, version_number, sign_off_role)
  WHERE deleted_at IS NULL;

CREATE INDEX working_paper_sign_offs_working_paper_id_idx
  ON public.working_paper_sign_offs (working_paper_id);
CREATE INDEX working_paper_sign_offs_engagement_id_idx
  ON public.working_paper_sign_offs (engagement_id);
CREATE INDEX working_paper_sign_offs_workspace_id_idx
  ON public.working_paper_sign_offs (workspace_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_working_paper_versions_set_created_by
  BEFORE INSERT ON public.working_paper_versions
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_working_paper_versions_set_updated_at
  BEFORE UPDATE ON public.working_paper_versions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_working_paper_versions_set_updated_by
  BEFORE UPDATE ON public.working_paper_versions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_working_paper_versions_set_row_version
  BEFORE INSERT OR UPDATE ON public.working_paper_versions
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_working_paper_sign_offs_set_created_by
  BEFORE INSERT ON public.working_paper_sign_offs
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_working_paper_sign_offs_set_updated_at
  BEFORE UPDATE ON public.working_paper_sign_offs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_working_paper_sign_offs_set_updated_by
  BEFORE UPDATE ON public.working_paper_sign_offs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_working_paper_sign_offs_set_row_version
  BEFORE INSERT OR UPDATE ON public.working_paper_sign_offs
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- Row Level Security — engagement-scoped; history is immutable for users
-- ---------------------------------------------------------------------------

ALTER TABLE public.working_paper_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_paper_sign_offs ENABLE ROW LEVEL SECURITY;

CREATE POLICY working_paper_versions_select_authenticated
  ON public.working_paper_versions
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY working_paper_versions_insert_authenticated
  ON public.working_paper_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY working_paper_versions_update_service
  ON public.working_paper_versions
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY working_paper_versions_delete_service
  ON public.working_paper_versions
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY working_paper_sign_offs_select_authenticated
  ON public.working_paper_sign_offs
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY working_paper_sign_offs_insert_authenticated
  ON public.working_paper_sign_offs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY working_paper_sign_offs_update_service
  ON public.working_paper_sign_offs
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY working_paper_sign_offs_delete_service
  ON public.working_paper_sign_offs
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('working_paper.version.read', 'Read Working Paper Versions', 'View working paper version history', 'workspace', 'working_paper', 'active'),
  ('working_paper.version.create', 'Create Working Paper Version', 'Snapshot working paper versions', 'workspace', 'working_paper', 'active'),
  ('working_paper.sign_off', 'Sign Off Working Paper', 'Record preparer/reviewer/partner sign-off', 'workspace', 'working_paper', 'active')
ON CONFLICT DO NOTHING;

-- Role backfill (mirrors seed role mappings; idempotent)
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'platform_owner'
  AND p.code IN ('working_paper.version.read', 'working_paper.version.create', 'working_paper.sign_off')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'working_paper.version.read', 'working_paper.version.create', 'working_paper.sign_off'
)
WHERE r.slug IN ('organization_owner', 'organization_admin', 'workspace_admin', 'manager')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'working_paper.version.read', 'working_paper.version.create'
)
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'working_paper.version.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.working_paper_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.working_paper_sign_offs TO authenticated;
GRANT ALL ON public.working_paper_versions TO service_role;
GRANT ALL ON public.working_paper_sign_offs TO service_role;
