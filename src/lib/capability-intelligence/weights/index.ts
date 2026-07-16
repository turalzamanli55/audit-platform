/**
 * Business weighting — security/database outweigh optional UI.
 */
import type {
  BusinessWeight,
  CapabilityClass,
  ParsedCapability,
} from "@/lib/capability-intelligence/types";
import { WEIGHT_NUMERIC } from "@/lib/capability-intelligence/types";

export function assignBusinessWeight(
  capability: ParsedCapability,
  classes: CapabilityClass[],
): BusinessWeight {
  if (classes.includes("security") || classes.includes("database")) {
    return capability.priority === "critical" ? "critical" : "high";
  }
  if (classes.includes("compliance") || classes.includes("infrastructure")) {
    return capability.priority === "low" ? "medium" : capability.priority === "informational" ? "medium" : capability.priority;
  }
  if (classes.includes("optional") || classes.includes("ui")) {
    if (capability.priority === "critical") return "medium";
    if (capability.priority === "high") return "low";
    return "informational";
  }
  if (classes.includes("future") || classes.includes("experimental")) {
    return "informational";
  }
  if (classes.includes("ai") && capability.priority !== "critical") {
    return capability.priority === "high" ? "medium" : "low";
  }
  return capability.priority;
}

export function weightNumeric(weight: BusinessWeight): number {
  return WEIGHT_NUMERIC[weight];
}
