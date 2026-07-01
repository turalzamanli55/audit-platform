import Link from "next/link";
import {
  EngagementArchiveBadge,
  EngagementBreadcrumb,
  EngagementLifecycleBadge,
  EngagementRestoreBanner,
  EngagementStatusBadge,
} from "@/components/engagement";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import {
  formatEngagementTypeLabel,
  formatLifecycleStatusLabel,
  formatOptionalText,
} from "@/lib/engagement/format-engagement-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";

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
  className = "",
}: EngagementWorkspaceHeroProps) {
  const basePath = `/${locale}/app/engagements`;
  const description =
    engagement.description?.trim() ||
    (engagement.engagementCode
      ? `${labels.engagementCode}: ${engagement.engagementCode}`
      : null);

  return (
    <div className={`space-y-6 ${className}`}>
      <EngagementBreadcrumb
        items={[
          { label: labels.breadcrumbRoot, href: basePath },
          { label: engagement.name },
        ]}
      />

      {engagement.isArchived ? (
        <EngagementRestoreBanner
          title={labels.archivedTitle}
          description={labels.archivedDescription}
        />
      ) : null}

      <div className="flex flex-col gap-8 border-b border-border/50 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-5 sm:gap-6">
          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary sm:h-16 sm:w-16"
          >
            {engagement.name.trim().charAt(0).toUpperCase() || "E"}
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {labels.eyebrow}
            </p>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
                {engagement.name}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {formatOptionalText(engagement.companyName)}
              </p>
              {description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {engagement.isArchived ? (
                <EngagementArchiveBadge />
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
            </div>
          </div>
        </div>
        {engagement.companySlug ? (
          <Link
            href={`/${locale}/app/companies/${engagement.companySlug}`}
            className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {engagement.companyName}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
