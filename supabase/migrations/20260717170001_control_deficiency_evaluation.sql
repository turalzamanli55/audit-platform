-- ECP Sprint 3: Control deficiency evaluation registry (mod_control-framework)

CREATE TABLE public.control_deficiency_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  engagement_id uuid NOT NULL REFERENCES public.engagements (id) ON DELETE RESTRICT,
  control_id text NOT NULL,
  deficiency_title text NOT NULL,
  severity text NOT NULL,
  remediation_required boolean NOT NULL DEFAULT false,
  evaluation_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT control_deficiency_evaluations_control_not_empty CHECK (char_length(trim(control_id)) > 0),
  CONSTRAINT control_deficiency_evaluations_severity_valid CHECK (
    severity IN ('deficiency', 'significant_deficiency', 'material_weakness')
  ),
  CONSTRAINT control_deficiency_evaluations_status_valid CHECK (
    evaluation_status IN ('draft', 'validated', 'reported', 'remediated')
  )
);

CREATE INDEX control_deficiency_evaluations_engagement_id_idx
  ON public.control_deficiency_evaluations (engagement_id);
CREATE INDEX control_deficiency_evaluations_workspace_id_idx
  ON public.control_deficiency_evaluations (workspace_id);

CREATE TRIGGER trg_control_deficiency_evaluations_set_created_by
  BEFORE INSERT ON public.control_deficiency_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
CREATE TRIGGER trg_control_deficiency_evaluations_set_updated_at
  BEFORE UPDATE ON public.control_deficiency_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_control_deficiency_evaluations_set_updated_by
  BEFORE UPDATE ON public.control_deficiency_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_by();
CREATE TRIGGER trg_control_deficiency_evaluations_set_row_version
  BEFORE INSERT OR UPDATE ON public.control_deficiency_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.set_row_version();

ALTER TABLE public.control_deficiency_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY control_deficiency_evaluations_select_authenticated ON public.control_deficiency_evaluations
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_can_access_engagement(engagement_id));
CREATE POLICY control_deficiency_evaluations_write_authenticated ON public.control_deficiency_evaluations
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.control_deficiency_evaluations TO authenticated;
GRANT ALL ON public.control_deficiency_evaluations TO service_role;
