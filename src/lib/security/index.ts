const SERVER_ONLY_MODULES = [
  "@/lib/supabase/admin",
  "@/lib/supabase/service",
  "@/lib/supabase/anonymous",
  "@/lib/env",
] as const;

export function isServerRuntime(): boolean {
  return typeof window === "undefined";
}

export function assertServerRuntime(moduleName: string): void {
  if (!isServerRuntime()) {
    throw new Error(`[security] ${moduleName} cannot be imported in the browser`);
  }
}

export function assertPublicEnvKey(key: string): void {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    throw new Error(`[security] ${key} must not be exposed to the browser`);
  }
}

export function isServiceRoleKey(key: string): boolean {
  return key === "SUPABASE_SERVICE_ROLE_KEY";
}

export { SERVER_ONLY_MODULES };
