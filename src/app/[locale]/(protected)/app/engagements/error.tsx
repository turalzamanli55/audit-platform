"use client";

import { useEffect } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";
import { WorkspaceErrorRetryAction } from "@/components/workspace";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

type EngagementsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EngagementsError({ error, reset }: EngagementsErrorProps) {
  const dictionary = useClientDictionary();
  const labels = dictionary.engagements;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EngagementPageShell>
      <EngagementErrorState
        title={labels.errorTitle}
        description={labels.errorDescription}
        action={<WorkspaceErrorRetryAction onRetry={reset} />}
      />
    </EngagementPageShell>
  );
}
