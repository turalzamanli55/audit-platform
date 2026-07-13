import { buildPresentationBundle } from "@/lib/fs-rendering/presentation";
import { validateRenderedPresentation } from "@/lib/fs-rendering/validation";
import type {
  FsRenderEngineInput,
  FsRenderEngineResult,
  FsRenderPresentationStatus,
} from "@/types/fs-rendering";

/**
 * Financial Statement Rendering Engine
 * Normalized Dataset → Presentation → Layout → Sections → Lines → Formatting → Validation → UI model
 */
export class FsRenderingEngine {
  run(input: FsRenderEngineInput): FsRenderEngineResult {
    const bundle = buildPresentationBundle({
      presentation: input.presentation,
      dataset: input.dataset,
    });
    const validation = validateRenderedPresentation({
      presentation: input.presentation,
      dataset: input.dataset,
      bundle,
    });

    return {
      bundle,
      validation,
      metrics: {
        renderedStatements: validation.renderedStatementCount,
        validationStatus: !input.dataset
          ? "empty"
          : validation.errors.length > 0
            ? "errors"
            : validation.warnings.length > 0
              ? "warnings"
              : "ok",
        presentationCoveragePct: validation.presentationCoveragePct,
        renderingErrors: validation.errors.length,
        warnings: validation.warnings.length,
        presentationStatus: input.presentation.presentationStatus,
        standard: input.presentation.standard,
        layoutMode: input.presentation.layoutMode,
      },
    };
  }
}

export function nextRenderWorkflowStatus(
  current: FsRenderPresentationStatus,
  action: "validate" | "approve" | "publish" | "archive" | "reopen",
): FsRenderPresentationStatus | null {
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

export const fsRenderingEngine = new FsRenderingEngine();
