"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createPlanningAction } from "@/lib/actions/planning/create-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { PlanningWorkspaceEmpty } from "@/components/planning/workspace/planning-workspace-states";

type PlanningCreateExperienceProps = {
  canCreate: boolean;
  engagementReportingFramework?: string | null;
  labels: Dictionary["planning"]["empty"];
};

export function PlanningCreateExperience({
  canCreate,
  engagementReportingFramework,
  labels,
}: PlanningCreateExperienceProps) {
  const router = useRouter();
  const { engagementId } = usePlanningWorkspace();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createPlanningAction({
        engagementId,
        financialReportingFramework: engagementReportingFramework,
      });

      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <PlanningWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={handleCreate}
      isPending={isPending}
      canCreate={canCreate}
      labels={labels}
    />
  );
}
