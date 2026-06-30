import type { AuthSession } from "@/types/auth";
import { UNAUTHENTICATED_SESSION } from "./constants";

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
