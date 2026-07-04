"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createRiskAssessmentAction } from "@/lib/actions/risk-assessment";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";
import { RiskAssessmentWorkspaceEmpty } from "@/components/risk-assessment/workspace/risk-assessment-workspace-states";

type RiskAssessmentCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type RiskAssessmentCreateExperienceProps = {
  canCreate: boolean;
  planningApproved: boolean;
  materialityApproved: boolean;
  labels: RiskAssessmentCreateLabels;
  gateLabels: {
    planningGateDescription: string;
    materialityGateDescription: string;
  };
};

export function RiskAssessmentCreateExperience({
  canCreate,
  planningApproved,
  materialityApproved,
  labels,
  gateLabels,
}: RiskAssessmentCreateExperienceProps) {
  const router = useRouter();
  const { engagementId } = useRiskAssessmentWorkspace();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createRiskAssessmentAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <RiskAssessmentWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={handleCreate}
      isPending={isPending}
      canCreate={canCreate && planningApproved && materialityApproved}
      gateDescription={
        !planningApproved
          ? gateLabels.planningGateDescription
          : !materialityApproved
            ? gateLabels.materialityGateDescription
            : undefined
      }
      forbiddenDescription={labels.forbiddenDescription}
      creatingLabel={labels.creating}
    />
  );
}
