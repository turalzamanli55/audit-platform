-- FEATURE-UAIE-002: Import Intelligence Center foundation

CREATE TYPE public.uaie_dictionary_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'merged',
  'disabled',
  'deleted'
);

CREATE TYPE public.uaie_unknown_status AS ENUM (
  'open',
  'suggested',
  'approved',
  'rejected',
  'ignored',
  'merged'
);

CREATE TYPE public.uaie_learning_event_type AS ENUM (
  'mapping_approved',
  'mapping_rejected',
  'header_learned',
  'unknown_approved',
  'unknown_rejected',
  'unknown_ignored',
  'dictionary_merged',
  'dictionary_disabled',
  'dictionary_restored',
  'fingerprint_recorded',
  'template_promoted',
  'template_rolled_back',
  'erp_detected',
  'import_staged',
  'admin_export',
  'admin_import'
);

CREATE TABLE public.uaie_dictionary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  raw_value text NOT NULL,
  normalized_value text NOT NULL,
  canonical_field public.uaie_canonical_field NOT NULL,
  language_code text,
  source text NOT NULL DEFAULT 'manual',
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  occurrences integer NOT NULL DEFAULT 1,
  detected_erp public.uaie_erp_system,
  entry_status public.uaie_dictionary_status NOT NULL DEFAULT 'pending',
  merged_into_id uuid REFERENCES public.uaie_dictionary_entries (id) ON DELETE SET NULL,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT uaie_dictionary_entries_raw_not_empty CHECK (char_length(trim(raw_value)) > 0),
  CONSTRAINT uaie_dictionary_entries_normalized_not_empty CHECK (char_length(trim(normalized_value)) > 0),
  CONSTRAINT uaie_dictionary_entries_confidence_range CHECK (confidence >= 0 AND confidence <= 100),
  CONSTRAINT uaie_dictionary_entries_occurrences_positive CHECK (occurrences >= 0)
);

CREATE UNIQUE INDEX uaie_dictionary_entries_workspace_normalized_field_uidx
  ON public.uaie_dictionary_entries (workspace_id, normalized_value, canonical_field)
  WHERE deleted_at IS NULL AND entry_status IN ('pending', 'approved', 'disabled');

CREATE INDEX uaie_dictionary_entries_workspace_id_idx ON public.uaie_dictionary_entries (workspace_id);
CREATE INDEX uaie_dictionary_entries_normalized_idx ON public.uaie_dictionary_entries (normalized_value);
CREATE INDEX uaie_dictionary_entries_status_idx ON public.uaie_dictionary_entries (entry_status);

CREATE TABLE public.uaie_unknown_headers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  raw_value text NOT NULL,
  normalized_value text NOT NULL,
  suggested_field public.uaie_canonical_field,
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  occurrences integer NOT NULL DEFAULT 1,
  detected_erp public.uaie_erp_system,
  language_code text,
  unknown_status public.uaie_unknown_status NOT NULL DEFAULT 'open',
  dictionary_entry_id uuid REFERENCES public.uaie_dictionary_entries (id) ON DELETE SET NULL,
  first_seen_at timestamptz NOT NULL DEFAULT public.utc_now(),
  last_seen_at timestamptz NOT NULL DEFAULT public.utc_now(),
  last_session_id uuid REFERENCES public.uaie_import_sessions (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT uaie_unknown_headers_raw_not_empty CHECK (char_length(trim(raw_value)) > 0),
  CONSTRAINT uaie_unknown_headers_confidence_range CHECK (confidence >= 0 AND confidence <= 100)
);

CREATE UNIQUE INDEX uaie_unknown_headers_workspace_normalized_uidx
  ON public.uaie_unknown_headers (workspace_id, normalized_value)
  WHERE deleted_at IS NULL AND unknown_status IN ('open', 'suggested');

CREATE INDEX uaie_unknown_headers_workspace_id_idx ON public.uaie_unknown_headers (workspace_id);
CREATE INDEX uaie_unknown_headers_occurrences_idx ON public.uaie_unknown_headers (occurrences DESC);

