import { describe, expect, it } from "vitest";
import { formatAmount, resolveFormatting } from "@/lib/fs-rendering/formatting";
import { fsRenderingEngine, nextRenderWorkflowStatus } from "@/lib/fs-rendering/engine";
import { buildSystemLayouts } from "@/lib/fs-rendering/layouts";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { FsRenderPresentation } from "@/types/fs-rendering";
import { platformRegistryEngine } from "@/lib/platform-registry";

function presentation(overrides: Partial<FsRenderPresentation> = {}): FsRenderPresentation {
  return {
    id: "pres-1",
    organizationId: "org",
    workspaceId: "ws",
    companyId: "co",
    engagementId: "eng",
    mappingSetId: "map-1",
    layoutId: null,
    name: "Test",
    description: null,
    standard: "ifrs",
    presentationStatus: "draft",
    layoutMode: "expanded",
    comparativeMode: "current_period",
    currencyCode: "AZN",
    presentationVersion: 1,
    versionCount: 0,
    renderedStatementCount: 0,
    validationErrorCount: 0,
    validationWarningCount: 0,
    presentationCoveragePct: 0,
    formattingJson: resolveFormatting(),
    validationJson: {},
    renderJson: {},
    historyJson: [],
    summaryJson: {},
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

function dataset(): FsNormalizedDataset {
  return {
    standard: "ifrs",
    comparativeMode: "current_year",
    coveragePct: 100,
    mappedAccountCount: 2,
    unmappedAccountCount: 0,
    builtAt: new Date().toISOString(),
    sections: [
      {
        section: "statement_of_financial_position",
        label: "Statement of Financial Position",
        total: 100,
        previousTotal: 80,
        lines: [
          {
            lineCode: "BS-CA-CASH",
            lineLabel: "Cash and cash equivalents",
            section: "statement_of_financial_position",
            classification: "current_assets",
            method: "sum",
            amount: 100,
            previousYearAmount: 80,
            sourceAccountCodes: ["1010"],
            isCalculated: false,
          },
        ],
      },
      {
        section: "statement_of_profit_or_loss",
        label: "Statement of Profit or Loss",
        total: 50,
        previousTotal: null,
        lines: [
          {
            lineCode: "PL-REV",
            lineLabel: "Revenue",
            section: "statement_of_profit_or_loss",
            classification: "revenue",
            method: "sum",
            amount: 50,
            previousYearAmount: null,
            sourceAccountCodes: ["4000"],
            isCalculated: false,
          },
        ],
      },
    ],
  };
}

describe("FSRE formatting", () => {
  it("formats negatives with parentheses and thousands separators", () => {
    const formatting = resolveFormatting({
      decimals: 2,
      thousandsSeparator: true,
      negativeStyle: "parentheses",
    });
    expect(formatAmount(-1234.5, formatting)).toBe("(1,234.50)");
    expect(formatAmount(0, { ...formatting, zeroSuppression: true })).toBe("");
  });
});

describe("FSRE engine", () => {
  it("renders normalized dataset into statement UI model", () => {
    const result = fsRenderingEngine.run({
      presentation: presentation(),
      dataset: dataset(),
    });
    expect(result.bundle.statements.length).toBeGreaterThan(0);
    expect(result.bundle.statements[0]?.lines[0]?.formattedAmount).toBe("100.00");
    expect(result.validation.renderedStatementCount).toBe(2);
    expect(result.metrics.renderedStatements).toBe(2);
  });

  it("flags missing dataset as validation error", () => {
    const result = fsRenderingEngine.run({
      presentation: presentation(),
      dataset: null,
    });
    expect(result.validation.ok).toBe(false);
    expect(result.validation.errors.some((issue) => issue.code === "missing_dataset")).toBe(true);
  });

  it("advances workflow statuses", () => {
    expect(nextRenderWorkflowStatus("draft", "validate")).toBe("validated");
    expect(nextRenderWorkflowStatus("validated", "approve")).toBe("approved");
    expect(nextRenderWorkflowStatus("approved", "publish")).toBe("published");
    expect(nextRenderWorkflowStatus("draft", "publish")).toBeNull();
  });

  it("builds system layouts for each mode", () => {
    expect(buildSystemLayouts("ifrs")).toHaveLength(5);
  });
});

describe("Platform Registry reports FSRE completion automatically", () => {
  it("returns calculated completion for fs-rendering and platform", () => {
    const module = platformRegistryEngine.getModule("fs-rendering");
    expect(module).not.toBeNull();
    expect(module!.completionPct).toBe(
      platformRegistryEngine.getModuleCompletion("fs-rendering"),
    );
    expect(platformRegistryEngine.getPlatformCompletion()).toBe(
      platformRegistryEngine.buildReport().platformCompletionPct,
    );
  });
});
