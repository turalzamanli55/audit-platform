import type { AiModuleId, AiPlannerIntent } from "@/lib/ai/constants";
import type { AiPlannerDecision, AiPlannerInput } from "@/lib/ai/types/planner";

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

/**
 * AI Planner — deterministic intent routing for the foundation.
 * Does not call LLMs. Decides which governed path to take.
 */
export class AiPlanner {
  plan(input: AiPlannerInput): AiPlannerDecision {
    const utterance = input.utterance.trim().toLowerCase();
    const moduleMatch = input.availableModules.find((module) => {
      const tokens = [module.id, module.name.toLowerCase(), ...module.navigation.sections];
      return tokens.some((token) => utterance.includes(token.replace(/-/g, " ")) || utterance.includes(token));
    });

    if (includesAny(utterance, ["open company", "go to company", "show company"])) {
      return this.decision("call_registered_action", 0.82, "User requested company navigation.", {
        suggestedActionId: "platform.open_company",
        suggestedActionKind: "open_company",
      });
    }

    if (includesAny(utterance, ["open engagement", "go to engagement", "show engagement"])) {
      return this.decision("call_registered_action", 0.82, "User requested engagement navigation.", {
        suggestedActionId: "platform.open_engagement",
        suggestedActionKind: "open_engagement",
      });
    }

    if (includesAny(utterance, ["filter", "apply filter"])) {
      return this.decision("call_registered_action", 0.75, "User requested filter application.", {
        suggestedActionId: "platform.apply_filter",
        suggestedActionKind: "apply_filter",
      });
    }

    if (includesAny(utterance, ["search", "find", "look up"])) {
      return this.decision("search", 0.8, "User requested search.", {
        suggestedActionId: "platform.search",
        suggestedActionKind: "search",
        suggestedPayload: { query: input.utterance.trim() },
      });
    }

    if (includesAny(utterance, ["highlight", "point to", "show me where"])) {
      return this.decision("highlight_ui", 0.72, "User requested UI highlight.", {
        suggestedActionId: "platform.highlight_component",
        suggestedActionKind: "highlight_component",
      });
    }

    if (includesAny(utterance, ["tour", "walkthrough", "guide me"])) {
      return this.decision("call_registered_action", 0.7, "User requested a product tour.", {
        suggestedActionId: "platform.restart_tour",
        suggestedActionKind: "restart_tour",
      });
    }

    if (includesAny(utterance, ["explain", "why", "how does", "what does"])) {
      return this.decision("explain", 0.78, "User requested an explanation.", {
        targetModuleId: (moduleMatch?.id as AiModuleId | undefined) ?? input.context.moduleId,
      });
    }

    if (includesAny(utterance, ["suggest", "recommend", "what should"])) {
      return this.decision("suggest", 0.74, "User requested a suggestion.", {
        targetModuleId: (moduleMatch?.id as AiModuleId | undefined) ?? input.context.moduleId,
      });
    }

    if (
      moduleMatch &&
      includesAny(utterance, ["open", "go to", "navigate", "take me", "show"])
    ) {
      return this.decision("open_module", 0.85, `User requested module ${moduleMatch.id}.`, {
        suggestedActionId: "platform.open_module",
        suggestedActionKind: "open_module",
        suggestedPayload: {
          moduleId: moduleMatch.id,
          href: moduleMatch.navigation.basePath,
        },
        targetModuleId: moduleMatch.id,
      });
    }

    if (includesAny(utterance, ["go to", "navigate", "open page"])) {
      return this.decision("navigate", 0.7, "User requested navigation.", {
        suggestedActionId: "platform.navigate",
        suggestedActionKind: "navigate",
      });
    }

    return this.decision("answer", 0.6, "Default to governed answer path.", {
      targetModuleId: (moduleMatch?.id as AiModuleId | undefined) ?? input.context.moduleId,
    });
  }

  private decision(
    intent: AiPlannerIntent,
    confidence: number,
    rationale: string,
    extras: Partial<
      Pick<
        AiPlannerDecision,
        "suggestedActionId" | "suggestedActionKind" | "suggestedPayload" | "targetModuleId"
      >
    > = {},
  ): AiPlannerDecision {
    return {
      intent,
      confidence,
      rationale,
      suggestedActionId: extras.suggestedActionId ?? null,
      suggestedActionKind: extras.suggestedActionKind ?? null,
      suggestedPayload: extras.suggestedPayload ?? {},
      targetModuleId: extras.targetModuleId ?? null,
    };
  }
}
