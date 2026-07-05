import {
  EngagementArchiveBadge,
  EngagementBreadcrumb,
  EngagementLifecycleBadge,
  EngagementRestoreBanner,
  EngagementStatusBadge,
} from "@/components/engagement";
import {
  formatEngagementTypeLabel,
  formatLifecycleStatusLabel,
  formatOptionalText,
} from "@/lib/engagement/format-engagement-workspace";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WorkspaceBackLink, WorkspaceHero, WorkspaceHeroIcon } from "@/components/workspace";

export type EngagementWorkspaceHeroLabels = {
  breadcrumbRoot: string;
  eyebrow: string;
  engagementCode: string;
  statusActive: string;
  statusInactive: string;
  statusArchived: string;
  statusSuspended: string;
  archivedTitle: string;
  archivedDescription: string;
};

type EngagementWorkspaceHeroProps = {
  locale: string;
  engagement: EngagementWorkspaceView;
  labels: EngagementWorkspaceHeroLabels;
  engagementsLabels?: Dictionary["engagements"];
  className?: string;
};

function statusLabel(
  status: EngagementWorkspaceView["status"],
  labels: EngagementWorkspaceHeroLabels,
): string {
  switch (status) {
    case "active":
      return labels.statusActive;
    case "inactive":
      return labels.statusInactive;
    case "archived":
      return labels.statusArchived;
    case "suspended":
      return labels.statusSuspended;
    default:
      return status;
  }
}

export function EngagementWorkspaceHero({
  locale,
  engagement,
  labels,
  engagementsLabels,
  className,
}: EngagementWorkspaceHeroProps) {
  const basePath = `/${locale}/app/engagements`;
  const description =
    engagement.description?.trim() ||
    (engagement.engagementCode ? `${labels.engagementCode}: ${engagement.engagementCode}` : null);

  return (
    <WorkspaceHero
      className={className}
      breadcrumb={
        <EngagementBreadcrumb
          items={[
            { label: labels.breadcrumbRoot, href: basePath },
            { label: engagement.name },
          ]}
        />
      }
      alerts={
        engagement.isArchived ? (
          <EngagementRestoreBanner
            title={labels.archivedTitle}
            description={labels.archivedDescription}
          />
        ) : null
      }
      leading={
        <WorkspaceHeroIcon>
          {engagement.name.trim().charAt(0).toUpperCase() || "E"}
        </WorkspaceHeroIcon>
      }
      eyebrow={labels.eyebrow}
      title={engagement.name}
      subtitle={formatOptionalText(engagement.companyName)}
      description={description ?? undefined}
      badges={
        <>
          {engagement.isArchived ? (
            <EngagementArchiveBadge label={labels.statusArchived} />
          ) : (
            <EngagementStatusBadge
              status={engagement.status}
              label={statusLabel(engagement.status, labels)}
            />
          )}
          {engagementsLabels ? (
            <EngagementLifecycleBadge
              status={engagement.lifecycleStatus}
              label={formatLifecycleStatusLabel(
                engagement.lifecycleStatus,
                engagementsLabels.lifecycleStatuses,
              )}
            />
          ) : null}
          {engagementsLabels ? (
            <span className="text-xs text-muted-foreground">
              {formatEngagementTypeLabel(
                engagement.engagementType,
                engagementsLabels.create.engagementTypes,
              )}
            </span>
          ) : null}
        </>
      }
      action={
        engagement.companySlug ? (
          <WorkspaceBackLink
            href={`/${locale}/app/companies/${engagement.companySlug}`}
            label={engagement.companyName}
          />
        ) : undefined
      }
    />
  );
}
