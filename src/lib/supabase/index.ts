/**
 * Browser-safe Supabase exports.
 * Server, admin, and service clients must be imported from their dedicated modules.
 */
export { createBrowserClient } from "./browser";
export {
  getSupabasePublicConfig,
  type SupabasePublicConfig,
  type SupabaseServerConfig,
} from "./config";
