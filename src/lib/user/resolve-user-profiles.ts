import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type UserProfileSummary = {
  userId: string;
  displayName: string;
  email: string;
};

function readMetadataString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function mapAuthUserToProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): UserProfileSummary {
  const metadata = user.user_metadata ?? {};
  return {
    userId: user.id,
    email: user.email ?? "",
    displayName:
      readMetadataString(metadata.full_name) ??
      readMetadataString(metadata.name) ??
      user.email ??
      user.id,
  };
}

export async function resolveUserProfiles(
  userIds: string[],
): Promise<Map<string, UserProfileSummary>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const profiles = new Map<string, UserProfileSummary>();

  if (uniqueIds.length === 0) {
    return profiles;
  }

  const admin = createAdminClient();
  const results = await Promise.all(
    uniqueIds.map(async (userId) => {
      const { data, error } = await admin.auth.admin.getUserById(userId);
      if (error || !data.user) {
        return null;
      }
      return mapAuthUserToProfile(data.user);
    }),
  );

  for (const profile of results) {
    if (profile) {
      profiles.set(profile.userId, profile);
    }
  }

  return profiles;
}