CREATE TABLE public.uaie_fingerprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  import_session_id uuid REFERENCES public.uaie_import_sessions (id) ON DELETE SET NULL,
  workbook_hash text,
  header_hash text,
  layout_hash text,
  erp_hash text,
  detected_erp public.uaie_erp_system NOT NULL DEFAULT 'unknown',
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  template_version integer NOT NULL DEFAULT 1,
  learning_score numeric(5,2) NOT NULL DEFAULT 0,
  similarity_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  updated_at timestamptz NOT NULL DEFAULT public.utc_now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1,
  status public.record_status NOT NULL DEFAULT 'active',
  CONSTRAINT uaie_fingerprints_confidence_range CHECK (confidence >= 0 AND confidence <= 100),
  CONSTRAINT uaie_fingerprints_learning_score_range CHECK (learning_score >= 0 AND learning_score <= 100)
);

CREATE INDEX uaie_fingerprints_workspace_id_idx ON public.uaie_fingerprints (workspace_id);
CREATE INDEX uaie_fingerprints_layout_hash_idx ON public.uaie_fingerprints (layout_hash);
CREATE INDEX uaie_fingerprints_header_hash_idx ON public.uaie_fingerprints (header_hash);
CREATE INDEX uaie_fingerprints_workbook_hash_idx ON public.uaie_fingerprints (workbook_hash);

CREATE TABLE public.uaie_learning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  import_session_id uuid REFERENCES public.uaie_import_sessions (id) ON DELETE SET NULL,
  event_type public.uaie_learning_event_type NOT NULL,
  summary text NOT NULL,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT uaie_learning_events_summary_not_empty CHECK (char_length(trim(summary)) > 0)
);

CREATE INDEX uaie_learning_events_workspace_id_idx ON public.uaie_learning_events (workspace_id);
CREATE INDEX uaie_learning_events_created_at_idx ON public.uaie_learning_events (created_at DESC);
CREATE INDEX uaie_learning_events_type_idx ON public.uaie_learning_events (event_type);

CREATE TABLE public.uaie_intelligence_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE RESTRICT,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE RESTRICT,
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  action_code text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  summary text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT public.utc_now(),
  CONSTRAINT uaie_intelligence_audit_action_not_empty CHECK (char_length(trim(action_code)) > 0)
);

CREATE INDEX uaie_intelligence_audit_workspace_id_idx ON public.uaie_intelligence_audit (workspace_id);
CREATE INDEX uaie_intelligence_audit_created_at_idx ON public.uaie_intelligence_audit (created_at DESC);

ALTER TABLE public.uaie_import_sessions
  ADD COLUMN IF NOT EXISTS health_json jsonb NOT NULL DEFAULT '{}'::jsonb;

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('uaie.review', 'Review UAIE intelligence', 'Review unknown headers and suggested mappings', 'workspace', 'uaie', 'active'),
  ('uaie.approve', 'Approve UAIE learning', 'Approve dictionary entries and learning suggestions', 'workspace', 'uaie', 'active'),
  ('uaie.admin', 'Administer UAIE intelligence', 'Merge, rollback, export/import dictionary and templates', 'workspace', 'uaie', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN ('uaie.review', 'uaie.approve', 'uaie.admin')
WHERE r.slug IN ('platform_owner', 'organization_owner', 'organization_admin', 'workspace_admin')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN ('uaie.review', 'uaie.approve')
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'uaie.review'
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

ALTER TABLE public.uaie_dictionary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_unknown_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uaie_intelligence_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY uaie_dictionary_entries_access ON public.uaie_dictionary_entries
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_unknown_headers_access ON public.uaie_unknown_headers
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_fingerprints_access ON public.uaie_fingerprints
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_learning_events_access ON public.uaie_learning_events
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE POLICY uaie_intelligence_audit_access ON public.uaie_intelligence_audit
  FOR ALL TO authenticated
  USING (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id))
  WITH CHECK (public.is_service_role() OR public.user_belongs_to_workspace(workspace_id));

CREATE TRIGGER uaie_dictionary_entries_set_updated_at
  BEFORE UPDATE ON public.uaie_dictionary_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER uaie_unknown_headers_set_updated_at
  BEFORE UPDATE ON public.uaie_unknown_headers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER uaie_fingerprints_set_updated_at
  BEFORE UPDATE ON public.uaie_fingerprints
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
