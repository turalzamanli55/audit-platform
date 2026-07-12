import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const uaieContextResolver = defineModuleResolver({
  moduleId: "uaie",
  displayName: "UAIE",
  summary: "Explain mapping, confidence, fingerprints, normalization, and unknown headers.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_mapping",
      kind: "explain",
      labelId: "explainMapping",
      label: "Explain mapping",
      utteranceTemplate: "Explain UAIE mapping for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_confidence",
      kind: "explain",
      labelId: "explainConfidence",
      label: "Explain confidence",
      utteranceTemplate: "Explain confidence score for UAIE mapping {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_fingerprint",
      kind: "explain",
      labelId: "explainFingerprint",
      label: "Explain fingerprint",
      utteranceTemplate: "Explain the fingerprint for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "suggest_normalization",
      kind: "suggest",
      labelId: "suggestNormalization",
      label: "Suggest normalization",
      utteranceTemplate: "Suggest normalization for {{object}}.",
    },
    {
      id: "explain_unknown_headers",
      kind: "explain",
      labelId: "explainUnknownHeaders",
      label: "Explain unknown headers",
      utteranceTemplate: "Explain unknown headers related to {{object}}.",
    },
  ],
  suggestions: [
    "Explain this mapping and confidence.",
    "Explain the fingerprint.",
    "Suggest normalization for unknown headers.",
  ],
  relatedObjectTypes: ["mapping", "fingerprint", "header"],
});
