"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";
import {
  buildFieldworkOverviewCards,
  buildFieldworkStatusItems,
} from "@/lib/fieldwork/fieldwork-workspace-display";
import { FieldworkCreateExperience } from "@/components/fieldwork/create/fieldwork-create-experience";
import { FieldworkWorkspaceSectionShell } from "@/components/fieldwork/workspace/fieldwork-workspace-section-shell";

type FieldworkOverviewExperienceProps = {
  canCreate: boolean;
  planningApproved: boolean;
  labels: Dictionary["fieldwork"]["workspace"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkOverviewExperience({
  canCreate,
  planningApproved,
  labels,
  fieldworkLabels,
}: FieldworkOverviewExperienceProps) {
  const { fieldwork } = useFieldworkWorkspace();

  if (!fieldwork) {
    return (
      <FieldworkCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        labels={fieldworkLabels.empty}
        gateLabels={labels}
      />
    );
  }

  const cards = buildFieldworkOverviewCards(fieldwork, labels, fieldworkLabels);
  const statusItems = buildFieldworkStatusItems(fieldwork, labels, fieldworkLabels);

  return (
    <div className="space-y-10">
      <FieldworkWorkspaceSectionShell
        title={labels.sections.overview.title}
        description={labels.sections.overview.description}
        headingId="fieldwork-overview"
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
      </FieldworkWorkspaceSectionShell>

      <FieldworkWorkspaceSectionShell
        title={labels.status.title}
        description={labels.status.description}
        headingId="fieldwork-status"
      >
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels.status.progress}</span>
              <span className="font-medium text-foreground">{fieldwork.progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/80 transition-all duration-300"
                style={{ width: `${fieldwork.progressPct}%` }}
                role="progressbar"
                aria-valuenow={fieldwork.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={labels.status.progress}
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
      </FieldworkWorkspaceSectionShell>
    </div>
  );
}
