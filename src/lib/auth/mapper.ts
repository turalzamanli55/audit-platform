import type { User } from "@supabase/supabase-js";
import type { Permission, Role, SessionUser } from "@/types/auth";

type SessionMappingOptions = {
  locale?: string;
  organizationId?: string;
  workspaceId?: string;
  roleSlugs?: string[];
  permissionCodes?: string[];
  hasOrganization?: boolean;
};

export function mapSupabaseUserToSessionUser(
  user: User,
  options: SessionMappingOptions = {},
): SessionUser {
  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};
  const locale = options.locale ?? readMetadataString(metadata.locale) ?? "az";

  const roleSlugs = options.roleSlugs ?? extractRoleSlugs(appMetadata);
  const permissionCodes = options.permissionCodes ?? extractPermissionCodes(appMetadata);

  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      readMetadataString(metadata.full_name) ??
      readMetadataString(metadata.name) ??
      user.email ??
      user.id,
    organizationId:
      options.organizationId ??
      readMetadataString(appMetadata.organization_id) ??
      "",
    workspaceId: options.workspaceId ?? readMetadataString(appMetadata.workspace_id) ?? "",
    roles: roleSlugs as Role[],
    roleSlugs,
    permissions: extractLegacyPermissions(appMetadata),
    permissionCodes,
    hasOrganization:
      options.hasOrganization ??
      Boolean(options.organizationId ?? readMetadataString(appMetadata.organization_id)),
    locale,
    timezone: readMetadataString(metadata.timezone) ?? "UTC",
  };
}

function readMetadataString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function extractRoleSlugs(appMetadata: Record<string, unknown>): string[] {
  const roles = appMetadata.role_slugs ?? appMetadata.roles;
  if (!Array.isArray(roles)) return [];
  return roles.filter((role): role is string => typeof role === "string");
}

function extractPermissionCodes(appMetadata: Record<string, unknown>): string[] {
  const permissions = appMetadata.permission_codes;
  if (!Array.isArray(permissions)) return [];
  return permissions.filter((code): code is string => typeof code === "string");
}

function extractLegacyPermissions(appMetadata: Record<string, unknown>): Permission[] {
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
