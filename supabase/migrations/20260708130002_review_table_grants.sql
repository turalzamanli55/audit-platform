-- FEATURE-REVIEW-001: Table grants for review module

GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_comments TO authenticated;
GRANT SELECT, INSERT ON public.review_activity TO authenticated;

GRANT ALL ON public.review_packages TO service_role;
GRANT ALL ON public.review_items TO service_role;
GRANT ALL ON public.review_versions TO service_role;
GRANT ALL ON public.review_comments TO service_role;
GRANT ALL ON public.review_activity TO service_role;
