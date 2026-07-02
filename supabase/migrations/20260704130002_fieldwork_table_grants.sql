GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_programs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.procedure_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_procedures TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.working_papers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_evidence TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_findings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fieldwork_activity TO authenticated;

GRANT ALL ON public.fieldwork_packages TO service_role;
GRANT ALL ON public.audit_programs TO service_role;
GRANT ALL ON public.procedure_groups TO service_role;
GRANT ALL ON public.audit_procedures TO service_role;
GRANT ALL ON public.working_papers TO service_role;
GRANT ALL ON public.fieldwork_evidence TO service_role;
GRANT ALL ON public.fieldwork_findings TO service_role;
GRANT ALL ON public.fieldwork_notes TO service_role;
GRANT ALL ON public.fieldwork_activity TO service_role;
