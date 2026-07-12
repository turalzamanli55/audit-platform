import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type {
  AiOrchestratorIntent,
  AiOrchestratorIntentKind,
} from "@/lib/ai/orchestrator/types";

type IntentRule = {
  kind: AiOrchestratorIntentKind;
  patterns: RegExp[];
  weight: number;
};

const INTENT_RULES: IntentRule[] = [
  { kind: "navigation", patterns: [/\b(open|go to|navigate|take me|show module)\b/i], weight: 1.2 },
  { kind: "search", patterns: [/\b(search|find|lookup|locate)\b/i], weight: 1.1 },
  { kind: "explanation", patterns: [/\b(explain|what is|describe|clarify|meaning)\b/i], weight: 1.1 },
  { kind: "analysis", patterns: [/\b(analy[sz]e|assess|evaluate|review this)\b/i], weight: 1.3 },
  { kind: "validation", patterns: [/\b(validate|check|verify|conform)\b/i], weight: 1.2 },
  { kind: "workflow", patterns: [/\b(next step|continue|workflow|previous step|progress)\b/i], weight: 1.2 },
  { kind: "recommendation", patterns: [/\b(recommend|suggest|advise|should i)\b/i], weight: 1.0 },
  { kind: "reporting", patterns: [/\b(report|reporting|financial statement|opinion letter)\b/i], weight: 1.1 },
  { kind: "accounting", patterns: [/\b(trial balance|ledger|journal|accounting|ifrs)\b/i], weight: 1.1 },
  { kind: "audit", patterns: [/\b(audit|engagement|fieldwork|completion|materiality)\b/i], weight: 1.0 },
  { kind: "planning", patterns: [/\b(planning|audit plan|strategy memo)\b/i], weight: 1.1 },
  { kind: "risk", patterns: [/\b(risk|assertion|control risk|inherent)\b/i], weight: 1.1 },
  { kind: "import", patterns: [/\b(import|upload|mapping|tb import)\b/i], weight: 1.2 },
  { kind: "settings", patterns: [/\b(settings|preferences|configuration|permissions)\b/i], weight: 1.0 },
  { kind: "question", patterns: [/\?$/, /^(who|what|when|where|why|how)\b/i], weight: 0.8 },
];

const PLANNER_INTENT_MAP: Record<string, AiOrchestratorIntentKind> = {
  answer: "question",
  navigate: "navigation",
  open_module: "navigation",
  suggest: "recommendation",
  search: "search",
  explain: "explanation",
  highlight_ui: "navigation",
  call_registered_action: "workflow",
};

/**
 * Intent Analyzer — structural signal detection only.
 * No business rules; maps utterance + planner signals to orchestration intents.
 */
export class AiOrchestratorIntentAnalyzer {
  analyze(input: {
    utterance: string;
    context: AiRuntimeContext;
    planner?: AiPlannerDecision | null;
  }): AiOrchestratorIntent {
    const utterance = input.utterance.trim();
    const scores = new Map<AiOrchestratorIntentKind, number>();
    const signals: string[] = [];

    for (const rule of INTENT_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(utterance)) {
          scores.set(rule.kind, (scores.get(rule.kind) ?? 0) + rule.weight);
          signals.push(`${rule.kind}:${pattern.source}`);
          break;
        }
      }
    }

    if (input.planner) {
      const mapped = PLANNER_INTENT_MAP[input.planner.intent] ?? "question";
      scores.set(mapped, (scores.get(mapped) ?? 0) + 0.75 + input.planner.confidence * 0.5);
      signals.push(`planner:${input.planner.intent}`);
    }

    if (input.context.moduleId) {
      const moduleKind = moduleToIntent(input.context.moduleId);
      if (moduleKind) {
        scores.set(moduleKind, (scores.get(moduleKind) ?? 0) + 0.35);
        signals.push(`module:${input.context.moduleId}`);
      }
    }

    if (scores.size === 0) {
      scores.set("question", 0.5);
      signals.push("fallback:question");
    }

    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    const primary = ranked[0]![0];
    const secondary = ranked.slice(1, 4).map(([kind]) => kind);
    const mixed = ranked.filter(([, score]) => score >= 1).length >= 2;
    const topScore = ranked[0]![1];
    const confidence = Math.min(0.99, Number((0.45 + topScore / 4).toFixed(3)));

    return {
      primary: mixed ? "mixed" : primary,
      secondary: mixed ? [primary, ...secondary.filter((k) => k !== primary)] : secondary,
      confidence,
      rationale: mixed
        ? `Detected mixed orchestration intents led by ${primary}.`
        : `Detected primary orchestration intent ${primary}.`,
      signals,
      mixed,
    };
  }
}

function moduleToIntent(moduleId: string): AiOrchestratorIntentKind | null {
  switch (moduleId) {
    case "planning":
      return "planning";
    case "risk-assessment":
      return "risk";
    case "reporting":
    case "opinion":
    case "financial-statements":
      return "reporting";
    case "trial-balance":
    case "uaie":
      return "accounting";
    case "import-intelligence":
      return "import";
    case "settings":
    case "users":
    case "permissions":
      return "settings";
    case "engagements":
    case "fieldwork":
    case "review":
    case "completion":
    case "materiality":
      return "audit";
    default:
      return null;
  }
}
