"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePlanningAction } from "@/lib/actions/planning/update-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { PlanningTimelineMilestone } from "@/types/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { WorkspacePanel, WorkspaceSectionShell } from "@/components/workspace";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningTimelineExperienceProps = {
  canCreate: boolean;
  canUpdate: boolean;
  labels: Dictionary["planning"]["timeline"];
  emptyLabels: Dictionary["planning"]["empty"];
  milestoneLabels: Dictionary["planning"]["timeline"]["milestones"];
};

export function PlanningTimelineExperience({
  canCreate,
  canUpdate,
  labels,
  emptyLabels,
  milestoneLabels,
}: PlanningTimelineExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  return (
    <PlanningTimelineForm
      plan={plan}
      canUpdate={canUpdate}
      labels={labels}
      milestoneLabels={milestoneLabels}
    />
  );
}

function PlanningTimelineForm({
  plan,
  canUpdate,
  labels,
  milestoneLabels,
}: {
  plan: NonNullable<ReturnType<typeof usePlanningWorkspace>["plan"]>;
  canUpdate: boolean;
  labels: Dictionary["planning"]["timeline"];
  milestoneLabels: Dictionary["planning"]["timeline"]["milestones"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const readOnly = !canUpdate || plan.isArchived;
  const [timeline, setTimeline] = useState<PlanningTimelineMilestone[]>(plan.timeline);

  const updateMilestone = (
    id: string,
    field: "startDate" | "endDate",
    value: string,
  ) => {
    setTimeline((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value || null } : item)),
    );
  };

  const save = () => {
    startTransition(async () => {
      setError(null);
      const result = await updatePlanningAction({
        planId: plan.id,
        version: plan.version,
        timeline,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.refresh();
    });
  };

  return (
    <WorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-timeline"
    >
      {error ? <Alert variant="error">{error}</Alert> : null}
      <WorkspacePanel padding="none">
        <div className="divide-y divide-border/40">
          {timeline.map((milestone) => (
            <div key={milestone.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_1fr_1fr] sm:items-end">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {milestoneLabels[milestone.key as keyof typeof milestoneLabels] ?? milestone.key}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {labels.startDate}
                </label>
                <Input
                  type="date"
                  value={milestone.startDate ?? ""}
                  onChange={(event) =>
                    updateMilestone(milestone.id, "startDate", event.target.value)
                  }
                  readOnly={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{labels.endDate}</label>
                <Input
                  type="date"
                  value={milestone.endDate ?? ""}
                  onChange={(event) => updateMilestone(milestone.id, "endDate", event.target.value)}
                  readOnly={readOnly}
                />
              </div>
            </div>
          ))}
        </div>
        {!readOnly ? (
          <div className="border-t border-border/40 p-5">
            <Button type="button" onClick={save} disabled={isPending}>
              {isPending ? labels.savingLabel : labels.saveLabel}
            </Button>
          </div>
        ) : null}
      </WorkspacePanel>
    </WorkspaceSectionShell>
  );
}
