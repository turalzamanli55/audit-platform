import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  FsRenderPresentation,
  FsRenderValidationReport,
  FsRenderedStatementBundle,
} from "@/types/fs-rendering";
import { FS_RENDER_STATEMENT_TYPES } from "@/constants/fs-rendering";
import { mapMappingStandardToRenderStandard } from "@/lib/fs-rendering/standards";

/**
 * Validation Layer — missing lines/sections, hierarchy, duplicates, references, mismatch.
 */
export function validateRenderedPresentation(input: {
  presentation: FsRenderPresentation;
  dataset: FsNormalizedDataset | null;
  bundle: FsRenderedStatementBundle;
}): FsRenderValidationReport {
  const errors = [];
  const warnings = [];

  if (!input.dataset) {
    errors.push({
      code: "missing_dataset",
      severity: "error" as const,
      message: "Normalized financial statement dataset is missing. Complete FSME mapping first.",
      entityType: "presentation" as const,
      entityId: input.presentation.id,
    });
  }

  const renderedTypes = new Set(input.bundle.statements.map((statement) => statement.statementType));
  for (const required of FS_RENDER_STATEMENT_TYPES) {
    if (!renderedTypes.has(required)) {
      warnings.push({
        code: "missing_sections",
        severity: "warning" as const,
        message: `Statement section not rendered: ${required}.`,
        entityType: "section" as const,
      });
    }
  }

  const seenCodes = new Map<string, number>();
  for (const statement of input.bundle.statements) {
    if (statement.lines.length === 0) {
      warnings.push({
        code: "missing_lines",
        severity: "warning" as const,
        message: `${statement.title} has no renderable lines.`,
        entityType: "section" as const,
      });
    }
    for (const line of statement.lines) {
      seenCodes.set(line.lineCode, (seenCodes.get(line.lineCode) ?? 0) + 1);
      if (line.crossReferenceCode && !statement.lines.some((entry) => entry.lineCode === line.crossReferenceCode)) {
        errors.push({
          code: "broken_references",
          severity: "error" as const,
          message: `Broken cross reference ${line.crossReferenceCode} on ${line.lineCode}.`,
          entityType: "line" as const,
          lineCode: line.lineCode,
        });
      }
      if (line.indentation < 0) {
        errors.push({
          code: "invalid_hierarchy",
          severity: "error" as const,
          message: `Invalid hierarchy indentation on ${line.lineCode}.`,
          entityType: "line" as const,
          lineCode: line.lineCode,
        });
      }
    }
  }

  for (const [code, count] of seenCodes) {
    if (count > 1) {
      errors.push({
        code: "duplicate_presentation",
        severity: "error" as const,
        message: `Duplicate presentation line code ${code}.`,
        entityType: "line" as const,
        lineCode: code,
      });
    }
  }

  if (input.dataset) {
    const mapped = mapMappingStandardToRenderStandard(input.dataset.standard);
    if (mapped && mapped !== input.presentation.standard) {
      warnings.push({
        code: "presentation_mismatch",
        severity: "warning" as const,
        message: `Presentation standard ${input.presentation.standard} differs from dataset standard ${input.dataset.standard}.`,
        entityType: "presentation" as const,
        entityId: input.presentation.id,
      });
    }
  }

  const expected = FS_RENDER_STATEMENT_TYPES.length;
  const renderedStatementCount = input.bundle.statements.length;
  const presentationCoveragePct = Number(
    ((renderedStatementCount / expected) * 100).toFixed(2),
  );

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    presentationCoveragePct,
    renderedStatementCount,
  };
}
