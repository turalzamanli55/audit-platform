import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import {
  PLATFORM_OWNER_METADATA_KEY,
  PLATFORM_OWNER_METADATA_VALUE,
} from "@/lib/platform-bootstrap/constants";

/**
 * The Platform Owner exists ABOVE all tenants and never has a membership, so
 * ownership is asserted through immutable auth app_metadata set at bootstrap
 * (not through tenant roles). Deny by default.
 */
export async function isPlatformOwner(): Promise<boolean> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const metadata = user.app_metadata as Record<string, unknown> | null | undefined;
  return metadata?.[PLATFORM_OWNER_METADATA_KEY] === PLATFORM_OWNER_METADATA_VALUE;
}

export type PlatformOwnerIdentity = {
  userId: string;
  email: string | null;
};

/** Returns the authenticated Platform Owner identity, or null if not the owner. */
export async function getPlatformOwnerIdentity(): Promise<PlatformOwnerIdentity | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const metadata = user.app_metadata as Record<string, unknown> | null | undefined;
  if (metadata?.[PLATFORM_OWNER_METADATA_KEY] !== PLATFORM_OWNER_METADATA_VALUE) {
    return null;
  }

  return { userId: user.id, email: user.email ?? null };
}
