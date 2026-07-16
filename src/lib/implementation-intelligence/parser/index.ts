/**
 * Parse capability/module intent from PROJECT_BIBLE via ECIE parser.
 */
import { parseCapabilitiesFromBible } from "@/lib/capability-intelligence/parser";
import { classifyCapability } from "@/lib/capability-intelligence/classification";
import { assignImplementationPhase } from "@/lib/capability-intelligence/phases";
import { assignBusinessWeight } from "@/lib/capability-intelligence/weights";
import type { CapabilityClass, ImplementationPhase } from "@/lib/capability-intelligence/types";
import type { ParsedCapability } from "@/lib/capability-intelligence/types";

export type ImplementationIntent = ParsedCapability & {
  classes: CapabilityClass[];
  phase: ImplementationPhase;
  weight: "critical" | "high" | "medium" | "low" | "informational";
};

export function parseImplementationIntents(cwd = process.cwd()): {
  intents: ImplementationIntent[];
  modules: Array<{ id: string; name: string; domainId: string }>;
  domains: Array<{ id: string; name: string }>;
} {
  const parsed = parseCapabilitiesFromBible(cwd);
  const intents: ImplementationIntent[] = parsed.capabilities.map((capability) => {
    const classes = classifyCapability(capability);
    const phase = assignImplementationPhase(capability, classes);
    const weight = assignBusinessWeight(capability, classes);
    return { ...capability, classes, phase, weight };
  });
  return {
    intents,
    modules: parsed.modules,
    domains: parsed.domains,
  };
}
