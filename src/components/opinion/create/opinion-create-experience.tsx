"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createOpinionPackageAction } from "@/lib/actions/opinion";
import { useOpinionWorkspace } from "@/lib/opinion/use-opinion-workspace";
import { OpinionWorkspaceEmpty } from "@/components/opinion/workspace/opinion-workspace-states";

type OpinionCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type OpinionCreateExperienceProps = {
  canCreate: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  labels: OpinionCreateLabels;
  gateLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
};

export function OpinionCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
}: OpinionCreateExperienceProps) {
  const router = useRouter();
  const { engagementId, fieldworkStarted: contextFieldworkStarted } = useOpinionWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createOpinionPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <OpinionWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={handleCreate}
      isPending={isPending}
      canCreate={canCreate && fieldworkReady && gateReady}
      gateDescription={
        !fieldworkReady
          ? gateLabels.fieldworkGateDescription
          : !gateReady
            ? gateLabels.fieldworkSubstantiallyCompleteDescription
            : undefined
      }
      forbiddenDescription={labels.forbiddenDescription}
      creatingLabel={labels.creating}
    />
  );
}
