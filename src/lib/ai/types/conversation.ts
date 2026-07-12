import type { AiRuntimeContext } from "@/lib/ai/types/context";

export type AiConversationMessageRole = "user" | "assistant" | "system";

export type AiConversationMessage = {
  id: string;
  role: AiConversationMessageRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type AiConversationSession = {
  conversationId: string;
  workspaceId: string | null;
  organizationId: string | null;
  companyId: string | null;
  engagementId: string | null;
  userId: string | null;
  locale: AiRuntimeContext["locale"];
  createdAt: string;
  updatedAt: string;
  messages: AiConversationMessage[];
};

export type AiConversationAppendInput = {
  role: AiConversationMessageRole;
  content: string;
  metadata?: Record<string, unknown>;
};
