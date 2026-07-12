import type { EmeMemoryContext } from "@/lib/ai/memory-engine/types";

type CacheKey = string;

/**
 * Memory cache — short-lived resolved context snapshots.
 */
export class EmeMemoryCache {
  private readonly entries = new Map<CacheKey, { context: EmeMemoryContext; expiresAt: number }>();
  private readonly ttlMs: number;

  constructor(ttlMs = 60_000) {
    this.ttlMs = ttlMs;
  }

  get(key: CacheKey): EmeMemoryContext | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.context;
  }

  set(key: CacheKey, context: EmeMemoryContext): void {
    this.entries.set(key, { context, expiresAt: Date.now() + this.ttlMs });
  }

  invalidate(key?: CacheKey): void {
    if (key) this.entries.delete(key);
    else this.entries.clear();
  }
}

export function buildCacheKey(input: {
  userId: string | null;
  workspaceId: string | null;
  companyId: string | null;
  engagementId: string | null;
  conversationId?: string | null;
}): string {
  return [input.userId, input.workspaceId, input.companyId, input.engagementId, input.conversationId]
    .map((part) => part ?? "_")
    .join(":");
}
