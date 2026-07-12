import type { EmeMemoryRecord } from "@/lib/ai/memory-engine/types";
import { createAiId } from "@/lib/ai/utils/id";
import { utcNow } from "@/lib/ai/memory-engine/utils";

export type EmeMemoryHistoryEvent = {
  id: string;
  kind: "created" | "used" | "ignored" | "pinned" | "edited" | "forgotten" | "compressed" | "imported";
  memoryId: string | null;
  userId: string | null;
  workspaceId: string | null;
  detail: string;
  recordedAt: string;
};

/**
 * Memory history — audit trail for memory operations.
 */
export class EmeMemoryHistoryStore {
  private readonly events: EmeMemoryHistoryEvent[] = [];

  record(event: Omit<EmeMemoryHistoryEvent, "id" | "recordedAt">): EmeMemoryHistoryEvent {
    const entry: EmeMemoryHistoryEvent = {
      id: createAiId("eme_hist"),
      recordedAt: utcNow(),
      ...event,
    };
    this.events.unshift(entry);
    if (this.events.length > 500) this.events.length = 500;
    return entry;
  }

  list(filter?: { memoryId?: string; limit?: number }): EmeMemoryHistoryEvent[] {
    return this.events
      .filter((event) => (filter?.memoryId ? event.memoryId === filter.memoryId : true))
      .slice(0, filter?.limit ?? 100);
  }

  touchUsed(record: EmeMemoryRecord, userId: string | null): void {
    this.record({
      kind: "used",
      memoryId: record.id,
      userId,
      workspaceId: record.policy.workspaceId,
      detail: `Recalled ${record.level}.${record.key}`,
    });
  }

  clear(): void {
    this.events.length = 0;
  }
}
