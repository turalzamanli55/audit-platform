-- FEATURE-MATERIALITY-001: Table grants for materiality

GRANT SELECT, INSERT, UPDATE, DELETE ON public.materiality_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materiality_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materiality_benchmarks TO authenticated;
GRANT SELECT, INSERT ON public.materiality_calculations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materiality_comments TO authenticated;
GRANT SELECT, INSERT ON public.materiality_activity TO authenticated;

GRANT ALL ON public.materiality_packages TO service_role;
GRANT ALL ON public.materiality_versions TO service_role;
GRANT ALL ON public.materiality_benchmarks TO service_role;
GRANT ALL ON public.materiality_calculations TO service_role;
GRANT ALL ON public.materiality_comments TO service_role;
GRANT ALL ON public.materiality_activity TO service_role;
