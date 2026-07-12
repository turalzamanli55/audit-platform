import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type {
  EmeMemoryRecord,
  EmeUserPreferenceSnapshot,
} from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";

const PREFERENCE_KEYS = {
  language: "preferred_language",
  responseLength: "response_length",
  detailLevel: "detail_level",
  auditMethodology: "audit_methodology",
  reportingFormat: "reporting_format",
  financialPresentation: "financial_presentation",
  aiVerbosity: "ai_verbosity",
  explanationStyle: "explanation_style",
} as const;

/**
 * Preference Engine — learns response and audit presentation preferences.
 */
export class EmePreferenceEngine extends EmeScopedMemoryStore {
  constructor(storage: EmeMemoryStorage) {
    super(storage, { level: "preference", defaultVisibility: "private" });
  }

  learnPreference(
    context: AiRuntimeContext,
    key: keyof typeof PREFERENCE_KEYS,
    value: unknown,
    label: string,
  ): EmeMemoryRecord {
    return this.remember(context, {
      key: PREFERENCE_KEYS[key],
      level: "preference",
      category: key,
      label,
      value,
      policy: { source: "learning", confidence: 0.75, learningEnabled: true },
    });
  }

  snapshot(context: AiRuntimeContext): EmeUserPreferenceSnapshot {
    const records = this.storage.listRecords({
      scope: { organizationId: context.organizationId, userId: context.userId },
      level: "preference",
      status: "active",
    });
    const byKey = new Map(records.map((record) => [record.key, record.value]));
    return {
      language: asString(byKey.get(PREFERENCE_KEYS.language)),
      responseLength: asEnum(byKey.get(PREFERENCE_KEYS.responseLength), ["concise", "balanced", "detailed"]),
      detailLevel: asEnum(byKey.get(PREFERENCE_KEYS.detailLevel), ["low", "medium", "high"]),
      auditMethodology: asString(byKey.get(PREFERENCE_KEYS.auditMethodology)),
      reportingFormat: asString(byKey.get(PREFERENCE_KEYS.reportingFormat)),
      financialPresentation: asString(byKey.get(PREFERENCE_KEYS.financialPresentation)),
      aiVerbosity: asEnum(byKey.get(PREFERENCE_KEYS.aiVerbosity), ["minimal", "standard", "verbose"]),
      explanationStyle: asEnum(byKey.get(PREFERENCE_KEYS.explanationStyle), ["brief", "guided", "technical"]),
    };
  }
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}
