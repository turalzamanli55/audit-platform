import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryRecord, EmeMemoryWriteInput } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryPolicyEngine } from "@/lib/ai/memory-engine/policies";
import {
  createEmeMemoryId,
  dedupeKey,
  inferValueType,
  utcNow,
} from "@/lib/ai/memory-engine/utils";

type ScopedStoreOptions = {
  level: EmeMemoryRecord["level"];
  defaultVisibility?: EmeMemoryRecord["policy"]["visibility"];
};

/**
 * Shared scoped memory persistence helper.
 */
export class EmeScopedMemoryStore {
  private readonly policies = new EmeMemoryPolicyEngine();

  constructor(
    protected readonly storage: EmeMemoryStorage,
    private readonly options: ScopedStoreOptions,
  ) {}

  remember(context: AiRuntimeContext, input: EmeMemoryWriteInput): EmeMemoryRecord {
    const now = utcNow();
    const policy = this.policies.defaultPolicy(context, {
      ...input.policy,
      visibility: input.policy?.visibility ?? this.options.defaultVisibility ?? "private",
    });
    const existing = this.storage.findByDedupeKey(
      dedupeKey({ key: input.key, level: this.options.level, policy }),
    );
    const record: EmeMemoryRecord = {
      id: existing?.id ?? createEmeMemoryId(),
      key: input.key,
      level: this.options.level,
      category: input.category,
      label: input.label,
      value: input.value,
      valueType: inferValueType(input.value),
      keywords: input.keywords ?? [input.key, input.category, input.label],
      moduleId: input.moduleId ?? context.moduleId,
      policy,
      status: "active",
      pinned: input.pinned ?? existing?.pinned ?? false,
      frequency: (existing?.frequency ?? 0) + 1,
      lastUsedAt: now,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      conversationId: input.conversationId ?? null,
      summaryOf: existing?.summaryOf ?? [],
    };
    return this.storage.put(record);
  }

  list(context: AiRuntimeContext, limit = 100): EmeMemoryRecord[] {
    return this.storage.listRecords({
      scope: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        userId: context.userId,
      },
      level: this.options.level,
      status: "active",
      limit,
    });
  }
}
