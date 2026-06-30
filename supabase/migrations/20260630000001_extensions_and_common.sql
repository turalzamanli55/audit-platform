-- Extensions and common database foundation
-- Sprint 2B — Enterprise Database Foundation

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.record_status AS ENUM (
  'active',
  'inactive',
  'archived',
  'suspended'
);

CREATE TYPE public.role_scope AS ENUM (
  'platform',
  'organization',
  'workspace'
);

CREATE TYPE public.permission_scope AS ENUM (
  'platform',
  'organization',
  'workspace',
  'company'
);

CREATE TYPE public.membership_scope AS ENUM (
  'organization',
  'workspace'
);

-- ---------------------------------------------------------------------------
-- Timestamp helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.utc_now()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT timezone('utc', now());
$$;

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = public.utc_now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Optimistic locking — version increment
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_row_version()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.version = COALESCE(NEW.version, 1);
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    NEW.version = OLD.version + 1;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Audit actor helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.auth_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, public.auth_user_id());
    NEW.updated_by = COALESCE(NEW.updated_by, public.auth_user_id());
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by = public.auth_user_id();
  END IF;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Soft delete helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_not_deleted(row_deleted_at timestamptz)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT row_deleted_at IS NULL;
$$;

-- ---------------------------------------------------------------------------
-- Service role detection
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    current_setting('role', true)
  ) = 'service_role';
$$;

-- ---------------------------------------------------------------------------
-- Default tenant settings templates
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.default_organization_settings()
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'locale', 'en',
    'timezone', 'UTC',
    'date_format', 'YYYY-MM-DD',
    'currency_display', 'symbol',
    'notifications_enabled', true,
    'security_mfa_required', false
  );
$$;

CREATE OR REPLACE FUNCTION public.default_workspace_settings()
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'locale', 'en',
    'timezone', 'UTC',
    'fiscal_year_start_month', 1,
    'default_engagement_visibility', 'members'
  );
$$;

CREATE OR REPLACE FUNCTION public.default_company_settings()
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'reporting_currency', 'USD',
    'functional_currency', 'USD',
    'industry_code', null
  );
$$;
