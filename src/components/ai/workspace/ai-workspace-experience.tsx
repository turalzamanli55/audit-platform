"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAiWorkspaceHost } from "@/components/ai/host/ai-workspace-provider";
import { AiWorkspaceHeader } from "@/components/ai/workspace/ai-workspace-header";
import { AiConversationHistory } from "@/components/ai/history/conversation-history";
import { AiConversationPanel } from "@/components/ai/conversation/conversation-panel";
import { AiWorkspaceRightSidebar } from "@/components/ai/sidebar/right-sidebar";
import { AiWorkspaceLoading } from "@/components/ai/loading/skeletons";
import { AiErrorState } from "@/components/ai/error/error-states";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { AI_WORKSPACE_PATH } from "@/components/ai/types";
import { cn } from "@/lib/ui/cn";

export function AiWorkspaceExperience() {
  const host = useAiWorkspaceHost();
  const router = useRouter();
  const activeTitle =
    host.conversations.find((item) => item.id === host.activeConversationId)?.title ??
    host.labels.header.none;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        host.closeMobilePanels();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        host.focusComposer();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !typing) {
        event.preventDefault();
        // Already on AI workspace — focus composer instead of re-navigating.
        host.focusComposer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [host]);

  if (!host.ready) {
    return <AiWorkspaceLoading label={host.labels.loading.workspace} />;
  }

  if (!host.context) {
    return (
      <div className="p-6">
        <AiErrorState
          title={host.labels.error.context}
          retryLabel={host.labels.error.retry}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  if (!host.context.workspaceId) {
    return (
      <div className="p-6">
        <AiErrorState title={host.labels.error.workspace} />
      </div>
    );
  }

  return (
    <div className={aiWorkspaceTokens.shell}>
      <AiWorkspaceHeader
        labels={host.labels}
        conversationName={activeTitle}
        moduleLabel={host.context.moduleId ?? host.labels.header.none}
        companyLabel={host.companyName || host.labels.header.none}
        engagementLabel={host.engagementName || host.labels.header.none}
        modelLabel={host.modelLabel}
        providerConfigured={host.providerConfigured}
        providerLabel={host.providerLabel}
      />

      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2 xl:hidden">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => host.setMobileHistoryOpen(!host.mobileHistoryOpen)}
        >
          {host.labels.history.title}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => host.setMobileContextOpen(!host.mobileContextOpen)}
        >
          {host.labels.context.title}
        </Button>
      </div>

      <div className={aiWorkspaceTokens.grid}>
        <aside
          className={cn(
            aiWorkspaceTokens.leftRail,
            host.mobileHistoryOpen && "fixed inset-y-[var(--ds-header-height,3.75rem)] left-0 z-40 flex w-[min(100%,18rem)] bg-background shadow-xl lg:static lg:shadow-none",
          )}
          aria-label={host.labels.history.title}
        >
          <AiConversationHistory
            labels={host.labels}
            conversations={host.conversations}
            activeId={host.activeConversationId}
            onSelect={host.selectConversation}
            onCreate={host.createConversation}
            onPin={host.pinConversation}
            onFavorite={host.favoriteConversation}
            onRename={host.renameConversation}
            onArchive={host.archiveConversation}
            onDelete={host.deleteConversation}
          />
        </aside>

        <AiConversationPanel
          labels={host.labels}
          messages={host.messages}
          showWelcome={host.showWelcome}
          moduleLabel={host.context.moduleId ?? host.labels.header.none}
          companyLabel={host.companyName || host.labels.header.none}
          engagementLabel={host.engagementName || host.labels.header.none}
          workflowLabel={host.context.workflowId ?? host.labels.header.none}
          permissionCount={host.context.permissionCodes.length}
          knowledgeCount={host.modules.length}
          actionCount={host.actions.length}
          workspaceLabel={host.workspaceName || host.labels.header.none}
          contextReady={Boolean(host.context)}
          focusSignal={host.focusSignal}
          onSubmit={host.submitUtterance}
          onStart={() => {
            host.hideWelcome();
            host.focusComposer();
          }}
          onExamples={host.showExamples}
          onDocumentation={() => router.push(`/${host.context?.locale ?? "en"}${AI_WORKSPACE_PATH}`)}
          onHideWelcome={host.hideWelcome}
          onNeverAgain={host.neverShowWelcome}
        />

        <div
          className={cn(
            aiWorkspaceTokens.rightRail,
            host.mobileContextOpen &&
              "fixed inset-y-[var(--ds-header-height,3.75rem)] right-0 z-40 flex w-[min(100%,22rem)] bg-background shadow-xl xl:static xl:shadow-none",
          )}
        >
          <AiWorkspaceRightSidebar
            labels={host.labels}
            context={host.context}
            companyName={host.companyName}
            engagementName={host.engagementName}
            organizationName={host.organizationName}
            workspaceName={host.workspaceName}
            userLabel={host.userLabel}
            suggestions={host.suggestions}
            onApplySuggestion={host.submitUtterance}
            actions={host.actions}
            knowledge={host.knowledge}
            providerLabel={host.providerLabel}
            modelId={host.modelLabel}
            capabilities={host.capabilities}
            health={host.providerHealth}
            latencyMs={host.providerLatencyMs}
            tokenUsageLabel={host.tokenUsageLabel}
            estimatedCostLabel={host.estimatedCostLabel}
            providerConfigured={host.providerConfigured}
          />
        </div>
      </div>
    </div>
  );
}
