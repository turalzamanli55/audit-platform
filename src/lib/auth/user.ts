import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { AuthSession } from "@/types/auth";
import { UNAUTHENTICATED_SESSION } from "./constants";
import { mapSupabaseUserToSessionUser } from "./mapper";
import { resolveAuthenticatedUser } from "./resolve-user";

export async function getCurrentUser(locale = "az") {
  return resolveAuthenticatedUser(locale);
}

export async function getSupabaseAuthSession(locale = "az"): Promise<AuthSession> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return UNAUTHENTICATED_SESSION;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const sessionUser = await resolveAuthenticatedUser(locale);

  return {
    status: "authenticated",
    user: sessionUser ?? mapSupabaseUserToSessionUser(user, { locale }),
    expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
  };
}
