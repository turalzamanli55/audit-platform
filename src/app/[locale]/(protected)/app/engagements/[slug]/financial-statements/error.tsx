"use client";

import { useEffect } from "react";
import { FinancialStatementsWorkspaceError } from "@/components/financial-statements";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dictionary = useClientDictionary();
  const labels = dictionary.financialStatements.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FinancialStatementsWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
