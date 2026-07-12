import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

/** User memory — language, style, workflows, verbosity, explanations. */
export class EmeUserMemoryStore extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "user", defaultVisibility: "private" });
  }

  rememberLanguage(context: AiRuntimeContext, language: string) {
    return this.remember(context, {
      key: "preferred_language",
      level: "user",
      category: "language",
      label: "Preferred Language",
      value: language,
    });
  }

  rememberVerbosity(context: AiRuntimeContext, verbosity: "minimal" | "standard" | "verbose") {
    return this.remember(context, {
      key: "ai_verbosity",
      level: "user",
      category: "ai_verbosity",
      label: "AI Verbosity",
      value: verbosity,
    });
  }

  listForUser(context: AiRuntimeContext) {
    return this.storage.listRecords({
      scope: { organizationId: context.organizationId, userId: context.userId },
      level: "user",
      status: "active",
    });
  }
}
