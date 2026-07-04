"use client";

import { useEffect } from "react";
import { MaterialityWorkspaceError } from "@/components/materiality";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

export default function MaterialityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dictionary = useClientDictionary();
  const labels = dictionary.materiality.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MaterialityWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
