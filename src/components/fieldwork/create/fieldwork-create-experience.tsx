"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createFieldworkAction } from "@/lib/actions/fieldwork";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FieldworkWorkspaceEmpty } from "@/components/fieldwork/workspace/fieldwork-workspace-states";

type FieldworkCreateExperienceProps = {
  canCreate: boolean;
  planningApproved: boolean;
  labels: Dictionary["fieldwork"]["empty"];
  gateLabels: Dictionary["fieldwork"]["workspace"];
};

export function FieldworkCreateExperience({
  canCreate,
  planningApproved,
  labels,
  gateLabels,
}: FieldworkCreateExperienceProps) {
  const router = useRouter();
  const { engagementId } = useFieldworkWorkspace();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createFieldworkAction({ engagementId });
      if (result.success) router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceEmpty
      title={labels.title}
      description={labels.description}
      actionLabel={labels.createAction}
      onAction={handleCreate}
      isPending={isPending}
      canCreate={canCreate && planningApproved}
      gateDescription={!planningApproved ? gateLabels.planningGateDescription : undefined}
      labels={labels}
    />
  );
}
