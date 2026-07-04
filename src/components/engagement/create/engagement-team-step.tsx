"use client";

import { WorkspacePanel } from "@/components/workspace";
import { Avatar } from "@/components/ui/avatar";
import { ENGAGEMENT_MEMBER_ROLES } from "@/constants/engagement";
import type {
  EngagementWizardDraft,
  EngagementWizardTeamMember,
} from "@/lib/engagement/engagement-wizard-draft";
import { isValidTeamMemberRole } from "@/lib/engagement/engagement-wizard-draft";
import type { WorkspaceMemberDirectoryItem } from "@/lib/engagement/load-workspace-member-directory";
import type { Dictionary } from "@/i18n/get-dictionary";

type EngagementTeamStepProps = {
  draft: EngagementWizardDraft;
  members: WorkspaceMemberDirectoryItem[];
  labels: Dictionary["engagements"]["create"];
  onChange: (teamMembers: EngagementWizardTeamMember[]) => void;
};

function findMemberRole(
  teamMembers: EngagementWizardTeamMember[],
  userId: string,
): EngagementWizardTeamMember["memberRole"] | null {
  return teamMembers.find((member) => member.userId === userId)?.memberRole ?? null;
}

export function EngagementTeamStep({
  draft,
  members,
  labels,
  onChange,
}: EngagementTeamStepProps) {
  const toggleMember = (userId: string, enabled: boolean) => {
    if (!enabled) {
      onChange(draft.teamMembers.filter((member) => member.userId !== userId));
      return;
    }

    onChange([
      ...draft.teamMembers.filter((member) => member.userId !== userId),
      { userId, memberRole: "staff" },
    ]);
  };

  const updateRole = (userId: string, memberRole: EngagementWizardTeamMember["memberRole"]) => {
    onChange(
      draft.teamMembers.map((member) =>
        member.userId === userId ? { ...member, memberRole } : member,
      ),
    );
  };

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-8">
        <p className="text-sm font-medium text-foreground">{labels.teamEmptyTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {labels.teamEmptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{labels.teamHelper}</p>
      {members.map((member) => {
        const selectedRole = findMemberRole(draft.teamMembers, member.userId);
        const isSelected = selectedRole !== null;

        return (
          <WorkspacePanel
            key={member.userId}
            padding="md"
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-4">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(event) => toggleMember(member.userId, event.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Avatar name={member.displayName} size="md" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {member.displayName}
                </span>
                {member.email ? (
                  <span className="block truncate text-xs text-muted-foreground">{member.email}</span>
                ) : null}
              </span>
            </label>

            {isSelected ? (
              <select
                value={selectedRole}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isValidTeamMemberRole(value)) {
                    updateRole(member.userId, value);
                  }
                }}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-52"
              >
                {ENGAGEMENT_MEMBER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {labels.teamRoles[role]}
                  </option>
                ))}
              </select>
            ) : null}
          </WorkspacePanel>
        );
      })}
    </div>
  );
}
