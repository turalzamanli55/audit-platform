"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { WorkspacePanel, WorkspaceSectionShell } from "@/components/workspace";
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
    <WorkspaceSectionShell
      title={moduleLabels.title}
      description={moduleLabels.description}
      headingId={`planning-${module}`}
    >
      <WorkspacePanel variant="muted" className="text-center">
        <div className="mx-auto max-w-xl space-y-4">
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
      </WorkspacePanel>
    </WorkspaceSectionShell>
  );
}
