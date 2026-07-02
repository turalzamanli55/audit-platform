"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import {
  buildPlanningOverviewCards,
  buildPlanningStatusItems,
  computePlanningProgress,
} from "@/lib/planning/planning-workspace-display";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningOverviewExperienceProps = {
  locale: string;
  canCreate: boolean;
  canUpdate: boolean;
  engagementReportingFramework?: string | null;
  labels: Dictionary["planning"]["workspace"];
  planningLabels: Dictionary["planning"];
};

export function PlanningOverviewExperience({
  canCreate,
  engagementReportingFramework,
  labels,
  planningLabels,
}: PlanningOverviewExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return (
      <PlanningCreateExperience
        canCreate={canCreate}
        engagementReportingFramework={engagementReportingFramework}
        labels={planningLabels.empty}
      />
    );
  }

  const cards = buildPlanningOverviewCards(plan, labels, planningLabels);
  const statusItems = buildPlanningStatusItems(plan, labels, planningLabels);
  const progress = computePlanningProgress(plan.planningStatus);

  return (
    <div className="space-y-10">
      <PlanningWorkspaceSectionShell
        title={labels.sections.overview.title}
        description={labels.sections.overview.description}
        headingId="planning-overview"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-xs"
            >
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {card.value}
              </p>
              {card.hint ? (
                <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p>
              ) : null}
            </div>
          ))}
        </div>
      </PlanningWorkspaceSectionShell>

      <PlanningWorkspaceSectionShell
        title={labels.status.title}
        description={labels.status.description}
        headingId="planning-status"
      >
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels.status.progressLabel}</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/80 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {statusItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/40 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PlanningWorkspaceSectionShell>
    </div>
  );
}
