"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePlanningAction } from "@/lib/actions/planning/update-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningTeamExperienceProps = {
  canCreate: boolean;
  canUpdate: boolean;
  labels: Dictionary["planning"]["team"];
  emptyLabels: Dictionary["planning"]["empty"];
  memberRoleLabels: Dictionary["engagements"]["members"]["roles"];
};

export function PlanningTeamExperience({
  canCreate,
  canUpdate,
  labels,
  emptyLabels,
  memberRoleLabels,
}: PlanningTeamExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  return (
    <PlanningTeamForm
      plan={plan}
      canUpdate={canUpdate}
      labels={labels}
      memberRoleLabels={memberRoleLabels}
    />
  );
}

function PlanningTeamForm({
  plan,
  canUpdate,
  labels,
  memberRoleLabels,
}: {
  plan: NonNullable<ReturnType<typeof usePlanningWorkspace>["plan"]>;
  canUpdate: boolean;
  labels: Dictionary["planning"]["team"];
  memberRoleLabels: Dictionary["engagements"]["members"]["roles"];
}) {
  const router = useRouter();
  const { engagement } = useEngagementWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const readOnly = !canUpdate || plan.isArchived;
  const teamPlanning = plan.teamPlanning;
  const [estimatedHours, setEstimatedHours] = useState(
    teamPlanning.estimatedHours?.toString() ?? "",
  );
  const [notes, setNotes] = useState(teamPlanning.notes ?? "");

  const save = () => {
    startTransition(async () => {
      setError(null);
      const result = await updatePlanningAction({
        planId: plan.id,
        version: plan.version,
        teamPlanning: {
          estimatedHours: estimatedHours ? Number(estimatedHours) : null,
          notes: notes || null,
        },
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="space-y-10">
      <PlanningWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="planning-team"
      >
        {error ? <Alert variant="error">{error}</Alert> : null}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
            <div className="space-y-4 p-5 sm:p-6">
              <h3 className="text-sm font-medium text-foreground">{labels.rosterTitle}</h3>
              {engagement.members.length === 0 ? (
                <p className="text-sm text-muted-foreground">{labels.rosterEmpty}</p>
              ) : (
                <ul className="space-y-3">
                  {engagement.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {member.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {memberRoleLabels[member.memberRole]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
            <div className="space-y-4 p-5 sm:p-6">
              <h3 className="text-sm font-medium text-foreground">{labels.capacityTitle}</h3>
              <div className="space-y-2">
                <label htmlFor="estimated-hours" className="text-sm font-medium text-foreground">
                  {labels.estimatedHours}
                </label>
                <Input
                  id="estimated-hours"
                  type="number"
                  min={0}
                  value={estimatedHours}
                  onChange={(event) => setEstimatedHours(event.target.value)}
                  readOnly={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="team-notes" className="text-sm font-medium text-foreground">
                  {labels.notes}
                </label>
                <textarea
                  id="team-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  readOnly={readOnly}
                  rows={5}
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>
              {!readOnly ? (
                <Button type="button" onClick={save} disabled={isPending}>
                  {isPending ? labels.savingLabel : labels.saveLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </PlanningWorkspaceSectionShell>
    </div>
  );
}
