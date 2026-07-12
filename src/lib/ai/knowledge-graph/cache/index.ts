import type { KgCacheEntry, KgCacheKey, KgCacheScope } from "@/lib/ai/knowledge-graph/types";

/**
 * Knowledge cache contracts — in-process only.
 * No Redis. No distributed cache implementation.
 */
export class KgCacheStore {
  private readonly entries = new Map<string, KgCacheEntry>();

  private keyString(key: KgCacheKey): string {
    return `${key.scope}:${key.id}`;
  }

  set<T>(scope: KgCacheScope, id: string, value: T, ttlMs?: number): KgCacheEntry<T> {
    const storedAt = new Date().toISOString();
    const entry: KgCacheEntry<T> = {
      key: { scope, id },
      value,
      expiresAt: ttlMs ? new Date(Date.now() + ttlMs).toISOString() : null,
      storedAt,
    };
    this.entries.set(this.keyString(entry.key), entry as KgCacheEntry);
    return entry;
  }

  get<T>(scope: KgCacheScope, id: string): KgCacheEntry<T> | null {
    const entry = this.entries.get(this.keyString({ scope, id }));
    if (!entry) return null;
    if (entry.expiresAt && Date.parse(entry.expiresAt) < Date.now()) {
      this.entries.delete(this.keyString(entry.key));
      return null;
    }
    return entry as KgCacheEntry<T>;
  }

  delete(scope: KgCacheScope, id: string): boolean {
    return this.entries.delete(this.keyString({ scope, id }));
  }

  clearScope(scope: KgCacheScope): number {
    let removed = 0;
    for (const [key, entry] of this.entries) {
      if (entry.key.scope === scope) {
        this.entries.delete(key);
        removed += 1;
      }
    }
    return removed;
  }

  clear(): void {
    this.entries.clear();
  }
}

export type KgCacheContracts = {
  knowledge: KgCacheStore;
  session: KgCacheStore;
  workspace: KgCacheStore;
  module: KgCacheStore;
};

export function createKgCacheContracts(): KgCacheContracts {
  return {
    knowledge: new KgCacheStore(),
    session: new KgCacheStore(),
    workspace: new KgCacheStore(),
    module: new KgCacheStore(),
  };
}
