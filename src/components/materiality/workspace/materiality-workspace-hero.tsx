import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";

type MaterialityHeroLabels = {
  breadcrumbMateriality: string;
  heroEyebrow: string;
  summaryProgress: string;
  backToEngagement: string;
  planningGateTitle: string;
  planningGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
};

type MaterialityStatuses = Record<string, string>;

type EngagementLabels = {
  breadcrumbRoot: string;
};

type MaterialityWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  materiality: MaterialityWorkspaceView | null;
  planningApproved: boolean;
  labels: MaterialityHeroLabels;
  statusLabels: MaterialityStatuses;
  engagementsLabels: EngagementLabels;
};

export function MaterialityWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  materiality,
  planningApproved,
  labels,
  statusLabels,
  engagementsLabels,
}: MaterialityWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  return (
    <div className="space-y-6">
      <EngagementBreadcrumb
        items={[
          { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
          { label: engagementName, href: engagementPath },
          { label: labels.breadcrumbMateriality },
        ]}
      />

      {!planningApproved ? (
        <Alert variant="warning" title={labels.planningGateTitle}>
          {labels.planningGateDescription}
        </Alert>
      ) : null}

      {materiality?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {labels.heroEyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {engagementName}
          </h1>
          {materiality ? (
            <p className="text-sm text-muted-foreground">
              {statusLabels[materiality.packageStatus] ?? materiality.packageStatus} ·{" "}
              {labels.summaryProgress} {materiality.progressPct}%
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{labels.planningGateDescription}</p>
          )}
        </div>
        <Link
          href={engagementPath}
          className="inline-flex h-10 shrink-0 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {labels.backToEngagement}
        </Link>
      </div>
    </div>
  );
}
