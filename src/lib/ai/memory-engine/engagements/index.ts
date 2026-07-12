import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

/** Engagement memory — materiality, risk appetite, review, reporting, opinion. */
export class EmeEngagementMemoryStore extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "engagement", defaultVisibility: "workspace" });
  }

  remember(context: AiRuntimeContext, input: Parameters<EmeScopedMemoryStore["remember"]>[1]) {
    return super.remember(context, {
      ...input,
      level: "engagement",
      policy: {
        ...input.policy,
        engagementId: context.engagementId,
        companyId: context.companyId,
        workspaceId: context.workspaceId,
        organizationId: context.organizationId,
      },
    });
  }

  listForEngagement(context: AiRuntimeContext) {
    if (!context.engagementId) return [];
    return this.storage.listRecords({
      scope: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        engagementId: context.engagementId,
      },
      level: "engagement",
      status: "active",
    });
  }
}
