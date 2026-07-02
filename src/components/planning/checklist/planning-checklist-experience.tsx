"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePlanningAction } from "@/lib/actions/planning/update-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { PlanningChecklistItem } from "@/types/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningChecklistExperienceProps = {
  canCreate: boolean;
  canUpdate: boolean;
  labels: Dictionary["planning"]["checklist"];
  emptyLabels: Dictionary["planning"]["empty"];
  itemLabels: Dictionary["planning"]["checklist"]["items"];
};

export function PlanningChecklistExperience({
  canCreate,
  canUpdate,
  labels,
  emptyLabels,
  itemLabels,
}: PlanningChecklistExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  return (
    <PlanningChecklistForm
      plan={plan}
      canUpdate={canUpdate}
      labels={labels}
      itemLabels={itemLabels}
    />
  );
}

function PlanningChecklistForm({
  plan,
  canUpdate,
  labels,
  itemLabels,
}: {
  plan: NonNullable<ReturnType<typeof usePlanningWorkspace>["plan"]>;
  canUpdate: boolean;
  labels: Dictionary["planning"]["checklist"];
  itemLabels: Dictionary["planning"]["checklist"]["items"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const readOnly = !canUpdate || plan.isArchived;
  const [checklist, setChecklist] = useState<PlanningChecklistItem[]>(plan.checklist);

  const toggleItem = (id: string) => {
    setChecklist((current) =>
      current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  };

  const save = () => {
    startTransition(async () => {
      setError(null);
      const result = await updatePlanningAction({
        planId: plan.id,
        version: plan.version,
        checklist,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.refresh();
    });
  };

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <PlanningWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-checklist"
    >
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
        <div className="border-b border-border/40 px-5 py-4">
          <p className="text-sm text-muted-foreground">
            {labels.progress}: {completedCount}/{checklist.length}
          </p>
        </div>
        <ul className="divide-y divide-border/40">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-5 py-4">
              <input
                id={`checklist-${item.id}`}
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                disabled={readOnly}
                className="size-4 rounded border-border"
              />
              <label htmlFor={`checklist-${item.id}`} className="text-sm text-foreground">
                {itemLabels[item.key as keyof typeof itemLabels] ?? item.key}
              </label>
            </li>
          ))}
        </ul>
        {!readOnly ? (
          <div className="border-t border-border/40 p-5">
            <Button type="button" onClick={save} disabled={isPending}>
              {isPending ? labels.savingLabel : labels.saveLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </PlanningWorkspaceSectionShell>
  );
}
