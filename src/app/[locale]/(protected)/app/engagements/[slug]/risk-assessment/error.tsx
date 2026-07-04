"use client";

import { useEffect } from "react";
import { RiskAssessmentWorkspaceError } from "@/components/risk-assessment";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

export default function RiskAssessmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dictionary = useClientDictionary();
  const labels = dictionary.riskAssessment.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RiskAssessmentWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
