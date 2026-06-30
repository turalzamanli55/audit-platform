/**
 * Supabase client factory registry.
 * Import the specific client factory for your runtime context.
 */

export { createBrowserClient } from "./browser";
export { createServerClient } from "./server";
export {
  createMiddlewareClient,
  refreshSupabaseSession,
  type MiddlewareSupabaseResult,
} from "./middleware";
export { createAdminClient } from "./admin";
export { createServiceClient } from "./service";
export { createAnonymousClient } from "./anonymous";
export {
  getSupabasePublicConfig,
  getSupabaseServerConfig,
  type SupabasePublicConfig,
  type SupabaseServerConfig,
} from "./config";
