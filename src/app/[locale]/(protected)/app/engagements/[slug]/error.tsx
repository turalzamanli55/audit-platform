"use client";

import { useEffect } from "react";
import { EngagementWorkspaceError } from "@/components/engagement/workspace";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type EngagementWorkspaceRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EngagementWorkspaceRouteError({
  error,
  reset,
}: EngagementWorkspaceRouteErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.engagements.workspace;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EngagementWorkspaceError
      title={labels.errorTitle}
      description={labels.errorDescription}
      action={<WorkspaceErrorRetryAction onRetry={reset} />}
    />
  );
}
