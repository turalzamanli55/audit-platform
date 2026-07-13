import type { FsMappingRule, FsMappingRuleType, FsMappingStandard } from "@/types/fs-mapping";
import { buildDefaultIfrsRules } from "@/lib/fs-mapping/mapping";

/**
 * Rule catalog helpers — validate and seed standard rule packs.
 */
export function assertRuleShape(rule: Pick<FsMappingRule, "ruleType" | "sourceAccountCodes" | "targetLineCode" | "formulaExpression" | "conditionExpression">): string | null {
  if (!rule.targetLineCode.trim()) return "Target line code is required.";
  if (rule.sourceAccountCodes.length === 0 && rule.ruleType !== "formula" && rule.ruleType !== "calculated") {
    return "At least one source account is required.";
  }
  if ((rule.ruleType === "formula" || rule.ruleType === "calculated") && !rule.formulaExpression?.trim()) {
    return "Formula expression is required for formula/calculated rules.";
  }
  if (rule.ruleType === "conditional" && !rule.conditionExpression?.trim()) {
    return "Condition expression is required for conditional rules.";
  }
  return null;
}

export function seedRulesForStandard(input: {
  standard: FsMappingStandard;
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
}): Omit<FsMappingRule, "id" | "createdAt" | "updatedAt" | "version">[] {
  if (input.standard === "ifrs" || input.standard === "sme_ifrs") {
    return buildDefaultIfrsRules(input);
  }
  if (input.standard === "local_gaap") {
    // Local GAAP starts from the IFRS pack and firms customize target codes.
    return buildDefaultIfrsRules(input).map((rule) => ({
      ...rule,
      ruleCode: rule.ruleCode.replace(/^IFRS-/, "LOCAL-"),
      metadataJson: { ...rule.metadataJson, standard: "local_gaap" },
    }));
  }
  // Custom starts empty — firm configures rules explicitly.
  return [];
}

export function describeRuleType(ruleType: FsMappingRuleType): string {
  switch (ruleType) {
    case "one_to_one":
      return "One account maps to one statement line.";
    case "many_to_one":
      return "Many accounts aggregate into one statement line.";
    case "one_to_many":
      return "One account allocates across multiple statement lines.";
    case "formula":
      return "Line value is derived from a formula.";
    case "calculated":
      return "Line value is calculated from other mapped lines.";
    case "conditional":
      return "Mapping applies only when a condition is met.";
    default:
      return ruleType;
  }
}
