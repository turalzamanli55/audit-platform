/**
 * AI Everywhere — module context resolvers.
 * Auto-supply workspace/entity/workflow context. Never ask the user what page they are on.
 */

import type { AiModuleId } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export const AI_INLINE_ACTION_KINDS = [
  "ask",
  "explain",
  "analyze",
  "summarize",
  "suggest",
  "compare",
  "review",
  "generate",
] as const;

export type AiInlineActionKind = (typeof AI_INLINE_ACTION_KINDS)[number];

export type AiInlineCapability = {
  id: string;
  kind: AiInlineActionKind;
  /** Stable label id for i18n mapping. */
  labelId: string;
  /** Default English label — UI prefers i18n when available. */
  label: string;
  /** Utterance template; supports {{object}}, {{module}}, {{selection}}. */
  utteranceTemplate: string;
  requiresSelection?: boolean;
};

export type AiContextResolverInput = {
  context: AiRuntimeContext;
  selectedObjectType?: string | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  entitySummary?: Record<string, unknown> | null;
};

export type AiModuleContextResolution = {
  moduleId: AiModuleId | "dashboard" | "settings";
  displayName: string;
  summary: string;
  capabilities: readonly AiInlineCapability[];
  suggestions: readonly string[];
  relatedObjectTypes: readonly string[];
  knowledgeHints: readonly string[];
  workflowHints: readonly string[];
};

export type AiContextResolver = {
  moduleId: AiModuleId | "dashboard" | "settings";
  resolve(input: AiContextResolverInput): AiModuleContextResolution;
};

export function fillUtteranceTemplate(
  template: string,
  vars: {
    object?: string | null;
    module?: string | null;
    selection?: string | null;
  },
): string {
  return template
    .replaceAll("{{object}}", vars.object?.trim() || "the current item")
    .replaceAll("{{module}}", vars.module?.trim() || "this workspace")
    .replaceAll("{{selection}}", vars.selection?.trim() || "the current selection");
}
