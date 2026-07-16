/**
 * Implementation phase assignment — future capabilities must not penalize completion.
 */
import type {
  CapabilityClass,
  ImplementationPhase,
  ParsedCapability,
} from "@/lib/capability-intelligence/types";

export function assignImplementationPhase(
  capability: ParsedCapability,
  classes: CapabilityClass[],
): ImplementationPhase {
  if (classes.includes("future") || classes.includes("experimental")) return "future";
  if (classes.includes("planned")) return "future";
  if (classes.includes("enterprise_only")) return "enterprise";

  const text = `${capability.name} ${capability.description} ${capability.moduleId}`.toLowerCase();

  if (
    /foundation|sql.?foundation|auth|organization|workspace|permission|migration.?govern/.test(text) ||
    classes.includes("infrastructure") ||
    classes.includes("security")
  ) {
    return "foundation";
  }

  if (/devops|platform.?audit|capability.?registry|project.?sync/.test(text)) {
    return "production";
  }

  if (capability.priority === "critical") return "beta";
  if (capability.priority === "high") return "beta";
  if (capability.priority === "medium") return "release_candidate";
  if (capability.priority === "low") return "future";
  return "alpha";
}

export function phaseCountsTowardCompletion(phase: ImplementationPhase): boolean {
  return phase !== "future";
}
