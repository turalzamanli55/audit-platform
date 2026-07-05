"use client";

import { useEffect } from "react";
import { ReviewWorkspaceError } from "@/components/review";
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
  const labels = dictionary.review.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ReviewWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
