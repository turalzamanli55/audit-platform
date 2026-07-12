import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

/** Company memory — industry, ERP, currency, mappings, UAIE corrections. */
export class EmeCompanyMemoryStore extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "company", defaultVisibility: "workspace" });
  }

  remember(context: AiRuntimeContext, input: Parameters<EmeScopedMemoryStore["remember"]>[1]) {
    return super.remember(context, {
      ...input,
      level: "company",
      policy: {
        ...input.policy,
        companyId: context.companyId,
        workspaceId: context.workspaceId,
        organizationId: context.organizationId,
      },
    });
  }

  listForCompany(context: AiRuntimeContext) {
    if (!context.companyId) return [];
    return this.storage.listRecords({
      scope: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        companyId: context.companyId,
      },
      level: "company",
      status: "active",
    });
  }
}
