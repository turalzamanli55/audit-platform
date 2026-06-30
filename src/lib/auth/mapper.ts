import type { User } from "@supabase/supabase-js";
import type { Permission, Role, SessionUser } from "@/types/auth";

export function mapSupabaseUserToSessionUser(user: User, locale = "az"): SessionUser {
  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      user.email ||
      user.id,
    organizationId:
      (typeof appMetadata.organization_id === "string" && appMetadata.organization_id) || "",
    roles: extractRoles(appMetadata),
    permissions: extractPermissions(appMetadata),
    locale: (typeof metadata.locale === "string" && metadata.locale) || locale,
    timezone: (typeof metadata.timezone === "string" && metadata.timezone) || "UTC",
  };
}

function extractRoles(appMetadata: Record<string, unknown>): Role[] {
  const roles = appMetadata.roles;
  if (!Array.isArray(roles)) return [];
  return roles.filter((role): role is Role => typeof role === "string");
}

function extractPermissions(appMetadata: Record<string, unknown>): Permission[] {
  const permissions = appMetadata.permissions;
  if (!Array.isArray(permissions)) return [];
  return permissions.filter(
    (entry): entry is Permission =>
      typeof entry === "object" &&
      entry !== null &&
      "capability" in entry &&
      "scope" in entry,
  );
}
