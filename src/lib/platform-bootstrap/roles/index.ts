import type { BootstrapClient, BootstrapStep } from "../types";
import { PLATFORM_ROLE_SEEDS } from "../constants";

const PLATFORM_OWNER_SLUG = "platform_owner";

/**
 * Ensures platform-scoped system roles exist (organization_id IS NULL) and that
 * the Platform Owner role is granted every permission. Idempotent.
 */
export async function ensurePlatformRoles(client: BootstrapClient): Promise<BootstrapStep> {
  const slugs = PLATFORM_ROLE_SEEDS.map((r) => r.slug);

  const { data: existing, error: readError } = await client
    .from("roles")
    .select("slug")
    .is("organization_id", null)
    .in("slug", slugs);

  if (readError) {
    return {
      key: "roles",
      label: "Platform Roles",
      status: "failed",
      detail: `Failed to read roles: ${readError.message}`,
    };
  }

  const existingSlugs = new Set((existing ?? []).map((row) => String(row.slug)));
  const missing = PLATFORM_ROLE_SEEDS.filter((r) => !existingSlugs.has(r.slug));

  if (missing.length > 0) {
    const { error: insertError } = await client.from("roles").insert(
      missing.map((role) => ({
        slug: role.slug,
        name: role.name,
        description: role.description,
        scope: "platform" as const,
        is_system: true,
        organization_id: null,
      })),
    );

    if (insertError) {
      return {
        key: "roles",
        label: "Platform Roles",
        status: "failed",
        detail: `Failed to seed roles: ${insertError.message}`,
      };
    }
  }

  const grantResult = await grantAllPermissionsToOwner(client);
  if (!grantResult.ok) {
    return {
      key: "roles",
      label: "Platform Roles",
      status: "failed",
      detail: grantResult.detail,
    };
  }

  return {
    key: "roles",
    label: "Platform Roles",
    status: missing.length > 0 ? "created" : "verified",
    detail:
      missing.length > 0
        ? `Seeded ${missing.length} platform roles · owner granted ${grantResult.granted} permissions`
        : `${slugs.length} platform roles present · owner grants verified`,
  };
}

/** Grants every existing permission to the platform_owner role (idempotent). */
async function grantAllPermissionsToOwner(
  client: BootstrapClient,
): Promise<{ ok: boolean; granted: number; detail: string }> {
  const { data: ownerRole, error: roleError } = await client
    .from("roles")
    .select("id")
    .is("organization_id", null)
    .eq("slug", PLATFORM_OWNER_SLUG)
    .maybeSingle();

  if (roleError || !ownerRole) {
    return { ok: false, granted: 0, detail: `platform_owner role not found: ${roleError?.message ?? "missing"}` };
  }

  const { data: permissions, error: permError } = await client.from("permissions").select("id");
  if (permError) {
    return { ok: false, granted: 0, detail: `Failed to read permissions: ${permError.message}` };
  }

  const { data: existingLinks, error: linkError } = await client
    .from("role_permissions")
    .select("permission_id")
    .eq("role_id", ownerRole.id);

  if (linkError) {
    return { ok: false, granted: 0, detail: `Failed to read role_permissions: ${linkError.message}` };
  }

  const linkedIds = new Set((existingLinks ?? []).map((row) => row.permission_id));
  const missingLinks = (permissions ?? [])
    .filter((permission) => !linkedIds.has(permission.id))
    .map((permission) => ({ role_id: ownerRole.id, permission_id: permission.id }));

  if (missingLinks.length === 0) {
    return { ok: true, granted: 0, detail: "all permissions already granted" };
  }

  const { error: grantError } = await client.from("role_permissions").insert(missingLinks);
  if (grantError) {
    return { ok: false, granted: 0, detail: `Failed to grant permissions: ${grantError.message}` };
  }

  return { ok: true, granted: missingLinks.length, detail: "granted" };
}

/** Counts how many platform system roles currently exist. */
export async function countPlatformRoles(client: BootstrapClient): Promise<number> {
  const slugs = PLATFORM_ROLE_SEEDS.map((r) => r.slug);
  const { data, error } = await client
    .from("roles")
    .select("slug")
    .is("organization_id", null)
    .in("slug", slugs);
  if (error) return 0;
  return (data ?? []).length;
}
