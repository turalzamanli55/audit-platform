import { describe, expect, it } from "vitest";
import { classifyFsAccount } from "@/lib/fs-mapping/classification";
import { applyMappingRules } from "@/lib/fs-mapping/mapping";
import { aggregateLine, aggregateMany } from "@/lib/fs-mapping/aggregation";
import { validateFsMapping } from "@/lib/fs-mapping/validation";
import { seedRulesForStandard } from "@/lib/fs-mapping/rules";
import { fsMappingEngine, nextWorkflowStatus } from "@/lib/fs-mapping/engine";
import type { FsMappingRule, FsMappingSet } from "@/types/fs-mapping";

function baseSet(overrides: Partial<FsMappingSet> = {}): FsMappingSet {
  return {
    id: "set-1",
    organizationId: "org-1",
    workspaceId: "ws-1",
    companyId: "co-1",
    engagementId: "eng-1",
    trialBalancePackageId: null,
    name: "Test mapping",
    description: null,
    standard: "ifrs",
    setStatus: "draft",
    setVersion: 1,
    comparativeMode: "current_year",
    coveragePct: 0,
    mappedAccountCount: 0,
    unmappedAccountCount: 0,
    validationErrorCount: 0,
    validationWarningCount: 0,
    versionCount: 0,
    summaryJson: {},
    validationJson: {},
    datasetJson: {},
    validatedAt: null,
    validatedBy: null,
    approvedAt: null,
    approvedBy: null,
    publishedAt: null,
    publishedBy: null,
    archivedAt: null,
    archivedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: null,
    updatedBy: null,
    deletedAt: null,
    version: 1,
    ...overrides,
  };
}

function materializeRules(
  seeds: ReturnType<typeof seedRulesForStandard>,
): FsMappingRule[] {
  const now = new Date().toISOString();
  return seeds.map((seed, index) => ({
    ...seed,
    id: `rule-${index}`,
    createdAt: now,
    updatedAt: now,
    version: 1,
  }));
}

describe("FSME classification", () => {
  it("classifies cash as current assets", () => {
    const result = classifyFsAccount("1010", "Cash on hand");
    expect(result.classification).toBe("current_assets");
    expect(result.parentClassification).toBe("assets");
    expect(result.confidence).toBeGreaterThanOrEqual(78);
  });

  it("classifies revenue and finance costs", () => {
    expect(classifyFsAccount("4000", "Sales revenue").classification).toBe("revenue");
    expect(classifyFsAccount("6600", "Interest expense").classification).toBe("finance_costs");
  });
});

describe("FSME aggregation", () => {
  it("supports sum, subtract, average, ratio, weighted, and running total", () => {
    expect(
      aggregateLine({
        lineCode: "A",
        lineLabel: "Sum",
        section: "statement_of_financial_position",
        classification: "current_assets",
        method: "sum",
        amounts: [10, 20],
        sourceAccountCodes: ["1", "2"],
      }).amount,
    ).toBe(30);

    expect(
      aggregateLine({
        lineCode: "B",
        lineLabel: "Sub",
        section: "statement_of_profit_or_loss",
        classification: "revenue",
        method: "subtract",
        amounts: [100, 40],
        sourceAccountCodes: ["1", "2"],
      }).amount,
    ).toBe(60);

    expect(
      aggregateLine({
        lineCode: "C",
        lineLabel: "Avg",
        section: "statement_of_profit_or_loss",
        classification: "operating_expenses",
        method: "average",
        amounts: [10, 20, 30],
        sourceAccountCodes: ["1"],
      }).amount,
    ).toBe(20);

    expect(
      aggregateLine({
        lineCode: "D",
        lineLabel: "Ratio",
        section: "statement_of_profit_or_loss",
        classification: "revenue",
        method: "ratio",
        amounts: [50, 25],
        sourceAccountCodes: ["1", "2"],
      }).amount,
    ).toBe(2);

    expect(
      aggregateLine({
        lineCode: "E",
        lineLabel: "Weighted",
        section: "statement_of_financial_position",
        classification: "current_assets",
        method: "weighted",
        amounts: [10, 30],
        weights: [1, 3],
        sourceAccountCodes: ["1", "2"],
      }).amount,
    ).toBe(25);

    const running = aggregateMany([
      {
        lineCode: "R1",
        lineLabel: "Step 1",
        section: "statement_of_cash_flows",
        classification: "cash_flow",
        method: "running_total",
        amounts: [10],
        sourceAccountCodes: ["1"],
      },
      {
        lineCode: "R2",
        lineLabel: "Step 2",
        section: "statement_of_cash_flows",
        classification: "cash_flow",
        method: "running_total",
        amounts: [5],
        sourceAccountCodes: ["2"],
      },
    ]);
    expect(running[1]?.amount).toBe(15);
  });
});

