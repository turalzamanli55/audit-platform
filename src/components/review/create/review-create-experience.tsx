"use client";

import { useTransition } from "react";
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
  onCreate?: () => Promise<{ success: boolean }>;
};

export function ReviewCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
  onCreate,
}: ReviewCreateExperienceProps) {
  const { fieldworkStarted: contextFieldworkStarted } = useReviewWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    if (!onCreate) return;
    startTransition(async () => {
      await onCreate();
    });
  };

  return (
    <ReviewWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={onCreate ? handleCreate : undefined}
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
