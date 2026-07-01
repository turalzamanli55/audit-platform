-- FEATURE-001A: Company foundation — slug lookup and legal-name uniqueness within workspace.

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS slug citext;

UPDATE public.companies
SET slug = lower(
  regexp_replace(
    regexp_replace(trim(COALESCE(legal_name, name)), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-+|-+$)',
    '',
    'g'
  )
)
WHERE slug IS NULL;

ALTER TABLE public.companies
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS companies_workspace_slug_active_uidx
  ON public.companies (workspace_id, slug)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS companies_workspace_legal_name_active_uidx
  ON public.companies (workspace_id, lower(trim(COALESCE(legal_name, name))))
  WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.default_company_settings()
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'reporting_framework', 'IFRS',
    'functional_currency', 'USD',
    'presentation_currency', null,
    'fiscal_year_end_month', 12,
    'fiscal_year_end_day', 31,
    'jurisdiction', '',
    'industry_classification', 'general',
    'entity_type', 'standalone',
    'parent_company_id', null,
    'registered_address', null,
    'operating_address', null,
    'primary_finance_contact', null,
    'external_auditor_contact', null,
    'branding', jsonb_build_object(
      'trade_name', null,
      'logo_url', null
    ),
    'preferences', jsonb_build_object(
      'default_locale', null,
      'data_import_source', null,
      'rounding_convention', null
    ),
    'validation', jsonb_build_object(
      'schema_version', 1,
      'validated_at', null,
      'validated_by', null
    )
  );
$$;
