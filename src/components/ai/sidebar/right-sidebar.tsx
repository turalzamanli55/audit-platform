"use client";

import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import type { LlmHealthStatus, LlmProviderCapabilities } from "@/lib/ai/providers/provider";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import type { AiActionCardItem } from "@/components/ai/actions/action-cards";
import { AiActionCards } from "@/components/ai/actions/action-cards";
import { AiContextPanel } from "@/components/ai/context/context-panel";
import { AiKnowledgePanel } from "@/components/ai/knowledge/knowledge-panel";
import { AiProviderStatusPanel } from "@/components/ai/sidebar/provider-status";
import {
  AiSuggestionPanel,
  type AiSuggestionItem,
} from "@/components/ai/suggestions/suggestion-panel";

export function AiWorkspaceRightSidebar({
  labels,
  context,
  contextLoading,
  contextError,
  companyName,
  engagementName,
  organizationName,
  workspaceName,
  userLabel,
  suggestions,
  suggestionsLoading,
  onApplySuggestion,
  actions,
  knowledge,
  knowledgeLoading,
  providerLabel,
  modelId,
  capabilities,
  health,
}: {
  labels: AiWorkspaceLabels;
  context: AiRuntimeContext | null;
  contextLoading?: boolean;
  contextError?: boolean;
  companyName: string;
  engagementName: string;
  organizationName: string;
  workspaceName: string;
  userLabel: string;
  suggestions: AiSuggestionItem[];
  suggestionsLoading?: boolean;
  onApplySuggestion: (utterance: string) => void;
  actions: AiActionCardItem[];
  knowledge: AiModuleKnowledge | null;
  knowledgeLoading?: boolean;
  providerLabel: string;
  modelId: string;
  capabilities: LlmProviderCapabilities;
  health: LlmHealthStatus;
}) {
  return (
    <aside className="min-h-0 flex-1 overflow-y-auto" aria-label={labels.context.title}>
      <AiContextPanel
        labels={labels}
        context={context}
        loading={contextLoading}
        error={contextError}
        companyName={companyName}
        engagementName={engagementName}
        organizationName={organizationName}
        workspaceName={workspaceName}
        userLabel={userLabel}
      />
      <AiSuggestionPanel
        labels={labels}
        items={suggestions}
        loading={suggestionsLoading}
        onApply={onApplySuggestion}
      />
      <AiActionCards labels={labels} items={actions} />
      <AiKnowledgePanel labels={labels} knowledge={knowledge} loading={knowledgeLoading} />
      <AiProviderStatusPanel
        labels={labels}
        providerLabel={providerLabel}
        modelId={modelId}
        capabilities={capabilities}
        health={health}
      />
    </aside>
  );
}
