import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { AuthSession } from "@/types/auth";
import { UNAUTHENTICATED_SESSION } from "./constants";
import { mapSupabaseUserToSessionUser } from "./mapper";

export async function getCurrentUser(locale = "az") {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return mapSupabaseUserToSessionUser(user, locale);
}

export async function getSupabaseAuthSession(): Promise<AuthSession> {
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

  return {
    status: "authenticated",
    user: mapSupabaseUserToSessionUser(user),
    expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
  };
}
