import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  FsRenderPresentation,
  FsRenderStandard,
  FsRenderedStatementBundle,
} from "@/types/fs-rendering";
import { resolveFormatting } from "@/lib/fs-rendering/formatting";
import { renderSections } from "@/lib/fs-rendering/sections";
import { mapMappingStandardToRenderStandard } from "@/lib/fs-rendering/standards";

/**
 * Presentation Engine — builds presentation-ready statement bundles from FSME datasets.
 */
export function buildPresentationBundle(input: {
  presentation: FsRenderPresentation;
  dataset: FsNormalizedDataset | null;
}): FsRenderedStatementBundle {
  const formatting = resolveFormatting({
    ...input.presentation.formattingJson,
    currencyCode: input.presentation.currencyCode,
  });

  const statements = renderSections({
    dataset: input.dataset,
    layoutMode: input.presentation.layoutMode,
    comparativeMode: input.presentation.comparativeMode,
    formatting,
  });

  return {
    standard: resolvePresentationStandard(input.presentation.standard, input.dataset),
    layoutMode: input.presentation.layoutMode,
    comparativeMode: input.presentation.comparativeMode,
    formatting,
    statements,
    sourceDatasetBuiltAt: input.dataset?.builtAt ?? null,
    renderedAt: new Date().toISOString(),
  };
}

function resolvePresentationStandard(
  presentationStandard: FsRenderStandard,
  dataset: FsNormalizedDataset | null,
): FsRenderStandard {
  if (!dataset) return presentationStandard;
  return mapMappingStandardToRenderStandard(dataset.standard) ?? presentationStandard;
}
