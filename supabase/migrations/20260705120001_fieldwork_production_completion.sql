-- FEATURE-FIELDWORK-002: Production completion — workflow, tickmark library, evidence storage

-- ---------------------------------------------------------------------------
-- Procedure review workflow columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.audit_procedures
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS returned_at timestamptz,
  ADD COLUMN IF NOT EXISTS returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS return_notes text,
  ADD COLUMN IF NOT EXISTS cleared_at timestamptz,
  ADD COLUMN IF NOT EXISTS cleared_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS clearance_notes text;

-- ---------------------------------------------------------------------------
-- Working paper assignment + workflow columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.working_papers
  ADD COLUMN IF NOT EXISTS assigned_auditor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS returned_at timestamptz,
  ADD COLUMN IF NOT EXISTS returned_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS return_notes text,
  ADD COLUMN IF NOT EXISTS cleared_at timestamptz,
  ADD COLUMN IF NOT EXISTS cleared_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS clearance_notes text;

-- ---------------------------------------------------------------------------
-- Evidence storage integration
-- ---------------------------------------------------------------------------

ALTER TABLE public.fieldwork_evidence
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS storage_bucket text NOT NULL DEFAULT 'fieldwork-evidence';

-- ---------------------------------------------------------------------------
-- Clearance note type
-- ---------------------------------------------------------------------------

ALTER TYPE public.fieldwork_note_type ADD VALUE IF NOT EXISTS 'clearance';

-- ---------------------------------------------------------------------------
-- Tickmark library (workspace-scoped)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.fieldwork_tickmark_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  symbol text NOT NULL,
  meaning text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT fieldwork_tickmark_library_symbol_not_empty CHECK (char_length(trim(symbol)) > 0),
  CONSTRAINT fieldwork_tickmark_library_meaning_not_empty CHECK (char_length(trim(meaning)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS fieldwork_tickmark_library_workspace_symbol_uidx
  ON public.fieldwork_tickmark_library (workspace_id, lower(symbol))
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS fieldwork_tickmark_library_workspace_id_idx
  ON public.fieldwork_tickmark_library (workspace_id);

ALTER TABLE public.fieldwork_tickmark_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY fieldwork_tickmark_library_select ON public.fieldwork_tickmark_library
  FOR SELECT TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY fieldwork_tickmark_library_write ON public.fieldwork_tickmark_library
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_tickmark_library TO authenticated;
GRANT ALL ON public.fieldwork_tickmark_library TO service_role;

-- ---------------------------------------------------------------------------
-- Storage bucket for fieldwork evidence
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fieldwork-evidence',
  'fieldwork-evidence',
  false,
  52428800,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY fieldwork_evidence_storage_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'fieldwork-evidence'
    AND public.is_service_role()
    OR (
      bucket_id = 'fieldwork-evidence'
      AND (storage.foldername(name))[1] IN (
        SELECT w.id::text
        FROM public.workspaces w
        WHERE public.user_belongs_to_workspace(w.id)
      )
    )
  );

CREATE POLICY fieldwork_evidence_storage_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'fieldwork-evidence'
    AND public.is_service_role()
    OR (
      bucket_id = 'fieldwork-evidence'
      AND (storage.foldername(name))[1] IN (
        SELECT w.id::text
        FROM public.workspaces w
        WHERE public.user_belongs_to_workspace(w.id)
      )
    )
  );
