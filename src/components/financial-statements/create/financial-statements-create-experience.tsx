"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createFinancialStatementPackageAction } from "@/lib/actions/financial-statements";
import { useFinancialStatementsWorkspace } from "@/lib/financial-statements/use-financial-statements-workspace";
import { FinancialStatementsWorkspaceEmpty } from "@/components/financial-statements/workspace/financial-statements-workspace-states";

type FinancialStatementsCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type FinancialStatementsCreateExperienceProps = {
  canCreate: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  labels: FinancialStatementsCreateLabels;
  gateLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
};

export function FinancialStatementsCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
}: FinancialStatementsCreateExperienceProps) {
  const router = useRouter();
  const { engagementId, fieldworkStarted: contextFieldworkStarted } = useFinancialStatementsWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createFinancialStatementPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <FinancialStatementsWorkspaceEmpty
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
