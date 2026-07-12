import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

/** Workspace memory — selected company, engagement, module, filters, searches. */
export class EmeWorkspaceMemoryStore extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "workspace", defaultVisibility: "workspace" });
  }

  rememberSelection(context: AiRuntimeContext) {
    const records = [];
    if (context.companyId) {
      records.push(
        this.remember(context, {
          key: "selected_company",
          level: "workspace",
          category: "selected_company",
          label: "Selected Company",
          value: { companyId: context.companyId, slug: context.companySlug },
        }),
      );
    }
    if (context.engagementId) {
      records.push(
        this.remember(context, {
          key: "selected_engagement",
          level: "workspace",
          category: "selected_engagement",
          label: "Selected Engagement",
          value: { engagementId: context.engagementId, slug: context.engagementSlug },
        }),
      );
    }
    if (context.moduleId) {
      records.push(
        this.remember(context, {
          key: "selected_module",
          level: "workspace",
          category: "selected_module",
          label: "Selected Module",
          value: context.moduleId,
        }),
      );
    }
    if (Object.keys(context.filters).length > 0) {
      records.push(
        this.remember(context, {
          key: "active_filters",
          level: "workspace",
          category: "active_filters",
          label: "Active Filters",
          value: context.filters,
        }),
      );
    }
    return records;
  }
}
