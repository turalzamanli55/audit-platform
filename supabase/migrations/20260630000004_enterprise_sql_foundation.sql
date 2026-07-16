-- ESFE-001: Enterprise SQL Foundation Layer
-- Shared reusable infrastructure ONLY — no feature/domain business tables or logic.
-- Depends on: extensions/common helpers + foundation tables (memberships/roles/permissions).
-- Must run before any migration that references shared policy helpers
-- (e.g. user_can_access_workspace used by FS mapping / rendering / IFRS notes).

-- ---------------------------------------------------------------------------
-- Identity / actor helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_user_id();
$$;

-- ---------------------------------------------------------------------------
-- Tenant / workspace helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_workspace_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.workspace_id', true),
      current_setting('app.workspace_id', true)
    ),
    ''
  )::uuid;
$$;

CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.organization_id', true),
      current_setting('app.organization_id', true)
    ),
    ''
  )::uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_member(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.user_belongs_to_workspace(target_workspace_id);
$$;

CREATE OR REPLACE FUNCTION public.user_can_access_workspace(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR public.user_belongs_to_workspace(target_workspace_id);
$$;

CREATE OR REPLACE FUNCTION public.user_can_access_organization(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR public.user_belongs_to_organization(target_organization_id);
$$;

CREATE OR REPLACE FUNCTION public.is_organization_member(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.user_belongs_to_organization(target_organization_id);
$$;

-- ---------------------------------------------------------------------------
-- Permission helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_permission(permission_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR EXISTS (
      SELECT 1
      FROM public.memberships m
      JOIN public.role_permissions rp
        ON rp.role_id = m.role_id
       AND rp.deleted_at IS NULL
       AND rp.status = 'active'
      JOIN public.permissions p
        ON p.id = rp.permission_id
       AND p.deleted_at IS NULL
       AND p.status = 'active'
      WHERE m.user_id = public.auth_user_id()
        AND m.deleted_at IS NULL
        AND m.status = 'active'
        AND lower(p.code::text) = lower(permission_code)
    );
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_permission(
  target_workspace_id uuid,
  permission_code text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR (
      public.user_can_access_workspace(target_workspace_id)
      AND EXISTS (
        SELECT 1
        FROM public.memberships m
        JOIN public.role_permissions rp
          ON rp.role_id = m.role_id
         AND rp.deleted_at IS NULL
         AND rp.status = 'active'
        JOIN public.permissions p
          ON p.id = rp.permission_id
         AND p.deleted_at IS NULL
         AND p.status = 'active'
        WHERE m.user_id = public.auth_user_id()
          AND m.workspace_id = target_workspace_id
          AND m.deleted_at IS NULL
          AND m.status = 'active'
          AND lower(p.code::text) = lower(permission_code)
      )
    );
$$;

-- ---------------------------------------------------------------------------
-- Soft-delete helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.deleted_at = COALESCE(NEW.deleted_at, public.utc_now());
  NEW.deleted_by = COALESCE(NEW.deleted_by, public.auth_user_id());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.deleted_at = NULL;
  NEW.deleted_by = NULL;
  NEW.updated_at = public.utc_now();
  NEW.updated_by = public.auth_user_id();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_active_record(row_deleted_at timestamptz, row_status text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT public.is_not_deleted(row_deleted_at)
    AND (row_status IS NULL OR row_status = 'active');
$$;

-- ---------------------------------------------------------------------------
-- JSON helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.jsonb_merge(base jsonb, patch jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(base, '{}'::jsonb) || COALESCE(patch, '{}'::jsonb);
$$;

CREATE OR REPLACE FUNCTION public.jsonb_is_object(value jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_typeof(COALESCE(value, 'null'::jsonb)) = 'object';
$$;

-- ---------------------------------------------------------------------------
-- Validation helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_nonempty_text(value text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT value IS NOT NULL AND char_length(trim(value)) > 0;
$$;

CREATE OR REPLACE FUNCTION public.is_valid_uuid(value text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT value ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
$$;

-- ---------------------------------------------------------------------------
-- Search helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.simple_search_vector(value text)
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT to_tsvector('simple', COALESCE(value, ''));
$$;

-- ---------------------------------------------------------------------------
-- Storage helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.storage_object_belongs_to_workspace(
  object_name text,
  target_workspace_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT target_workspace_id IS NOT NULL
    AND object_name LIKE (target_workspace_id::text || '/%');
$$;

-- ---------------------------------------------------------------------------
-- Policy composition helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.policy_workspace_read(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR public.user_can_access_workspace(target_workspace_id);
$$;

CREATE OR REPLACE FUNCTION public.policy_workspace_write(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_service_role()
    OR public.user_can_access_workspace(target_workspace_id);
$$;

-- ---------------------------------------------------------------------------
-- Grants — helpers callable by authenticated roles
-- ---------------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.current_user_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_workspace_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_organization_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_can_access_workspace(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_can_access_organization(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_organization_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_permission(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_workspace_permission(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_active_record(timestamptz, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.jsonb_merge(jsonb, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.jsonb_is_object(jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_nonempty_text(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_valid_uuid(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.simple_search_vector(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.storage_object_belongs_to_workspace(text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.policy_workspace_read(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.policy_workspace_write(uuid) TO authenticated, service_role;
