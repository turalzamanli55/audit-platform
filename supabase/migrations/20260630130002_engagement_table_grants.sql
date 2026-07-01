-- P0 recovery: grant table privileges on engagement tables created after
-- 20260630000003_rls_policies.sql (GRANT ON ALL TABLES). RLS unchanged.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_activity TO authenticated;

GRANT ALL ON public.engagements TO service_role;
GRANT ALL ON public.engagement_members TO service_role;
GRANT ALL ON public.engagement_activity TO service_role;
