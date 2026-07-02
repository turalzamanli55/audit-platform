-- FEATURE-RISK-001: Table grants for risk assessment

GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_assessments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_register_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_assertion_ratings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_procedure_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_notes TO authenticated;
GRANT SELECT, INSERT ON public.risk_activity TO authenticated;

GRANT ALL ON public.risk_assessments TO service_role;
GRANT ALL ON public.risk_categories TO service_role;
GRANT ALL ON public.risk_register_items TO service_role;
GRANT ALL ON public.risk_assertion_ratings TO service_role;
GRANT ALL ON public.risk_responses TO service_role;
GRANT ALL ON public.risk_procedure_links TO service_role;
GRANT ALL ON public.risk_notes TO service_role;
GRANT ALL ON public.risk_activity TO service_role;
