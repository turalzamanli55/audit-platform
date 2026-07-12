import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryRecord, EmeMemorySearchQuery } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryPolicyEngine } from "@/lib/ai/memory-engine/policies";
import { createEmeError, stringifyMemoryValue } from "@/lib/ai/memory-engine/utils";

export type EmeSemanticSearchContract = {
  /** Contract only — no embeddings, no vector DB, no LLM. */
  search(_query: string, _scope: { organizationId: string | null; workspaceId: string | null }): Promise<EmeMemoryRecord[]>;
};

/**
 * Memory Search — keyword, entity, scope filters; semantic contract only.
 */
export class EmeMemorySearchEngine {
  private readonly policies = new EmeMemoryPolicyEngine();

  constructor(private readonly storage: EmeMemoryStorage) {}

  search(query: EmeMemorySearchQuery): EmeMemoryRecord[] {
    const limit = query.limit ?? 50;
    let records = this.storage.listRecords({
      scope: {
        organizationId: query.context.organizationId,
        workspaceId: query.context.workspaceId,
        userId: query.context.userId,
        companyId: query.context.companyId,
        engagementId: query.context.engagementId,
      },
      level: query.level,
      status: "active",
      limit: 500,
    });

    records = records.filter((record) => {
      const readable = this.policies.assertReadable(record, query.context);
      return readable.ok;
    });

    switch (query.mode) {
      case "keyword":
        records = this.keywordFilter(records, query.text ?? "");
        break;
      case "entity":
        records = records.filter((record) => {
          if (query.entityType && !record.keywords.includes(query.entityType)) {
            const serialized = stringifyMemoryValue(record.value);
            if (!serialized.includes(query.entityType)) return false;
          }
          if (query.entityId) {
            const serialized = stringifyMemoryValue(record.value);
            if (!serialized.includes(query.entityId)) return false;
          }
          return true;
        });
        break;
      case "workspace":
        records = records.filter((record) => record.level === "workspace" || record.policy.workspaceId === query.context.workspaceId);
        break;
      case "company":
        records = records.filter((record) => record.level === "company" || record.policy.companyId === query.context.companyId);
        break;
      case "engagement":
        records = records.filter((record) => record.level === "engagement" || record.policy.engagementId === query.context.engagementId);
        break;
      case "module":
        records = records.filter((record) => record.moduleId === (query.moduleId ?? query.context.moduleId));
        break;
      case "semantic":
        return [];
      default:
        break;
    }

    return records.slice(0, limit);
  }

  semanticContractNotice(): ReturnType<typeof createEmeError> {
    return createEmeError(
      "semantic_not_implemented",
      "Semantic search is contract-only. Use keyword or entity modes.",
    );
  }

  private keywordFilter(records: EmeMemoryRecord[], text: string): EmeMemoryRecord[] {
    const terms = text.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return records;
    return records.filter((record) => {
      const haystack = [
        record.key,
        record.label,
        record.category,
        ...record.keywords,
        stringifyMemoryValue(record.value),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }
}

export class NullEmeSemanticSearch implements EmeSemanticSearchContract {
  async search(): Promise<EmeMemoryRecord[]> {
    return [];
  }
}
