"use client";

import { Avatar } from "@/components/ui/avatar";
import type { EngagementMemberView } from "@/lib/engagement/engagement-member-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatDate } from "@/lib/engagement/format-engagement-workspace";
import {
  WorkspaceEmptyPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceSectionShell,
} from "@/components/workspace";

type EngagementMembersSectionProps = {
  members: EngagementMemberView[];
  locale: string;
  labels: Dictionary["engagements"]["members"];
  canRead: boolean;
};

function formatMemberRole(
  role: EngagementMemberView["memberRole"],
  labels: Dictionary["engagements"]["members"]["roles"],
): string {
  return labels[role] ?? role;
}

export function EngagementMembersSection({
  members,
  locale,
  labels,
  canRead,
}: EngagementMembersSectionProps) {
  if (!canRead) {
    return (
      <WorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="engagement-members"
      >
        <WorkspaceEmptyPanel
          title={labels.forbiddenTitle}
          description={labels.forbiddenDescription}
        />
      </WorkspaceSectionShell>
    );
  }

  return (
    <WorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="engagement-members"
    >
      {members.length === 0 ? (
        <WorkspaceEmptyPanel title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {members.map((member) => (
            <WorkspaceListItem key={member.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar name={member.displayName} size="md" />
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">{member.displayName}</p>
                    {member.email ? (
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {labels.joinedLabel}: {formatDate(member.joinedAt, locale)}
                    </p>
                  </div>
                </div>
                <span className="inline-flex w-fit rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                  {formatMemberRole(member.memberRole, labels.roles)}
                </span>
              </div>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </WorkspaceSectionShell>
  );
}
