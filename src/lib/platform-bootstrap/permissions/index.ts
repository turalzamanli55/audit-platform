import type { BootstrapClient, BootstrapStep } from "../types";
import { PLATFORM_PERMISSION_SEEDS } from "../constants";

/**
 * Ensures the platform-scoped permission catalog exists. Idempotent: inserts
 * only permissions that are missing so it can run on every startup safely.
 */
export async function ensurePlatformPermissions(client: BootstrapClient): Promise<BootstrapStep> {
  const codes = PLATFORM_PERMISSION_SEEDS.map((p) => p.code);

  const { data: existing, error: readError } = await client
    .from("permissions")
    .select("code")
    .in("code", codes);

  if (readError) {
    return {
      key: "permissions",
      label: "Platform Permissions",
      status: "failed",
      detail: `Failed to read permissions: ${readError.message}`,
    };
  }

  const existingCodes = new Set((existing ?? []).map((row) => row.code));
  const missing = PLATFORM_PERMISSION_SEEDS.filter((p) => !existingCodes.has(p.code));

  if (missing.length === 0) {
    return {
      key: "permissions",
      label: "Platform Permissions",
      status: "verified",
      detail: `${codes.length} platform permissions present`,
    };
  }

  const { error: insertError } = await client.from("permissions").insert(
    missing.map((permission) => ({
      code: permission.code,
      name: permission.name,
      description: permission.description,
      scope: "platform" as const,
      resource: permission.resource,
    })),
  );

  if (insertError) {
    return {
      key: "permissions",
      label: "Platform Permissions",
      status: "failed",
      detail: `Failed to seed permissions: ${insertError.message}`,
    };
  }

  return {
    key: "permissions",
    label: "Platform Permissions",
    status: "created",
    detail: `Seeded ${missing.length} platform permissions`,
  };
}

/** Counts how many of the required platform permissions currently exist. */
export async function countPlatformPermissions(client: BootstrapClient): Promise<number> {
  const codes = PLATFORM_PERMISSION_SEEDS.map((p) => p.code);
  const { data, error } = await client.from("permissions").select("code").in("code", codes);
  if (error) return 0;
  return (data ?? []).length;
}
