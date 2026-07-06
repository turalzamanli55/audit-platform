"use client";

import { useEffect } from "react";
import { CompletionWorkspaceError } from "@/components/completion";
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
  const labels = dictionary.completion.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompletionWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
