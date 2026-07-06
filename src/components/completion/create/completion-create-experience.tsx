"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createCompletionPackageAction } from "@/lib/actions/completion";
import { useCompletionWorkspace } from "@/lib/completion/use-completion-workspace";
import { CompletionWorkspaceEmpty } from "@/components/completion/workspace/completion-workspace-states";

type CompletionCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type CompletionCreateExperienceProps = {
  canCreate: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  labels: CompletionCreateLabels;
  gateLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
};

export function CompletionCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
}: CompletionCreateExperienceProps) {
  const router = useRouter();
  const { engagementId, fieldworkStarted: contextFieldworkStarted } = useCompletionWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createCompletionPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <CompletionWorkspaceEmpty
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
