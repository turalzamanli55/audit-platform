"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createReviewPackageAction } from "@/lib/actions/review";
import { useReviewWorkspace } from "@/lib/review/use-review-workspace";
import { ReviewWorkspaceEmpty } from "@/components/review/workspace/review-workspace-states";

type ReviewCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type ReviewCreateExperienceProps = {
  canCreate: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  labels: ReviewCreateLabels;
  gateLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
};

export function ReviewCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
}: ReviewCreateExperienceProps) {
  const router = useRouter();
  const { engagementId, fieldworkStarted: contextFieldworkStarted } = useReviewWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createReviewPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <ReviewWorkspaceEmpty
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
