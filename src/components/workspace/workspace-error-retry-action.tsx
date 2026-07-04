"use client";

import { WorkspaceRetryButton } from "@/components/workspace/workspace-states";
import { useCommonLabels } from "@/i18n/use-common-labels";

export function WorkspaceErrorRetryAction({ onRetry }: { onRetry: () => void }) {
  const { retry } = useCommonLabels();
  return <WorkspaceRetryButton label={retry} onRetry={onRetry} />;
}
