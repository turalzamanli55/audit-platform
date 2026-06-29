import type { AuthSession } from "@/types/auth";

/**
 * Session architecture — server-authoritative model.
 * Supabase Auth integration will populate this from validated tokens.
 */

export const UNAUTHENTICATED_SESSION: AuthSession = {
  status: "unauthenticated",
  user: null,
  expiresAt: null,
};

export const LOADING_SESSION: AuthSession = {
  status: "loading",
  user: null,
  expiresAt: null,
};

export function isSessionAuthenticated(session: AuthSession): boolean {
  return session.status === "authenticated" && session.user !== null;
}

export function isSessionExpired(session: AuthSession): boolean {
  if (!session.expiresAt) return false;
  return new Date(session.expiresAt).getTime() <= Date.now();
}

export function createGuestSession(): AuthSession {
  return { ...UNAUTHENTICATED_SESSION };
}

/**
 * Placeholder for server-side session resolution.
 * Will be implemented when Supabase Auth is integrated.
 */
export async function getServerSession(): Promise<AuthSession> {
  return UNAUTHENTICATED_SESSION;
}
