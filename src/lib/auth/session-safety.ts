import type { SessionUser } from "@/types/auth";

export function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

export function mergePermissionCodes(...sources: unknown[]): string[] {
  const merged = new Set<string>();
  for (const source of sources) {
    for (const code of coerceStringArray(source)) {
      merged.add(code);
    }
  }
  return [...merged].sort();
}

export function hasMergedPermissionCode(
  sources: unknown[],
  required: string | string[],
): boolean {
  const codes = mergePermissionCodes(...sources);
  const requiredCodes = Array.isArray(required) ? required : [required];
  return requiredCodes.some((code) => codes.includes(code));
}

export function createEmptySessionUser(authUser: {
  id: string;
  email?: string | null;
}): SessionUser {
  return {
    id: authUser.id,
    email: authUser.email ?? "",
    displayName: authUser.email ?? authUser.id,
    organizationId: "",
    workspaceId: "",
    roles: [],
    roleSlugs: [],
    permissions: [],
    permissionCodes: [],
    hasOrganization: false,
    locale: "az",
    timezone: "UTC",
  };
}
