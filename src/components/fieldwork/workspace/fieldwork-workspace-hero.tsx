import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";

type FieldworkWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  fieldwork: FieldworkWorkspaceView | null;
  planningApproved: boolean;
  labels: Dictionary["fieldwork"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  fieldwork,
  planningApproved,
  labels,
  engagementsLabels,
  fieldworkLabels,
}: FieldworkWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  const completeCount = fieldwork
    ? fieldwork.procedures.filter((p) => isProcedureComplete(p.procedureStatus)).length
    : 0;
  const openFindings = fieldwork
    ? fieldwork.findings.filter((f) => f.findingStatus === "open").length
    : 0;

  const statusVariant =
    fieldwork?.packageStatus === "substantially_complete"
      ? "success"
      : fieldwork?.pendingReviewCount
        ? "warning"
        : "secondary";

  return (
    <div className="space-y-6">
      <EngagementBreadcrumb
        items={[
          { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
          { label: engagementName, href: engagementPath },
          { label: labels.breadcrumbFieldwork },
        ]}
      />

      {!planningApproved ? (
        <Alert variant="warning" title={labels.planningGateTitle}>
          {labels.planningGateDescription}
        </Alert>
      ) : null}

      {fieldwork?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {labels.heroEyebrow}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
              {engagementName}
            </h1>
            {fieldwork ? (
              <p className="text-sm text-muted-foreground">
                {labels.summaryVersion} {fieldwork.programVersion}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{fieldworkLabels.empty.description}</p>
            )}
          </div>

          {fieldwork ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>
                {fieldworkLabels.statuses[fieldwork.packageStatus]}
              </Badge>
              <Badge variant="outline">
                {labels.summaryProcedures}: {completeCount}/{fieldwork.procedures.length}
              </Badge>
              <Badge variant="outline">
                {labels.summaryFindings}: {openFindings}
              </Badge>
              {fieldwork.pendingReviewCount > 0 ? (
                <Badge variant="warning">
                  {fieldwork.pendingReviewCount} {labels.summaryPendingReview.toLowerCase()}
                </Badge>
              ) : null}
            </div>
          ) : null}

          {fieldwork ? (
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{labels.summaryProgress}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {fieldwork.progressPct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${fieldwork.progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={fieldwork.progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ) : null}
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
