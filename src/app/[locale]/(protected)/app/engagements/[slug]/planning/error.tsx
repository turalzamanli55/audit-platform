"use client";

import { useEffect } from "react";
import { PlanningWorkspaceError } from "@/components/planning";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type PlanningErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlanningError({ error, reset }: PlanningErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.planning.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PlanningWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
