-- ECP Sprint 4C: Platform Session Management
-- Exposes auth.sessions to the Platform Owner console via SECURITY DEFINER
-- functions. The auth schema is not reachable through PostgREST, so the
-- service role reads sessions and forces logout through these functions only.

-- ---------------------------------------------------------------------------
-- platform_user_sessions — list active sessions for a user (Platform Owner)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.platform_user_sessions(target_user uuid)
RETURNS TABLE (
  session_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  not_after timestamptz,
  user_agent text,
  ip text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
    s.id AS session_id,
    s.created_at,
    s.updated_at,
    s.not_after,
    s.user_agent,
    host(s.ip)::text AS ip
  FROM auth.sessions s
  WHERE s.user_id = target_user
  ORDER BY s.updated_at DESC NULLS LAST;
$$;

-- ---------------------------------------------------------------------------
-- platform_force_user_logout — revoke every session for a user
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.platform_force_user_logout(target_user uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  revoked integer;
BEGIN
  DELETE FROM auth.sessions WHERE user_id = target_user;
  GET DIAGNOSTICS revoked = ROW_COUNT;
  RETURN revoked;
END;
$$;

-- ---------------------------------------------------------------------------
-- platform_revoke_session — revoke a single session by id
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.platform_revoke_session(target_session uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  revoked integer;
BEGIN
  DELETE FROM auth.sessions WHERE id = target_session;
  GET DIAGNOSTICS revoked = ROW_COUNT;
  RETURN revoked;
END;
$$;

-- Restrict execution to the service role (Platform Owner server actions only).
REVOKE ALL ON FUNCTION public.platform_user_sessions(uuid) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.platform_force_user_logout(uuid) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.platform_revoke_session(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.platform_user_sessions(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.platform_force_user_logout(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.platform_revoke_session(uuid) TO service_role;
