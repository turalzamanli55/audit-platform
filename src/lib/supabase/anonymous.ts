import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";
import type { Database } from "@/types/supabase";

let anonymousClient: SupabaseClient<Database> | null = null;

/**
 * Anonymous Supabase client — anon key without session persistence.
 * For server-side operations that do not require user context.
 */
export function createAnonymousClient(): SupabaseClient<Database> {
  if (anonymousClient) return anonymousClient;

  const { url, anonKey } = getSupabasePublicConfig();

  anonymousClient = createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return anonymousClient;
}
