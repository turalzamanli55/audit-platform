import "server-only";

import type { EngagementMember } from "@/repositories/engagement/engagement-repository";
import type { EngagementMemberRole } from "@/types/engagement";
import { resolveUserProfiles } from "@/lib/user/resolve-user-profiles";

export type EngagementMemberView = {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  memberRole: EngagementMemberRole;
  joinedAt: string;
};

export async function enrichEngagementMembers(
  members: EngagementMember[],
): Promise<EngagementMemberView[]> {
  const profiles = await resolveUserProfiles(members.map((member) => member.user_id));

  return members.map((member) => {
    const profile = profiles.get(member.user_id);
    return {
      id: member.id,
      userId: member.user_id,
      displayName: profile?.displayName ?? member.user_id,
      email: profile?.email ?? "",
      memberRole: member.member_role,
      joinedAt: member.created_at,
    };
  });
}
