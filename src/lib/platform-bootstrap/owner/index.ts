import type { BootstrapClient, BootstrapStep } from "../types";
import {
  PLATFORM_OWNER_EMAIL,
  PLATFORM_OWNER_METADATA_KEY,
  PLATFORM_OWNER_METADATA_VALUE,
} from "../constants";

export type OwnerProvisionResult = {
  step: BootstrapStep;
  ownerUserId: string | null;
  ownerEmail: string;
};

/**
 * Finds the Platform Owner auth user by the canonical owner email.
 * The Platform Owner is NOT a tenant user and never has a membership row.
 */
async function findOwnerUserId(client: BootstrapClient): Promise<string | null> {
  const perPage = 200;
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    const match = data.users.find(
      (user) => user.email?.toLowerCase() === PLATFORM_OWNER_EMAIL.toLowerCase(),
    );
    if (match) return match.id;
    if (data.users.length < perPage) break;
  }
  return null;
}

/**
 * Ensures exactly ONE Platform Owner exists. Creates it on first run using the
 * password supplied from the environment; never recreates it once present.
 * The owner is flagged via immutable app_metadata so it can be authorized above
 * all tenants without any membership.
 */
export async function ensurePlatformOwner(
  client: BootstrapClient,
  password: string | undefined,
): Promise<OwnerProvisionResult> {
  let existingId: string | null;
  try {
    existingId = await findOwnerUserId(client);
  } catch (error) {
    return {
      step: {
        key: "owner",
        label: "Platform Owner",
        status: "failed",
        detail: `Failed to list users: ${(error as Error).message}`,
      },
      ownerUserId: null,
      ownerEmail: PLATFORM_OWNER_EMAIL,
    };
  }

  if (existingId) {
    // Re-assert the platform-owner marker (idempotent), but never touch the password.
    await client.auth.admin.updateUserById(existingId, {
      app_metadata: { [PLATFORM_OWNER_METADATA_KEY]: PLATFORM_OWNER_METADATA_VALUE },
    });
    return {
      step: {
        key: "owner",
        label: "Platform Owner",
        status: "verified",
        detail: `Platform Owner already provisioned (${PLATFORM_OWNER_EMAIL})`,
      },
      ownerUserId: existingId,
      ownerEmail: PLATFORM_OWNER_EMAIL,
    };
  }

  if (!password || password.trim().length < 8) {
    return {
      step: {
        key: "owner",
        label: "Platform Owner",
        status: "failed",
        detail:
          "BOOTSTRAP_OWNER_PASSWORD is missing or too short (>= 8 chars). Set it in .env.local.",
      },
      ownerUserId: null,
      ownerEmail: PLATFORM_OWNER_EMAIL,
    };
  }

  const { data, error } = await client.auth.admin.createUser({
    email: PLATFORM_OWNER_EMAIL,
    password,
    email_confirm: true,
    app_metadata: { [PLATFORM_OWNER_METADATA_KEY]: PLATFORM_OWNER_METADATA_VALUE },
    user_metadata: { full_name: "Platform Owner", is_platform_owner: true },
  });

  if (error || !data.user) {
    return {
      step: {
        key: "owner",
        label: "Platform Owner",
        status: "failed",
        detail: `Failed to create Platform Owner: ${error?.message ?? "unknown error"}`,
      },
      ownerUserId: null,
      ownerEmail: PLATFORM_OWNER_EMAIL,
    };
  }

  return {
    step: {
      key: "owner",
      label: "Platform Owner",
      status: "created",
      detail: `Created Platform Owner (${PLATFORM_OWNER_EMAIL})`,
    },
    ownerUserId: data.user.id,
    ownerEmail: PLATFORM_OWNER_EMAIL,
  };
}

/** Returns the Platform Owner user id if provisioned, else null. */
export async function getPlatformOwnerUserId(client: BootstrapClient): Promise<string | null> {
  try {
    return await findOwnerUserId(client);
  } catch {
    return null;
  }
}
