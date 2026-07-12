import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryRecord } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { createEmeMemoryId, defaultSessionExpiry, utcNow } from "@/lib/ai/memory-engine/utils";

/**
 * Session memory — one conversation only, auto-expires.
 */
export class EmeSessionMemoryStore {
  constructor(private readonly storage: EmeMemoryStorage) {}

  remember(
    context: AiRuntimeContext,
    conversationId: string,
    key: string,
    value: unknown,
    category = "session_context",
  ): EmeMemoryRecord {
    const now = utcNow();
    const existing = this.storage
      .listRecords({
        scope: {
          organizationId: context.organizationId,
          workspaceId: context.workspaceId,
          userId: context.userId,
          conversationId,
        },
        level: "session",
        limit: 100,
      })
      .find((record) => record.key === key);

    const record: EmeMemoryRecord = {
      id: existing?.id ?? createEmeMemoryId(),
      key,
      level: "session",
      category,
      label: key,
      value,
      valueType:
        typeof value === "string"
          ? "string"
          : typeof value === "number"
            ? "number"
            : typeof value === "boolean"
              ? "boolean"
              : "json",
      keywords: [key, category],
      moduleId: context.moduleId,
      policy: {
        visibility: "private",
        ownerId: context.userId,
        workspaceId: context.workspaceId,
        organizationId: context.organizationId,
        companyId: context.companyId,
        engagementId: context.engagementId,
        expiresAt: defaultSessionExpiry(),
        confidence: 1,
        source: "interaction",
        importance: 0.5,
        learningEnabled: false,
      },
      status: "active",
      pinned: false,
      frequency: (existing?.frequency ?? 0) + 1,
      lastUsedAt: now,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      conversationId,
      summaryOf: [],
    };
    return this.storage.put(record);
  }

  list(context: AiRuntimeContext, conversationId: string): EmeMemoryRecord[] {
    return this.storage.listRecords({
      scope: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        userId: context.userId,
        conversationId,
      },
      level: "session",
    });
  }

  clearConversation(conversationId: string): number {
    return this.storage.clearScope({ conversationId }, ["session"]);
  }
}
