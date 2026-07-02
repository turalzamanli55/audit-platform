-- Grant table privileges on planning tables created after initial RLS migration.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planning_activity TO authenticated;

GRANT ALL ON public.audit_plans TO service_role;
GRANT ALL ON public.planning_activity TO service_role;
