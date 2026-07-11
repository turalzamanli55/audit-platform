"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createReportingPackageAction } from "@/lib/actions/reporting";
import { useReportingWorkspace } from "@/lib/reporting/use-reporting-workspace";
import { ReportingWorkspaceEmpty } from "@/components/reporting/workspace/reporting-workspace-states";

type ReportingCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type ReportingCreateExperienceProps = {
  canCreate: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  labels: ReportingCreateLabels;
  gateLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
};

export function ReportingCreateExperience({
  canCreate,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  labels,
  gateLabels,
}: ReportingCreateExperienceProps) {
  const router = useRouter();
  const { engagementId, fieldworkStarted: contextFieldworkStarted } = useReportingWorkspace();
  const [isPending, startTransition] = useTransition();

  const fieldworkReady = fieldworkStarted || contextFieldworkStarted;
  const gateReady = fieldworkSubstantiallyComplete;

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createReportingPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <ReportingWorkspaceEmpty
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
