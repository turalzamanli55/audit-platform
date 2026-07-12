"use client";

import { AiErrorState } from "@/components/ai/error/error-states";
import { AI_WORKSPACE_LABELS_EN } from "@/components/ai/labels";
import { Button } from "@/components/ui/button";

export default function AiWorkspaceRouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <AiErrorState
        title={AI_WORKSPACE_LABELS_EN.error.conversation}
        description={AI_WORKSPACE_LABELS_EN.conversation.providerUnavailable}
        retryLabel={AI_WORKSPACE_LABELS_EN.error.retry}
        onRetry={reset}
      />
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="outline" onClick={reset}>
          {AI_WORKSPACE_LABELS_EN.error.retry}
        </Button>
      </div>
    </div>
  );
}
