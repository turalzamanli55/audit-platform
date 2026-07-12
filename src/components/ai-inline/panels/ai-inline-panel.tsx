"use client";

import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";
import { WorkspacePanel } from "@/components/workspace";

export function AiInlineContextPanel() {
  const host = useAiEverywhere();
  const context = host.context;
  const resolution = host.resolution;

  return (
    <WorkspacePanel variant="muted" className="space-y-3 p-3">
      <h3 className={aiInlineTokens.sectionTitle}>{host.labels.context}</h3>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Module</dt>
          <dd className="font-medium">{resolution?.displayName ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Route</dt>
          <dd className="truncate font-medium">{context?.route ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Selection</dt>
          <dd className="truncate font-medium">
            {host.selection
              ? `${host.selection.objectType}: ${host.selection.objectLabel ?? host.selection.objectId}`
              : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Workspace</dt>
          <dd className="font-medium">{context?.workspaceId ? "Bound" : "—"}</dd>
        </div>
      </dl>
      {resolution?.summary ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{resolution.summary}</p>
      ) : null}
    </WorkspacePanel>
  );
}
