import { applyMappingRules } from "@/lib/fs-mapping/mapping";
import { buildNormalizedDataset } from "@/lib/fs-mapping/datasets";
import { validateFsMapping } from "@/lib/fs-mapping/validation";
import { buildMappingHierarchy, buildStatementTree } from "@/lib/fs-mapping/hierarchy";
import { seedRulesForStandard } from "@/lib/fs-mapping/rules";
import type {
  FsMappingDashboardMetrics,
  FsMappingLine,
  FsMappingRule,
  FsMappingSet,
  FsMappingSetStatus,
  FsNormalizedDataset,
  FsTrialBalanceAccountInput,
  FsValidationReport,
} from "@/types/fs-mapping";

export type FsMappingEngineRunInput = {
  mappingSet: FsMappingSet;
  accounts: FsTrialBalanceAccountInput[];
  rules: FsMappingRule[];
};

export type FsMappingEngineResult = {
  lines: FsMappingLine[];
  dataset: FsNormalizedDataset;
  validation: FsValidationReport;
  hierarchy: ReturnType<typeof buildMappingHierarchy>;
  statementTree: ReturnType<typeof buildStatementTree>;
  metrics: FsMappingDashboardMetrics;
};

/**
 * Financial Statement Mapping Engine — orchestration of pure domain stages.
 * Trial Balance → Classification → Mapping → Aggregation → Section Builder → Validation → Dataset
 */
export class FsMappingEngine {
  run(input: FsMappingEngineRunInput): FsMappingEngineResult {
    const lines = applyMappingRules({
      mappingSetId: input.mappingSet.id,
      organizationId: input.mappingSet.organizationId,
      workspaceId: input.mappingSet.workspaceId,
      engagementId: input.mappingSet.engagementId,
      accounts: input.accounts,
      rules: input.rules,
    });

    const validation = validateFsMapping({ lines, rules: input.rules });
    const dataset = buildNormalizedDataset({
      standard: input.mappingSet.standard,
      comparativeMode: input.mappingSet.comparativeMode,
      lines,
      rules: input.rules,
    });
    const hierarchy = buildMappingHierarchy(lines);
    const statementTree = buildStatementTree(dataset.sections.flatMap((section) => section.lines));

    return {
      lines,
      dataset,
      validation,
      hierarchy,
      statementTree,
      metrics: {
        coveragePct: validation.coveragePct,
        mappedAccounts: validation.mappedCount,
        unmappedAccounts: validation.unmappedCount,
        validationErrors: validation.errors.length,
        validationWarnings: validation.warnings.length,
        versionCount: input.mappingSet.versionCount,
        setStatus: input.mappingSet.setStatus,
        standard: input.mappingSet.standard,
      },
    };
  }

  seedRules(mappingSet: FsMappingSet) {
    return seedRulesForStandard({
      standard: mappingSet.standard,
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
    });
  }
}

export function nextWorkflowStatus(
  current: FsMappingSetStatus,
  action: "validate" | "approve" | "publish" | "archive" | "reopen",
): FsMappingSetStatus | null {
  switch (action) {
    case "validate":
      return current === "draft" || current === "validated" ? "validated" : null;
    case "approve":
      return current === "validated" ? "approved" : null;
    case "publish":
      return current === "approved" ? "published" : null;
    case "archive":
      return current !== "archived" ? "archived" : null;
    case "reopen":
      return current === "validated" || current === "approved" ? "draft" : null;
    default:
      return null;
  }
}

export const fsMappingEngine = new FsMappingEngine();
