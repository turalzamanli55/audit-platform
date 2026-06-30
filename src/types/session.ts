import type { AuthSession } from "./auth";

export type SupabaseSession = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  userId: string | null;
};

export function fromAuthSession(session: AuthSession): SupabaseSession {
  return {
    accessToken: null,
    refreshToken: null,
    expiresAt: session.expiresAt,
    userId: session.user?.id ?? null,
  };
}
