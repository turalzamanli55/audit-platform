import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const settingsContextResolver = defineModuleResolver({
  moduleId: "settings",
  displayName: "Settings",
  summary: "Explain settings, permissions, and configuration implications.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_permissions",
      kind: "explain",
      labelId: "explainPermissions",
      label: "Explain permissions",
      utteranceTemplate: "Explain permission implications for {{object}} in settings.",
    },
  ],
  suggestions: [
    "Explain this setting.",
    "Explain permission implications.",
    "Summarize configuration risks.",
  ],
  relatedObjectTypes: ["setting", "permission", "role"],
});
