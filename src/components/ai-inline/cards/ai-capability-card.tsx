"use client";

import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";
import { WorkspacePanel } from "@/components/workspace";

export function AiInlineKnowledgeCard() {
  const host = useAiEverywhere();
  const knowledge = host.knowledge;
  const resolution = host.resolution;
  if (!knowledge && !resolution) return null;

  return (
    <WorkspacePanel variant="soft" className="space-y-2 p-3">
      <h3 className={aiInlineTokens.sectionTitle}>{host.labels.knowledge}</h3>
      {knowledge ? (
        <>
          <p className="text-sm font-medium">{knowledge.name}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{knowledge.purpose}</p>
        </>
      ) : null}
      {resolution?.relatedObjectTypes?.length ? (
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {host.labels.relatedObjects}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resolution.relatedObjectTypes.map((type) => (
              <span key={type} className={aiInlineTokens.chip}>
                {type}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {resolution?.knowledgeHints?.length ? (
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {host.labels.references}
          </p>
          <ul className="list-inside list-disc text-xs text-muted-foreground">
            {resolution.knowledgeHints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </WorkspacePanel>
  );
}

export function AiInlineCapabilityCard() {
  const host = useAiEverywhere();
  const capabilities = host.resolution?.capabilities ?? [];
  return (
    <WorkspacePanel variant="muted" className="space-y-2 p-3">
      <h3 className={aiInlineTokens.sectionTitle}>{host.labels.actions}</h3>
      <div className="flex flex-wrap gap-2">
        {capabilities.slice(0, 8).map((capability) => (
          <button
            key={capability.id}
            type="button"
            className={aiInlineTokens.button}
            onClick={() => host.runCapability(capability, host.selection)}
          >
            {capability.label}
          </button>
        ))}
      </div>
    </WorkspacePanel>
  );
}
