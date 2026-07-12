export { logger, createLogger, type LogLevel, type LogContext, type LogEntry } from "@/lib/logger";
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  InfrastructureError,
  InternalServerError,
  isAppError,
  getUserSafeMessage,
  normalizeError,
  handleError,
  toActionError,
  type ErrorCode,
} from "@/lib/errors";
export * from "@/lib/auth";
export { getServerSession, getCurrentUser, getTenantContext } from "@/lib/auth/server";
export { createBrowserClient, getSupabasePublicConfig } from "@/lib/supabase";
export { validatePublicEnv, getPublicEnv, getRuntimeEnv, isDevelopment, isProduction } from "@/lib/env";
export {
  createPublicAction,
  createAuthenticatedAction,
  createAdminAction,
  createOrganizationAction,
  createWorkspaceAction,
  type ActionResult,
} from "@/lib/actions";
export * from "@/lib/security";
export {
  bootstrapAiFoundation,
  bootstrapLlmPlatform,
  AiCopilotCore,
  LlmPlatform,
  AI_FOUNDATION_VERSION,
  LLM_PLATFORM_VERSION,
} from "@/lib/ai";
