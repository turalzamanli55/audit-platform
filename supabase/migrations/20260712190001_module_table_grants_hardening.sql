-- Infrastructure hardening: backfill missing table grants for modules created
-- after 20260630000003 schema-wide GRANT, and lock default privileges so
-- future public-schema objects inherit authenticated/service_role access.
-- anon remains without table access (intentional).

-- =====================================================
-- Completion
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completion_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completion_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completion_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completion_comments TO authenticated;
GRANT SELECT, INSERT ON public.completion_activity TO authenticated;

GRANT ALL ON public.completion_packages TO service_role;
GRANT ALL ON public.completion_items TO service_role;
GRANT ALL ON public.completion_versions TO service_role;
GRANT ALL ON public.completion_comments TO service_role;
GRANT ALL ON public.completion_activity TO service_role;

-- =====================================================
-- Reporting
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reporting_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_comments TO authenticated;
GRANT SELECT, INSERT ON public.report_activity TO authenticated;

GRANT ALL ON public.reporting_packages TO service_role;
GRANT ALL ON public.report_sections TO service_role;
GRANT ALL ON public.report_versions TO service_role;
GRANT ALL ON public.report_comments TO service_role;
GRANT ALL ON public.report_activity TO service_role;

-- =====================================================
-- Opinion
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opinion_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opinion_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opinion_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opinion_comments TO authenticated;
GRANT SELECT, INSERT ON public.opinion_activity TO authenticated;

GRANT ALL ON public.opinion_packages TO service_role;
GRANT ALL ON public.opinion_sections TO service_role;
GRANT ALL ON public.opinion_versions TO service_role;
GRANT ALL ON public.opinion_comments TO service_role;
GRANT ALL ON public.opinion_activity TO service_role;

-- =====================================================
-- Financial Statements
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_lines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_values TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_comments TO authenticated;
GRANT SELECT, INSERT ON public.financial_statement_activity TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_statement_exports TO authenticated;

GRANT ALL ON public.financial_statement_packages TO service_role;
GRANT ALL ON public.financial_statement_sections TO service_role;
GRANT ALL ON public.financial_statement_lines TO service_role;
GRANT ALL ON public.financial_statement_values TO service_role;
GRANT ALL ON public.financial_statement_versions TO service_role;
GRANT ALL ON public.financial_statement_comments TO service_role;
GRANT ALL ON public.financial_statement_activity TO service_role;
GRANT ALL ON public.financial_statement_exports TO service_role;

-- =====================================================
-- Trial Balance
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_lines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_adjustments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_mappings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_periods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_balance_versions TO authenticated;
GRANT SELECT, INSERT ON public.trial_balance_activity TO authenticated;

GRANT ALL ON public.trial_balance_packages TO service_role;
GRANT ALL ON public.trial_balance_lines TO service_role;
GRANT ALL ON public.trial_balance_adjustments TO service_role;
GRANT ALL ON public.trial_balance_mappings TO service_role;
GRANT ALL ON public.trial_balance_periods TO service_role;
GRANT ALL ON public.trial_balance_versions TO service_role;
GRANT ALL ON public.trial_balance_activity TO service_role;

-- =====================================================
-- Schema USAGE + existing sequences/functions/views
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- Default privileges for future objects created by migrator
-- =====================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO service_role;
