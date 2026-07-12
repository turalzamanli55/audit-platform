import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

/** Settings module skills — folder required; minimal governed set. */
export const SETTINGS_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "settings.explain",
    name: "Explain Settings",
    moduleId: "settings",
    description: "Explain platform settings module purpose.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission(),
    intentHints: ["explain settings", "what is settings"],
    plannerIntents: ["explain", "answer"],
    priority: 50,
    buildContext: ({ knowledge }) => ({
      title: "Explain Settings",
      description: knowledge?.purpose ?? "Platform and workspace settings.",
      structuredContext: { focus: "settings_explanation" },
    }),
  }),
  defineAiSkill({
    id: "settings.open_overview",
    name: "Open Settings Overview",
    moduleId: "settings",
    description: "Settings overview navigation metadata — does not navigate.",
    category: "navigation",
    capabilities: ["navigate"],
    permission: workspaceReadPermission(),
    intentHints: ["open settings", "go to settings"],
    plannerIntents: ["navigate", "open_module"],
    priority: 55,
    relatedActionIds: ["platform.open_module"],
    buildContext: ({ knowledge }) => ({
      title: "Open Settings Overview",
      description: "Settings open instruction metadata.",
      structuredContext: {
        focus: "open_settings",
        href: knowledge?.navigation.basePath ?? "/app/settings",
      },
    }),
  }),
];
