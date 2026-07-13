import { classifyFsAccount } from "@/lib/fs-mapping/classification";
import type {
  FsMappingLine,
  FsMappingRule,
  FsMappingRuleType,
  FsTrialBalanceAccountInput,
} from "@/types/fs-mapping";

export type ApplyMappingInput = {
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  accounts: FsTrialBalanceAccountInput[];
  rules: FsMappingRule[];
};

/**
 * Statement Mapping — apply rules to classified TB accounts.
 * Supports one-to-one, many-to-one, one-to-many, formula, calculated, conditional.
 */
export function applyMappingRules(input: ApplyMappingInput): FsMappingLine[] {
  const activeRules = input.rules.filter((rule) => rule.isActive);
  const now = new Date().toISOString();
  const lines: FsMappingLine[] = [];

  for (const [index, account] of input.accounts.entries()) {
    const classification = classifyFsAccount(account.accountCode, account.accountName);
    const net =
      account.netAmount ??
      (account.debit ?? 0) - (account.credit ?? 0);

    const matched = findMatchingRules(account.accountCode, activeRules);
    const primary = matched[0] ?? null;
    const isMapped = Boolean(primary);

    lines.push({
      id: `tmp_${account.accountCode}_${index}`,
      mappingSetId: input.mappingSetId,
      mappingRuleId: primary?.id ?? null,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      engagementId: input.engagementId,
      trialBalanceLineId: account.id ?? null,
      accountCode: account.accountCode,
      accountName: account.accountName,
      classification: primary?.classification ?? classification.classification,
      classificationConfidence: classification.confidence,
      statementSection: primary?.targetSection ?? classification.statementSection,
      targetLineCode: primary?.targetLineCode ?? null,
      targetLineLabel: primary?.ruleName ?? null,
      parentLineCode: null,
      hierarchyLevel: 1,
      aggregationMethod: primary?.aggregationMethod ?? "sum",
      currentYearAmount: net,
      previousYearAmount: account.previousYearAmount ?? null,
      multiYearAmounts: [],
      isMapped,
      isOrphan: false,
      isCalculated: isCalculatedRule(primary?.ruleType),
      sortOrder: index,
      metadataJson: {
        matchedRuleCodes: matched.map((rule) => rule.ruleCode),
        ruleType: primary?.ruleType ?? null,
      },
      createdAt: now,
      updatedAt: now,
      version: 1,
    });

    // one-to-many: secondary targets get calculated companion entries
    for (const secondary of matched.slice(1)) {
      if (secondary.ruleType !== "one_to_many") continue;
      lines.push({
        id: `tmp_${account.accountCode}_${secondary.ruleCode}`,
        mappingSetId: input.mappingSetId,
        mappingRuleId: secondary.id,
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        engagementId: input.engagementId,
        trialBalanceLineId: account.id ?? null,
        accountCode: account.accountCode,
        accountName: account.accountName,
        classification: secondary.classification,
        classificationConfidence: classification.confidence,
        statementSection: secondary.targetSection,
        targetLineCode: secondary.targetLineCode,
        targetLineLabel: secondary.ruleName,
        parentLineCode: primary?.targetLineCode ?? null,
        hierarchyLevel: 2,
        aggregationMethod: secondary.aggregationMethod,
        currentYearAmount: applyWeight(net, secondary.weight),
        previousYearAmount:
          account.previousYearAmount == null
            ? null
            : applyWeight(account.previousYearAmount, secondary.weight),
        multiYearAmounts: [],
        isMapped: true,
        isOrphan: false,
        isCalculated: true,
        sortOrder: index,
        metadataJson: { derivedFrom: primary?.ruleCode ?? null },
        createdAt: now,
        updatedAt: now,
        version: 1,
      });
    }
  }

  return lines;
}

function findMatchingRules(accountCode: string, rules: FsMappingRule[]): FsMappingRule[] {
  return rules
    .filter((rule) => rule.sourceAccountCodes.includes(accountCode) || matchesPattern(accountCode, rule))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function matchesPattern(accountCode: string, rule: FsMappingRule): boolean {
  return rule.sourceAccountCodes.some((source) => {
    if (source.endsWith("*")) return accountCode.startsWith(source.slice(0, -1));
    return source === accountCode;
  });
}

function isCalculatedRule(ruleType?: FsMappingRuleType | null): boolean {
  return ruleType === "formula" || ruleType === "calculated" || ruleType === "conditional";
}

function applyWeight(amount: number, weight: number | null): number {
  if (weight == null) return amount;
  return Math.round(amount * weight * 100) / 100;
}

export function buildDefaultIfrsRules(input: {
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
}): Omit<FsMappingRule, "id" | "createdAt" | "updatedAt" | "version">[] {
  const base = {
    mappingSetId: input.mappingSetId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    engagementId: input.engagementId,
    formulaExpression: null as string | null,
    conditionExpression: null as string | null,
    weight: null as number | null,
    isActive: true,
    allowsNegative: true,
    metadataJson: {} as Record<string, unknown>,
  };

  return [
    {
      ...base,
      ruleCode: "IFRS-CA-CASH",
      ruleName: "Cash and cash equivalents",
      ruleType: "many_to_one",
      sourceAccountCodes: ["10*", "1000", "1010", "1020"],
      targetLineCode: "BS-CA-CASH",
      targetSection: "statement_of_financial_position",
      classification: "current_assets",
      aggregationMethod: "sum",
      sortOrder: 10,
    },
    {
      ...base,
      ruleCode: "IFRS-REV",
      ruleName: "Revenue",
      ruleType: "many_to_one",
      sourceAccountCodes: ["4*", "7*"],
      targetLineCode: "PL-REV",
      targetSection: "statement_of_profit_or_loss",
      classification: "revenue",
      aggregationMethod: "sum",
      sortOrder: 20,
    },
    {
      ...base,
      ruleCode: "IFRS-COS",
      ruleName: "Cost of sales",
      ruleType: "many_to_one",
      sourceAccountCodes: ["50*", "51*"],
      targetLineCode: "PL-COS",
      targetSection: "statement_of_profit_or_loss",
      classification: "cost_of_sales",
      aggregationMethod: "sum",
      sortOrder: 30,
    },
    {
      ...base,
      ruleCode: "IFRS-EQ",
      ruleName: "Equity",
      ruleType: "many_to_one",
      sourceAccountCodes: ["3*"],
      targetLineCode: "EQ-TOTAL",
      targetSection: "statement_of_changes_in_equity",
      classification: "equity",
      aggregationMethod: "sum",
      sortOrder: 40,
    },
  ];
}
