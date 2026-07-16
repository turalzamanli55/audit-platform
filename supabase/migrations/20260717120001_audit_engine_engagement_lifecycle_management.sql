-- ECP Sprint 1 / P1: Audit Engine — engagement lifecycle management governance.
-- Immutable engagement lifecycle transition history (PROJECT_BIBLE §13.2 Audit).
-- Every lifecycle transition is recorded with actor, reason, and prior state.

-- ---------------------------------------------------------------------------
-- engagement_lifecycle_events
-- ---------------------------------------------------------------------------

CREATE TABLE public.engagement_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  from_status public.engagement_lifecycle_status,
  to_status public.engagement_lifecycle_status NOT NULL,
  actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT engagement_lifecycle_events_distinct_transition CHECK (
    from_status IS NULL OR from_status <> to_status
  )
);

CREATE INDEX engagement_lifecycle_events_engagement_id_idx
  ON public.engagement_lifecycle_events (engagement_id);
CREATE INDEX engagement_lifecycle_events_workspace_id_idx
  ON public.engagement_lifecycle_events (workspace_id);
CREATE INDEX engagement_lifecycle_events_created_at_idx
  ON public.engagement_lifecycle_events (created_at DESC);
CREATE INDEX engagement_lifecycle_events_to_status_idx
  ON public.engagement_lifecycle_events (to_status);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_engagement_lifecycle_events_set_created_by
  BEFORE INSERT ON public.engagement_lifecycle_events
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER trg_engagement_lifecycle_events_set_updated_at
  BEFORE UPDATE ON public.engagement_lifecycle_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_engagement_lifecycle_events_set_updated_by
  BEFORE UPDATE ON public.engagement_lifecycle_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();

CREATE TRIGGER trg_engagement_lifecycle_events_set_row_version
  BEFORE INSERT OR UPDATE ON public.engagement_lifecycle_events
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

-- ---------------------------------------------------------------------------
-- Row Level Security — lifecycle history is tenant-isolated and immutable
-- for regular users (service role only for corrections).
-- ---------------------------------------------------------------------------

ALTER TABLE public.engagement_lifecycle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY engagement_lifecycle_events_select_authenticated
  ON public.engagement_lifecycle_events
  FOR SELECT TO authenticated
  USING (
    public.is_service_role()
    OR public.user_can_access_engagement(engagement_id)
  );

CREATE POLICY engagement_lifecycle_events_insert_authenticated
  ON public.engagement_lifecycle_events
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_service_role()
    OR public.user_belongs_to_workspace(workspace_id)
  );

CREATE POLICY engagement_lifecycle_events_update_service
  ON public.engagement_lifecycle_events
  FOR UPDATE TO authenticated
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

CREATE POLICY engagement_lifecycle_events_delete_service
  ON public.engagement_lifecycle_events
  FOR DELETE TO authenticated
  USING (public.is_service_role());

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_lifecycle_events TO authenticated;
GRANT ALL ON public.engagement_lifecycle_events TO service_role;
