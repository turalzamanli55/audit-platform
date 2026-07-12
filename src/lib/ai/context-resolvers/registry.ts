import type { AiModuleId } from "@/lib/ai/constants";
import type {
  AiContextResolver,
  AiContextResolverInput,
  AiModuleContextResolution,
} from "@/lib/ai/context-resolvers/types";
import { dashboardContextResolver } from "@/lib/ai/context-resolvers/dashboard";
import { companiesContextResolver } from "@/lib/ai/context-resolvers/companies";
import { engagementContextResolver } from "@/lib/ai/context-resolvers/engagement";
import { planningContextResolver } from "@/lib/ai/context-resolvers/planning";
import { materialityContextResolver } from "@/lib/ai/context-resolvers/materiality";
import { riskContextResolver } from "@/lib/ai/context-resolvers/risk";
import { fieldworkContextResolver } from "@/lib/ai/context-resolvers/fieldwork";
import { reviewContextResolver } from "@/lib/ai/context-resolvers/review";
import { completionContextResolver } from "@/lib/ai/context-resolvers/completion";
import { reportingContextResolver } from "@/lib/ai/context-resolvers/reporting";
import { opinionContextResolver } from "@/lib/ai/context-resolvers/opinion";
import { financialStatementsContextResolver } from "@/lib/ai/context-resolvers/financial-statements";
import { trialBalanceContextResolver } from "@/lib/ai/context-resolvers/trial-balance";
import { uaieContextResolver } from "@/lib/ai/context-resolvers/uaie";
import { importIntelligenceContextResolver } from "@/lib/ai/context-resolvers/import-intelligence";
import { settingsContextResolver } from "@/lib/ai/context-resolvers/settings";

const RESOLVERS: AiContextResolver[] = [
  dashboardContextResolver,
  companiesContextResolver,
  engagementContextResolver,
  planningContextResolver,
  materialityContextResolver,
  riskContextResolver,
  fieldworkContextResolver,
  reviewContextResolver,
  completionContextResolver,
  reportingContextResolver,
  opinionContextResolver,
  financialStatementsContextResolver,
  trialBalanceContextResolver,
  uaieContextResolver,
  importIntelligenceContextResolver,
  settingsContextResolver,
];

const BY_ID = new Map(RESOLVERS.map((resolver) => [resolver.moduleId, resolver]));

export function getContextResolver(
  moduleId: AiModuleId | "dashboard" | "settings" | null | undefined,
): AiContextResolver {
  if (moduleId && BY_ID.has(moduleId)) return BY_ID.get(moduleId)!;
  return dashboardContextResolver;
}

export function resolveModuleContext(
  input: AiContextResolverInput,
): AiModuleContextResolution {
  const moduleId = input.context.moduleId ?? "dashboard";
  return getContextResolver(moduleId).resolve(input);
}

export function listContextResolvers(): AiContextResolver[] {
  return [...RESOLVERS];
}

export function inferModuleIdFromPath(pathname: string): AiModuleId | "dashboard" | "settings" | null {
  const segments = pathname.split("/").filter(Boolean);
  const priority = [
    "planning",
    "materiality",
    "risk-assessment",
    "fieldwork",
    "review",
    "completion",
    "reporting",
    "opinion",
    "financial-statements",
    "trial-balance",
    "uaie",
    "import-intelligence",
    "settings",
    "users",
    "permissions",
    "companies",
    "engagements",
    "dashboard",
  ] as const;

  for (const candidate of priority) {
    if (segments.includes(candidate)) {
      if (candidate === "users" || candidate === "permissions") return "settings";
      return candidate as AiModuleId | "dashboard" | "settings";
    }
  }

  if (pathname.includes("/app") && !pathname.includes("/engagements")) return "dashboard";
  return null;
}
