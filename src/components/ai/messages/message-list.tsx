"use client";

import { useEffect, useRef } from "react";
import type { AiWorkspaceLabels, AiWorkspaceMessage } from "@/components/ai/types";
import { AiMessageBubble } from "@/components/ai/messages/message-bubble";
import { AiEmptyState } from "@/components/ai/empty/empty-states";
import { AiPanelLoading } from "@/components/ai/loading/skeletons";

export function AiMessageList({
  messages,
  labels,
  loading,
}: {
  messages: AiWorkspaceMessage[];
  labels: AiWorkspaceLabels;
  loading?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (loading) {
    return <AiPanelLoading label={labels.loading.conversation} />;
  }

  if (messages.length === 0) {
    return (
      <AiEmptyState
        title={labels.conversation.emptyTitle}
        description={labels.conversation.emptyDescription}
        className="m-6"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6" role="log" aria-live="polite">
      {messages.map((message) => (
        <AiMessageBubble key={message.id} message={message} labels={labels} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
