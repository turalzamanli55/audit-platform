"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningIntegrationPlaceholderProps = {
  module: "materiality" | "risk";
  canCreate: boolean;
  labels: Dictionary["planning"]["integration"];
  emptyLabels: Dictionary["planning"]["empty"];
};

export function PlanningIntegrationPlaceholder({
  module,
  canCreate,
  labels,
  emptyLabels,
}: PlanningIntegrationPlaceholderProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  const moduleLabels = labels[module];
  const statusLabel = labels.statuses[plan[`${module}Status`]];

  return (
    <PlanningWorkspaceSectionShell
      title={moduleLabels.title}
      description={moduleLabels.description}
      headingId={`planning-${module}`}
    >
      <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 p-6 sm:p-8">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {labels.integrationReady}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {moduleLabels.placeholderTitle}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {moduleLabels.placeholderDescription}
          </p>
          <p className="text-sm font-medium text-foreground">
            {labels.currentStatus}: {statusLabel}
          </p>
        </div>
      </div>
    </PlanningWorkspaceSectionShell>
  );
}
