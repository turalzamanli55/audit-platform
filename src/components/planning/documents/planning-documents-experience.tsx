"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningDocumentsExperienceProps = {
  canCreate: boolean;
  labels: Dictionary["planning"]["documents"];
  emptyLabels: Dictionary["planning"]["empty"];
};

export function PlanningDocumentsExperience({
  canCreate,
  labels,
  emptyLabels,
}: PlanningDocumentsExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  return (
    <PlanningWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-documents"
    >
      {plan.documents.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {labels.emptyTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {labels.emptyDescription}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            {labels.integrationReady}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {plan.documents.map((document) => (
            <li key={document.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{document.name}</p>
                <p className="text-xs text-muted-foreground">{document.documentType}</p>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {document.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PlanningWorkspaceSectionShell>
  );
}