describe("FSME mapping + validation + engine", () => {
  it("maps TB accounts through IFRS rules and validates coverage", () => {
    const set = baseSet();
    const rules = materializeRules(
      seedRulesForStandard({
        standard: "ifrs",
        mappingSetId: set.id,
        organizationId: set.organizationId,
        workspaceId: set.workspaceId,
        engagementId: set.engagementId,
      }),
    );

    const lines = applyMappingRules({
      mappingSetId: set.id,
      organizationId: set.organizationId,
      workspaceId: set.workspaceId,
      engagementId: set.engagementId,
      accounts: [
        { id: "a1", accountCode: "1010", accountName: "Cash", netAmount: 100 },
        { id: "a2", accountCode: "4000", accountName: "Revenue", netAmount: 250 },
        { id: "a3", accountCode: "9999", accountName: "Suspense", netAmount: 1 },
      ],
      rules,
    });

    expect(lines.filter((line) => line.isMapped)).toHaveLength(2);
    expect(lines.find((line) => line.accountCode === "9999")?.isMapped).toBe(false);

    const validation = validateFsMapping({ lines, rules });
    expect(validation.mappedCount).toBe(2);
    expect(validation.unmappedCount).toBe(1);
    expect(validation.coveragePct).toBeCloseTo(66.67, 1);
    expect(validation.warnings.some((issue) => issue.code === "missing_mapping")).toBe(true);
  });

  it("flags invalid formulas and circular mappings", () => {
    const now = new Date().toISOString();
    const rules: FsMappingRule[] = [
      {
        id: "r1",
        mappingSetId: "set-1",
        organizationId: "org-1",
        workspaceId: "ws-1",
        engagementId: "eng-1",
        ruleCode: "BAD-FORMULA",
        ruleName: "Bad formula",
        ruleType: "formula",
        sourceAccountCodes: [],
        targetLineCode: "CALC-1",
        targetSection: "statement_of_profit_or_loss",
        classification: "revenue",
        aggregationMethod: "formula",
        formulaExpression: null,
        conditionExpression: null,
        weight: null,
        sortOrder: 1,
        isActive: true,
        allowsNegative: true,
        metadataJson: {},
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
      {
        id: "r2",
        mappingSetId: "set-1",
        organizationId: "org-1",
        workspaceId: "ws-1",
        engagementId: "eng-1",
        ruleCode: "CIRCULAR",
        ruleName: "Circular",
        ruleType: "one_to_one",
        sourceAccountCodes: ["CIRCULAR"],
        targetLineCode: "CIRCULAR",
        targetSection: "other",
        classification: "unclassified",
        aggregationMethod: "sum",
        formulaExpression: null,
        conditionExpression: null,
        weight: null,
        sortOrder: 2,
        isActive: true,
        allowsNegative: true,
        metadataJson: {},
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
    ];

    const report = validateFsMapping({ lines: [], rules });
    expect(report.errors.some((issue) => issue.code === "invalid_formula")).toBe(true);
    expect(report.errors.some((issue) => issue.code === "circular_mapping")).toBe(true);
  });

  it("runs the full engine pipeline to a normalized dataset", () => {
    const set = baseSet();
    const rules = materializeRules(
      seedRulesForStandard({
        standard: "ifrs",
        mappingSetId: set.id,
        organizationId: set.organizationId,
        workspaceId: set.workspaceId,
        engagementId: set.engagementId,
      }),
    );

    const result = fsMappingEngine.run({
      mappingSet: set,
      accounts: [
        { accountCode: "1010", accountName: "Cash", netAmount: 80 },
        { accountCode: "3100", accountName: "Share capital", netAmount: -80 },
      ],
      rules,
    });

    expect(result.lines.length).toBe(2);
    expect(result.dataset.sections.length).toBeGreaterThan(0);
    expect(result.metrics.mappedAccounts).toBeGreaterThan(0);
    expect(result.hierarchy.length).toBeGreaterThan(0);
  });

  it("advances workflow statuses correctly", () => {
    expect(nextWorkflowStatus("draft", "validate")).toBe("validated");
    expect(nextWorkflowStatus("validated", "approve")).toBe("approved");
    expect(nextWorkflowStatus("approved", "publish")).toBe("published");
    expect(nextWorkflowStatus("published", "archive")).toBe("archived");
    expect(nextWorkflowStatus("draft", "publish")).toBeNull();
  });

  it("seeds local GAAP from IFRS pack and leaves custom empty", () => {
    const ifrs = seedRulesForStandard({
      standard: "ifrs",
      mappingSetId: "s",
      organizationId: "o",
      workspaceId: "w",
      engagementId: "e",
    });
    const local = seedRulesForStandard({
      standard: "local_gaap",
      mappingSetId: "s",
      organizationId: "o",
      workspaceId: "w",
      engagementId: "e",
    });
    const custom = seedRulesForStandard({
      standard: "custom",
      mappingSetId: "s",
      organizationId: "o",
      workspaceId: "w",
      engagementId: "e",
    });
    expect(local.length).toBe(ifrs.length);
    expect(local[0]?.ruleCode.startsWith("LOCAL-")).toBe(true);
    expect(custom).toHaveLength(0);
  });
});
