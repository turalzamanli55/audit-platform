-- FEATURE-UAIE-002: Table grants for UAIE foundation + Import Intelligence Center
-- New tables created after the initial schema-wide GRANT do not inherit privileges.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_import_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_sheet_scans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_column_mappings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_mapping_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_validation_issues TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_normalized_rows TO authenticated;
GRANT SELECT, INSERT ON public.uaie_import_activity TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_dictionary_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_unknown_headers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_fingerprints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uaie_learning_events TO authenticated;
GRANT SELECT, INSERT ON public.uaie_intelligence_audit TO authenticated;

GRANT ALL ON public.uaie_import_sessions TO service_role;
GRANT ALL ON public.uaie_sheet_scans TO service_role;
GRANT ALL ON public.uaie_column_mappings TO service_role;
GRANT ALL ON public.uaie_mapping_profiles TO service_role;
GRANT ALL ON public.uaie_validation_issues TO service_role;
GRANT ALL ON public.uaie_normalized_rows TO service_role;
GRANT ALL ON public.uaie_import_activity TO service_role;

GRANT ALL ON public.uaie_dictionary_entries TO service_role;
GRANT ALL ON public.uaie_unknown_headers TO service_role;
GRANT ALL ON public.uaie_fingerprints TO service_role;
GRANT ALL ON public.uaie_learning_events TO service_role;
GRANT ALL ON public.uaie_intelligence_audit TO service_role;
