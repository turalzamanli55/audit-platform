/**
 * False penalty detection — do not reduce platform completion for out-of-scope caps.
 */
import type {
  FalsePenaltyFinding,
  IntelligentCapability,
} from "@/lib/capability-intelligence/types";

export function detectFalsePenalties(
  capabilities: IntelligentCapability[],
): FalsePenaltyFinding[] {
  const findings: FalsePenaltyFinding[] = [];

  for (const capability of capabilities) {
    if (capability.phase === "future" || capability.classes.includes("future")) {
      findings.push({
        capabilityId: capability.id,
        code: "future_not_penalized",
        message: `${capability.id} is future-scoped`,
        rootCause: "Future capabilities must not reduce platform completion",
      });
    }
    if (capability.classes.includes("optional")) {
      findings.push({
        capabilityId: capability.id,
        code: "optional_not_penalized",
        message: `${capability.id} is optional`,
        rootCause: "Optional capabilities must not block certification",
      });
    }
    if (capability.classes.includes("experimental")) {
      findings.push({
        capabilityId: capability.id,
        code: "experimental_not_penalized",
        message: `${capability.id} is experimental`,
        rootCause: "Experimental capabilities excluded from completion",
      });
    }
    if (capability.lifecycle === "blocked") {
      findings.push({
        capabilityId: capability.id,
        code: "blocked_dependency_not_penalized",
        message: `${capability.id} blocked by dependencies`,
        rootCause: "Blocked capabilities do not drag platform completion; marked blocked instead",
      });
    }
    if (capability.lifecycle === "deprecated") {
      findings.push({
        capabilityId: capability.id,
        code: "deprecated_not_penalized",
        message: `${capability.id} deprecated`,
        rootCause: "Deprecated capabilities excluded from completion",
      });
    }
  }

  return findings;
}
