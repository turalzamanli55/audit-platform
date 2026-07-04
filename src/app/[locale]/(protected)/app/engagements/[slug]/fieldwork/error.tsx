"use client";

import { useEffect } from "react";
import { FieldworkWorkspaceError } from "@/components/fieldwork";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

export default function FieldworkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dictionary = useClientDictionary();
  const labels = dictionary.fieldwork.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FieldworkWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
