"use client";

import type { AiWorkspaceLabels, AiWorkspaceMessage, AiWorkspaceMessageRole } from "@/components/ai/types";
import { AiMessageBlockView } from "@/components/ai/messages/message-blocks";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";

const roleShell: Record<AiWorkspaceMessageRole, string> = {
  user: aiWorkspaceTokens.messageUser,
  assistant: aiWorkspaceTokens.messageAssistant,
  system: aiWorkspaceTokens.messageSystem,
  warning: aiWorkspaceTokens.messageWarning,
  suggestion: aiWorkspaceTokens.messageAssistant,
  action: aiWorkspaceTokens.messageAssistant,
  workflow: aiWorkspaceTokens.messageAssistant,
  knowledge: aiWorkspaceTokens.messageAssistant,
};

export function AiMessageBubble({
  message,
  labels,
}: {
  message: AiWorkspaceMessage;
  labels: AiWorkspaceLabels;
}) {
  return (
    <article
      className={cn("flex w-full flex-col gap-1", message.role === "user" ? "items-end" : "items-start")}
      aria-label={`${labels.roles[message.role]} message`}
    >
      <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {labels.roles[message.role]}
      </p>
      <div className={cn(roleShell[message.role], "w-full sm:w-auto")}>
        {message.blocks.map((block, index) => (
          <AiMessageBlockView key={`${message.id}-${index}`} block={block} />
        ))}
      </div>
    </article>
  );
}
