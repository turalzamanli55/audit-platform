import type { EngagementMember } from "@/repositories/engagement/engagement-repository";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Card } from "@/components/ui/card";
import { EngagementWorkspaceSectionShell } from "@/components/engagement/workspace/engagement-workspace-section-shell";
import { EngagementEmptyState } from "@/components/engagement";

type EngagementMembersSectionProps = {
  members: EngagementMember[];
  labels: Dictionary["engagements"]["members"];
};

function formatMemberRole(
  role: EngagementMember["member_role"],
  labels: Dictionary["engagements"]["members"]["roles"],
): string {
  return labels[role] ?? role;
}

export function EngagementMembersSection({ members, labels }: EngagementMembersSectionProps) {
  return (
    <EngagementWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="engagement-members"
    >
      {members.length === 0 ? (
        <EngagementEmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card
              key={member.id}
              className="flex flex-col gap-3 border-border/50 bg-card/80 p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{member.user_id}</p>
                <p className="text-xs text-muted-foreground">{labels.memberIdHint}</p>
              </div>
              <span className="inline-flex w-fit rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                {formatMemberRole(member.member_role, labels.roles)}
              </span>
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed text-muted-foreground">{labels.placeholderNote}</p>
    </EngagementWorkspaceSectionShell>
  );
}
