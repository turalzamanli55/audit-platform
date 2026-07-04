"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createMaterialityPackageAction } from "@/lib/actions/materiality";
import { useMaterialityWorkspace } from "@/lib/materiality/use-materiality-workspace";
import { MaterialityWorkspaceEmpty } from "@/components/materiality/workspace/materiality-workspace-states";

type MaterialityCreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type MaterialityCreateExperienceProps = {
  canCreate: boolean;
  planningApproved: boolean;
  labels: MaterialityCreateLabels;
  gateLabels: {
    planningGateDescription: string;
  };
};

export function MaterialityCreateExperience({
  canCreate,
  planningApproved,
  labels,
  gateLabels,
}: MaterialityCreateExperienceProps) {
  const router = useRouter();
  const { engagementId } = useMaterialityWorkspace();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createMaterialityPackageAction({ engagementId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <MaterialityWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={handleCreate}
      isPending={isPending}
      canCreate={canCreate && planningApproved}
      gateDescription={!planningApproved ? gateLabels.planningGateDescription : undefined}
      forbiddenDescription={labels.forbiddenDescription}
      creatingLabel={labels.creating}
    />
  );
}
