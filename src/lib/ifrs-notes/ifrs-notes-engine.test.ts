import { describe, expect, it } from "vitest";
import { resolveApplicableDisclosures } from "@/lib/ifrs-notes/disclosures";
import { resolveRequirementsForStandard } from "@/lib/ifrs-notes/requirements";
import { ifrsNotesEngine, nextIfrsNoteWorkflowStatus } from "@/lib/ifrs-notes/engine";
import { validateIfrsNotes } from "@/lib/ifrs-notes/validation";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { IfrsNotePackage } from "@/types/ifrs-notes";

function notePackage(overrides: Partial<IfrsNotePackage> = {}): IfrsNotePackage {
  return {
    id: "pkg-1",
    organizationId: "org",
    workspaceId: "ws",
    companyId: "co",
    engagementId: "eng",
    mappingSetId: "map-1",
    name: "IFRS notes",
    description: null,
    standard: "ifrs",
    packageStatus: "draft",
    packageVersion: 1,
    versionCount: 0,
    requiredNoteCount: 0,
    completedNoteCount: 0,
    missingNoteCount: 0,
    validationErrorCount: 0,
    validationWarningCount: 0,
    coveragePct: 0,
    summaryJson: {},
    validationJson: {},
    structureJson: {},
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
          {
            lineCode: "BS-REV",
            lineLabel: "Revenue",
            section: "statement_of_profit_or_loss",
            classification: "revenue",
            method: "sum",
            amount: 50,
            previousYearAmount: 40,
            sourceAccountCodes: ["4000"],
            isCalculated: false,
          },
        ],
      },
    ],
  };
}

describe("IFRS Notes Engine", () => {
  it("resolves IFRS/IAS/IFRIC/SIC/SME requirements", () => {
    for (const standard of ["ifrs", "ias", "ifric", "sic", "sme_ifrs"] as const) {
      const requirements = resolveRequirementsForStandard(standard);
      expect(requirements.length).toBeGreaterThan(20);
      expect(requirements.every((entry) => entry.standard === standard)).toBe(true);
    }
  });

  it("marks conditional disclosures from dataset classifications", () => {
    const disclosures = resolveApplicableDisclosures({
      standard: "ifrs",
      dataset: dataset(),
    });
    const cash = disclosures.find((entry) => entry.noteType === "cash");
    const inventories = disclosures.find((entry) => entry.noteType === "inventories");
    expect(cash?.isRequired).toBe(true);
    expect(inventories?.isRequired).toBe(true);
  });

  it("builds structured notes with cross references and validation", () => {
    const run = ifrsNotesEngine.run({
      package: notePackage(),
      dataset: dataset(),
      idFactory: (() => {
        let n = 0;
        return () => `id-${++n}`;
      })(),
    });
    expect(run.structure.sections.length).toBeGreaterThan(10);
    expect(run.crossReferences.length).toBeGreaterThan(0);
    expect(run.validation.requiredCount).toBeGreaterThan(0);
    expect(run.metrics.standard).toBe("ifrs");
  });

  it("detects missing notes in validation", () => {
    const run = ifrsNotesEngine.run({
      package: notePackage(),
      dataset: dataset(),
      idFactory: (() => {
        let n = 0;
        return () => `v-${++n}`;
      })(),
    });
    const report = validateIfrsNotes({
      package: notePackage(),
      sections: run.sections,
      items: run.items,
      crossReferences: run.crossReferences,
    });
    expect(report.missingCount).toBeGreaterThan(0);
    expect(report.warnings.some((issue) => issue.code === "missing_notes")).toBe(true);
  });

  it("advances workflow Draft → Validated → Review → Manager → Partner → Approved → Published", () => {
    expect(nextIfrsNoteWorkflowStatus("draft", "validate")).toBe("validated");
    expect(nextIfrsNoteWorkflowStatus("validated", "submit_review")).toBe("in_review");
    expect(nextIfrsNoteWorkflowStatus("in_review", "manager_review")).toBe("manager_review");
    expect(nextIfrsNoteWorkflowStatus("manager_review", "partner_review")).toBe("partner_review");
    expect(nextIfrsNoteWorkflowStatus("partner_review", "approve")).toBe("approved");
    expect(nextIfrsNoteWorkflowStatus("approved", "publish")).toBe("published");
  });
});
