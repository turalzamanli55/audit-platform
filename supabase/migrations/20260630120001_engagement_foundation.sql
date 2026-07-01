-- FEATURE-002A: Engagement foundation — engagements, members, activity, RLS, permissions

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.engagement_type AS ENUM (
  'statutory_audit',
  'review',
  'agreed_upon_procedures',
  'advisory',
  'other'
);

CREATE TYPE public.engagement_lifecycle_status AS ENUM (
  'draft',
  'planning',
  'fieldwork',
  'review',
  'completed',
  'closed'
);

CREATE TYPE public.engagement_member_role AS ENUM (
  'engagement_partner',
  'engagement_manager',
  'senior',
  'staff',
  'reviewer',
  'observer'
);

-- ---------------------------------------------------------------------------
-- engagements
-- ---------------------------------------------------------------------------

CREATE TABLE public.engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug citext NOT NULL,
  engagement_code text,
  engagement_type public.engagement_type NOT NULL DEFAULT 'statutory_audit',
  lifecycle_status public.engagement_lifecycle_status NOT NULL DEFAULT 'draft',
  reporting_framework text NOT NULL DEFAULT 'IFRS',
  period_start date,
  period_end date,
  planned_start date,
  planned_end date,
  description text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT engagements_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT engagements_slug_not_empty CHECK (char_length(trim(slug::text)) > 0),
  CONSTRAINT engagements_workspace_org_consistency CHECK (
    organization_id IS NOT NULL AND workspace_id IS NOT NULL AND company_id IS NOT NULL
  ),
  CONSTRAINT engagements_period_order CHECK (
    period_start IS NULL OR period_end IS NULL OR period_start <= period_end
  ),
  CONSTRAINT engagements_planned_order CHECK (
    planned_start IS NULL OR planned_end IS NULL OR planned_start <= planned_end
  )
);

CREATE UNIQUE INDEX engagements_workspace_slug_active_uidx
  ON public.engagements (workspace_id, slug)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX engagements_workspace_code_active_uidx
  ON public.engagements (workspace_id, engagement_code)
  WHERE deleted_at IS NULL AND engagement_code IS NOT NULL;

CREATE INDEX engagements_organization_id_idx ON public.engagements (organization_id);
CREATE INDEX engagements_workspace_id_idx ON public.engagements (workspace_id);
CREATE INDEX engagements_company_id_idx ON public.engagements (company_id);
CREATE INDEX engagements_lifecycle_status_idx ON public.engagements (lifecycle_status);
CREATE INDEX engagements_name_search_idx ON public.engagements USING gin (to_tsvector('simple', name));

-- ---------------------------------------------------------------------------
-- engagement_members
-- ---------------------------------------------------------------------------

CREATE TABLE public.engagement_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  member_role public.engagement_member_role NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active'
);

CREATE UNIQUE INDEX engagement_members_engagement_user_active_uidx
  ON public.engagement_members (engagement_id, user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX engagement_members_engagement_id_idx ON public.engagement_members (engagement_id);
CREATE INDEX engagement_members_user_id_idx ON public.engagement_members (user_id);
CREATE INDEX engagement_members_workspace_id_idx ON public.engagement_members (workspace_id);

-- ---------------------------------------------------------------------------
-- engagement_activity
-- ---------------------------------------------------------------------------

CREATE TABLE public.engagement_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT engagement_activity_action_not_empty CHECK (char_length(trim(action)) > 0)
);

CREATE INDEX engagement_activity_engagement_id_idx ON public.engagement_activity (engagement_id);
CREATE INDEX engagement_activity_created_at_idx ON public.engagement_activity (created_at DESC);
CREATE INDEX engagement_activity_workspace_id_idx ON public.engagement_activity (workspace_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_engagements_set_created_by
  BEFORE INSERT ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_engagements_set_updated_at
  BEFORE UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_engagements_set_updated_by
  BEFORE UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_engagements_set_row_version
  BEFORE INSERT OR UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_engagement_members_set_created_by
  BEFORE INSERT ON public.engagement_members
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_engagement_members_set_updated_at
  BEFORE UPDATE ON public.engagement_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_engagement_members_set_updated_by
  BEFORE UPDATE ON public.engagement_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_engagement_members_set_row_version
  BEFORE INSERT OR UPDATE ON public.engagement_members
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

CREATE TRIGGER trg_engagement_activity_set_created_by
  BEFORE INSERT ON public.engagement_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_engagement_activity_set_updated_at
  BEFORE UPDATE ON public.engagement_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_engagement_activity_set_updated_by
  BEFORE UPDATE ON public.engagement_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_engagement_activity_set_row_version
  BEFORE INSERT OR UPDATE ON public.engagement_activity
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_can_access_engagement(target_engagement_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.engagements e
      WHERE e.id = target_engagement_id
        AND e.deleted_at IS NULL
        AND public.user_belongs_to_workspace(e.workspace_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.engagement_members em
      WHERE em.engagement_id = target_engagement_id
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
  ('engagement.read', 'Read Engagement', 'View engagement profile and metadata', 'workspace', 'engagement', 'active'),
  ('engagement.create', 'Create Engagement', 'Create new engagements', 'workspace', 'engagement', 'active'),
  ('engagement.update', 'Update Engagement', 'Modify engagement information', 'workspace', 'engagement', 'active'),
  ('engagement.archive', 'Archive Engagement', 'Archive engagements', 'workspace', 'engagement', 'active'),
  ('engagement.delete', 'Delete Engagement', 'Permanently delete engagements (restricted)', 'workspace', 'engagement', 'active')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY engagements_select_authenticated ON public.engagements
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
    OR public.user_can_access_engagement(id)
  );

CREATE POLICY engagements_insert_authenticated ON public.engagements
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagements_update_authenticated ON public.engagements
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagements_delete_service ON public.engagements
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY engagement_members_select_authenticated ON public.engagement_members
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY engagement_members_insert_authenticated ON public.engagement_members
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagement_members_update_authenticated ON public.engagement_members
  FOR UPDATE TO authenticated
  USING (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  )
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagement_members_delete_service ON public.engagement_members
  FOR DELETE TO authenticated
  USING (public.is_service_role());

CREATE POLICY engagement_activity_select_authenticated ON public.engagement_activity
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY engagement_activity_insert_authenticated ON public.engagement_activity
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagement_activity_update_service ON public.engagement_activity
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY engagement_activity_delete_service ON public.engagement_activity
  FOR DELETE TO authenticated
  USING (public.is_service_role());
