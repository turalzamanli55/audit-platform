"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePlanningAction } from "@/lib/actions/planning/update-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { WorkspaceFormPanel, WorkspaceNoticeBanner, WorkspaceSectionShell } from "@/components/workspace";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningTextSectionExperienceProps = {
  sectionId: string;
  title: string;
  description?: string;
  fieldKey:
    | "auditStrategy"
    | "engagementObjectives"
    | "scopeOfAudit"
    | "financialReportingFramework"
    | "planningNotes";
  canCreate: boolean;
  canUpdate: boolean;
  labels: Dictionary["planning"]["editor"];
  emptyLabels: Dictionary["planning"]["empty"];
};

const FIELD_MAP = {
  auditStrategy: "auditStrategy",
  engagementObjectives: "engagementObjectives",
  scopeOfAudit: "scopeOfAudit",
  financialReportingFramework: "financialReportingFramework",
  planningNotes: "planningNotes",
} as const;

export function PlanningTextSectionExperience(props: PlanningTextSectionExperienceProps) {
  const { plan } = usePlanningWorkspace();

  if (!plan) {
    return (
      <PlanningCreateExperience canCreate={props.canCreate} labels={props.emptyLabels} />
    );
  }

  return <PlanningTextSectionForm {...props} plan={plan} />;
}

function PlanningTextSectionForm({
  sectionId,
  title,
  description,
  fieldKey,
  canUpdate,
  labels,
  plan,
}: PlanningTextSectionExperienceProps & {
  plan: NonNullable<ReturnType<typeof usePlanningWorkspace>["plan"]>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const apiField = FIELD_MAP[fieldKey];
  const initialValue = plan[fieldKey] ?? "";
  const [value, setValue] = useState(initialValue);
  const readOnly = !canUpdate || plan.isArchived;
  const isDirty = value !== initialValue;

  const save = () => {
    startTransition(async () => {
      setError(null);
      const result = await updatePlanningAction({
        planId: plan.id,
        version: plan.version,
        [apiField]: value,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.refresh();
    });
  };

  return (
    <WorkspaceSectionShell title={title} description={description} headingId={sectionId}>
      {readOnly ? (
        <p className="text-sm text-muted-foreground">{labels.readOnlyNotice}</p>
      ) : null}
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      <WorkspaceFormPanel>
        <textarea
          id={sectionId}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          readOnly={readOnly}
          rows={10}
          className="min-h-[12rem] w-full resize-y rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-70"
          placeholder={labels.placeholder}
        />
        {!readOnly ? (
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={!isDirty || isPending}>
              {isPending ? labels.savingLabel : labels.saveLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setValue(initialValue)}
              disabled={!isDirty || isPending}
            >
              {labels.discardLabel}
            </Button>
          </div>
        ) : null}
      </WorkspaceFormPanel>
    </WorkspaceSectionShell>
  );
}
