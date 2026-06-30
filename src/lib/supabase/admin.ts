import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "./config";
import type { Database } from "@/types/supabase";

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Admin Supabase client — service role key.
 * Server-only. Never import in Client Components or browser bundles.
 */
export function createAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient;

  const { url, serviceRoleKey } = getSupabaseServerConfig();

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
