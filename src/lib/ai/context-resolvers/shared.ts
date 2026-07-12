import type {
  AiContextResolver,
  AiContextResolverInput,
  AiInlineCapability,
  AiModuleContextResolution,
} from "@/lib/ai/context-resolvers/types";
import type { AiModuleId } from "@/lib/ai/constants";

export function defineModuleResolver(input: {
  moduleId: AiModuleId | "dashboard" | "settings";
  displayName: string;
  summary: string;
  capabilities: readonly AiInlineCapability[];
  suggestions: readonly string[];
  relatedObjectTypes?: readonly string[];
  knowledgeHints?: readonly string[];
  workflowHints?: readonly string[];
}): AiContextResolver {
  return {
    moduleId: input.moduleId,
    resolve(request: AiContextResolverInput): AiModuleContextResolution {
      const objectLabel = request.selectedObjectLabel ?? request.selectedObjectId;
      const suggestions = input.suggestions.map((suggestion) =>
        suggestion
          .replaceAll("{{object}}", objectLabel ?? "this item")
          .replaceAll("{{module}}", input.displayName),
      );
      return {
        moduleId: input.moduleId,
        displayName: input.displayName,
        summary: input.summary,
        capabilities: input.capabilities,
        suggestions,
        relatedObjectTypes: input.relatedObjectTypes ?? [],
        knowledgeHints: input.knowledgeHints ?? [],
        workflowHints: input.workflowHints ?? [],
      };
    },
  };
}

export const CORE_INLINE_CAPABILITIES: readonly AiInlineCapability[] = [
  {
    id: "ask",
    kind: "ask",
    labelId: "ask",
    label: "Ask AI",
    utteranceTemplate: "Help me with {{module}}. Focus on {{object}}.",
  },
  {
    id: "explain",
    kind: "explain",
    labelId: "explain",
    label: "Explain",
    utteranceTemplate: "Explain {{object}} in {{module}} using platform knowledge and current context.",
  },
  {
    id: "analyze",
    kind: "analyze",
    labelId: "analyze",
    label: "Analyze",
    utteranceTemplate: "Analyze {{object}} in {{module}}. Highlight risks, gaps, and next actions.",
  },
  {
    id: "summarize",
    kind: "summarize",
    labelId: "summarize",
    label: "Summarize",
    utteranceTemplate: "Summarize {{object}} in {{module}} for a professional audit audience.",
    requiresSelection: true,
  },
];
