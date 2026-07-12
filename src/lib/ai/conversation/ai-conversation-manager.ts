import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type {
  AiConversationAppendInput,
  AiConversationSession,
} from "@/lib/ai/types/conversation";
import { createAiId } from "@/lib/ai/utils/id";
import { AiSessionMemory } from "@/lib/ai/memory/session-memory";

function utcNow(): string {
  return new Date().toISOString();
}

/**
 * AI Conversation Manager — session scoped.
 * Resets automatically when workspace identity changes.
 */
export class AiConversationManager {
  private session: AiConversationSession | null = null;
  private readonly memory: AiSessionMemory;

  constructor(memory: AiSessionMemory = new AiSessionMemory()) {
    this.memory = memory;
  }

  getSession(): AiConversationSession | null {
    return this.session;
  }

  getMemory(): AiSessionMemory {
    return this.memory;
  }

  /**
   * Ensures an active conversation aligned to the current context.
   * Workspace change clears messages and temporary memory.
   */
  ensureSession(context: AiRuntimeContext): AiConversationSession {
    const workspaceChanged =
      this.session != null && this.session.workspaceId !== context.workspaceId;

    if (!this.session || workspaceChanged) {
      this.session = this.createSession(context);
      this.memory.reset(this.session.conversationId);
      return this.session;
    }

    this.session.organizationId = context.organizationId;
    this.session.companyId = context.companyId;
    this.session.engagementId = context.engagementId;
    this.session.userId = context.userId;
    this.session.locale = context.locale;
    this.session.updatedAt = utcNow();
    return this.session;
  }

  append(input: AiConversationAppendInput): AiConversationSession {
    if (!this.session) {
      throw new Error("No active AI conversation session.");
    }
    this.session.messages.push({
      id: createAiId("msg"),
      role: input.role,
      content: input.content,
      createdAt: utcNow(),
      metadata: input.metadata,
    });
    this.session.updatedAt = utcNow();
    return this.session;
  }

  reset(context: AiRuntimeContext): AiConversationSession {
    this.session = this.createSession(context);
    this.memory.reset(this.session.conversationId);
    return this.session;
  }

  private createSession(context: AiRuntimeContext): AiConversationSession {
    const now = utcNow();
    return {
      conversationId: createAiId("conv"),
      workspaceId: context.workspaceId,
      organizationId: context.organizationId,
      companyId: context.companyId,
      engagementId: context.engagementId,
      userId: context.userId,
      locale: context.locale,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
  }
}
