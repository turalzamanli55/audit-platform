import type { AiMemoryEntry, AiSessionMemorySnapshot } from "@/lib/ai/types/memory";
import { createAiId } from "@/lib/ai/utils/id";

/**
 * Temporary memory only — no long-term AI memory.
 */
export class AiSessionMemory {
  private conversationId: string | null = null;
  private entries: AiMemoryEntry[] = [];

  reset(conversationId: string): void {
    this.conversationId = conversationId;
    this.entries = [];
  }

  remember(key: string, value: unknown): AiMemoryEntry {
    if (!this.conversationId) {
      throw new Error("AI session memory is not bound to a conversation.");
    }
    const existing = this.entries.findIndex((entry) => entry.key === key);
    const entry: AiMemoryEntry = {
      id: createAiId("mem"),
      key,
      value,
      createdAt: new Date().toISOString(),
    };
    if (existing >= 0) this.entries[existing] = entry;
    else this.entries.push(entry);
    return entry;
  }

  recall(key: string): unknown | undefined {
    return this.entries.find((entry) => entry.key === key)?.value;
  }

  snapshot(): AiSessionMemorySnapshot {
    return {
      conversationId: this.conversationId ?? "",
      entries: [...this.entries],
    };
  }

  list(): AiMemoryEntry[] {
    return [...this.entries];
  }
}
