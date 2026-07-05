"use client";

import { useEffect } from "react";
import { CompanySettingsError } from "@/components/company/settings";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type CompanySettingsRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompanySettingsRouteError({
  error,
  reset,
}: CompanySettingsRouteErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.companies.settings;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanySettingsError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
