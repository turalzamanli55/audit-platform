"use client";

import { useEffect } from "react";
import { CompanyErrorState, CompanyPageShell } from "@/components/company";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type CompaniesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompaniesError({ error, reset }: CompaniesErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.companies;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanyPageShell>
      <CompanyErrorState
        title={labels.errorTitle}
        description={labels.errorDescription}
        action={<WorkspaceErrorRetryAction onRetry={reset} />}
      />
    </CompanyPageShell>
  );
}
