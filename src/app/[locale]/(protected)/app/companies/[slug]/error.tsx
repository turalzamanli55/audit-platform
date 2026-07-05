"use client";

import { useEffect } from "react";
import { CompanyWorkspaceError } from "@/components/company/workspace";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type CompanyWorkspaceRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompanyWorkspaceRouteError({
  error,
  reset,
}: CompanyWorkspaceRouteErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.companies.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanyWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
