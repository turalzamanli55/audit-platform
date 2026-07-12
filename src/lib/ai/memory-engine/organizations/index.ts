import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

/** Organization memory — methodology, templates, approval flow, firm policies. */
export class EmeOrganizationMemoryStore extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "organization", defaultVisibility: "organization" });
  }

  remember(context: AiRuntimeContext, input: Parameters<EmeScopedMemoryStore["remember"]>[1]) {
    return super.remember(context, {
      ...input,
      level: "organization",
      policy: {
        ...input.policy,
        organizationId: context.organizationId,
        visibility: "organization",
      },
    });
  }

  listForOrganization(context: AiRuntimeContext) {
    if (!context.organizationId) return [];
    return this.storage.listRecords({
      scope: { organizationId: context.organizationId },
      level: "organization",
      status: "active",
    });
  }
}
