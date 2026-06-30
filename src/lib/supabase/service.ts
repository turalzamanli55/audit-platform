import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "./admin";
import type { Database } from "@/types/supabase";

/**
 * Service Supabase client — privileged server operations.
 * Alias for admin client with explicit service semantics.
 */
export function createServiceClient(): SupabaseClient<Database> {
  return createAdminClient();
}
