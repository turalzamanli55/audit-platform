"use client";

import type { AiWorkspaceLabels, AiWorkspaceMessage } from "@/components/ai/types";
import { AiMessageList } from "@/components/ai/messages/message-list";
import { AiPromptComposer } from "@/components/ai/composer/prompt-composer";
import { AiWelcomeExperience } from "@/components/ai/welcome/welcome-experience";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";

export function AiConversationPanel({
  labels,
  messages,
  loading,
  showWelcome,
  moduleLabel,
  companyLabel,
  engagementLabel,
  workflowLabel,
  permissionCount,
  knowledgeCount,
  actionCount,
  workspaceLabel,
  contextReady,
  composerDisabled,
  focusSignal,
  onSubmit,
  onStart,
  onExamples,
  onDocumentation,
  onHideWelcome,
  onNeverAgain,
}: {
  labels: AiWorkspaceLabels;
  messages: AiWorkspaceMessage[];
  loading?: boolean;
  showWelcome: boolean;
  moduleLabel: string;
  companyLabel: string;
  engagementLabel: string;
  workflowLabel: string;
  permissionCount: number;
  knowledgeCount: number;
  actionCount: number;
  workspaceLabel: string;
  contextReady: boolean;
  composerDisabled?: boolean;
  focusSignal?: number;
  onSubmit: (utterance: string) => void;
  onStart: () => void;
  onExamples: () => void;
  onDocumentation: () => void;
  onHideWelcome: () => void;
  onNeverAgain: () => void;
}) {
  return (
    <div className={aiWorkspaceTokens.center} aria-label={labels.conversation.title}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {showWelcome ? (
          <AiWelcomeExperience
            labels={labels}
            moduleLabel={moduleLabel}
            companyLabel={companyLabel}
            engagementLabel={engagementLabel}
            workflowLabel={workflowLabel}
            permissionCount={permissionCount}
            knowledgeCount={knowledgeCount}
            actionCount={actionCount}
            onStart={onStart}
            onExamples={onExamples}
            onDocumentation={onDocumentation}
            onHide={onHideWelcome}
            onNeverAgain={onNeverAgain}
          />
        ) : null}
        <AiMessageList messages={messages} labels={labels} loading={loading} />
      </div>
      <AiPromptComposer
        labels={labels}
        moduleLabel={moduleLabel || labels.header.none}
        workspaceLabel={workspaceLabel || labels.header.none}
        contextReady={contextReady}
        disabled={composerDisabled}
        onSubmit={onSubmit}
        focusSignal={focusSignal}
      />
    </div>
  );
}
