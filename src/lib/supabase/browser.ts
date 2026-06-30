import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";
import type { Database } from "@/types/supabase";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client — uses anon key with cookie-based session persistence.
 * Safe for Client Components only.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const { url, anonKey } = getSupabasePublicConfig();
  browserClient = createSupabaseBrowserClient<Database>(url, anonKey);

  return browserClient;
}
