import type { FsAggregatedLine, FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  FsRenderComparativeMode,
  FsRenderLayoutMode,
  FsRenderLineStyle,
  FsRenderedLine,
} from "@/types/fs-rendering";
import { formatAmount, resolveFormatting } from "@/lib/fs-rendering/formatting";
import type { FsRenderFormattingOptions } from "@/types/fs-rendering";

/**
 * Line Renderer — indentation, styles, comparative values.
 */
export function renderLine(input: {
  line: FsAggregatedLine;
  index: number;
  layoutMode: FsRenderLayoutMode;
  comparativeMode: FsRenderComparativeMode;
  formatting: FsRenderFormattingOptions;
  parentCodes: Set<string>;
}): FsRenderedLine {
  const style = resolveLineStyle(input.line, input.parentCodes);
  const indentation = resolveIndentation(input.layoutMode, input.line, style);
  const amount = pickCurrentAmount(input.line, input.comparativeMode);
  const previousAmount = pickPreviousAmount(input.line, input.comparativeMode);
  const formatting = resolveFormatting(input.formatting);

  return {
    lineCode: input.line.lineCode,
    label: input.line.lineLabel,
    amount,
    previousAmount,
    multiYearAmounts: [],
    formattedAmount: formatAmount(amount, formatting),
    formattedPreviousAmount:
      previousAmount == null ? null : formatAmount(previousAmount, formatting),
    indentation,
    style,
    isHidden: style === "hidden",
    isCalculated: input.line.isCalculated || style === "calculated",
    referenceCode: null,
    crossReferenceCode: null,
    sourceAccountCodes: [...input.line.sourceAccountCodes],
  };
}

export function renderLinesFromDatasetSection(input: {
  lines: FsAggregatedLine[];
  layoutMode: FsRenderLayoutMode;
  comparativeMode: FsRenderComparativeMode;
  formatting: FsRenderFormattingOptions;
}): FsRenderedLine[] {
  const parentCodes = new Set(
    input.lines
      .filter((line) => line.isCalculated || line.method === "sum")
      .map((line) => line.lineCode),
  );

  const rendered = input.lines.map((line, index) =>
    renderLine({
      line,
      index,
      layoutMode: input.layoutMode,
      comparativeMode: input.comparativeMode,
      formatting: input.formatting,
      parentCodes,
    }),
  );

  return applyLayoutMode(rendered, input.layoutMode);
}

function resolveLineStyle(line: FsAggregatedLine, parentCodes: Set<string>): FsRenderLineStyle {
  if (line.isCalculated) return "calculated";
  if (line.lineLabel.toLowerCase().includes("total") && line.lineLabel.toLowerCase().includes("comprehensive")) {
    return "double_total";
  }
  if (line.lineLabel.toLowerCase().startsWith("total")) return "total";
  if (line.lineLabel.toLowerCase().includes("subtotal")) return "subtotal";
  if (parentCodes.has(line.lineCode) && line.sourceAccountCodes.length > 1) return "bold";
  return "normal";
}

function resolveIndentation(
  layoutMode: FsRenderLayoutMode,
  line: FsAggregatedLine,
  style: FsRenderLineStyle,
): number {
  if (layoutMode === "flat") return 0;
  if (style === "total" || style === "double_total") return 0;
  if (layoutMode === "collapsed") return 0;
  if (layoutMode === "tree" || layoutMode === "grouped" || layoutMode === "expanded") {
    return line.isCalculated ? 0 : 1;
  }
  return 0;
}

function pickCurrentAmount(line: FsAggregatedLine, mode: FsRenderComparativeMode): number {
  if (mode === "previous_period") return line.previousYearAmount ?? 0;
  return line.amount;
}

function pickPreviousAmount(
  line: FsAggregatedLine,
  mode: FsRenderComparativeMode,
): number | null {
  if (mode === "current_period") return null;
  if (mode === "previous_period") return line.amount;
  return line.previousYearAmount;
}

function applyLayoutMode(lines: FsRenderedLine[], mode: FsRenderLayoutMode): FsRenderedLine[] {
  if (mode === "collapsed") {
    return lines.filter((line) => line.style === "total" || line.style === "double_total" || line.style === "subtotal" || line.indentation === 0);
  }
  if (mode === "flat") {
    return lines.map((line) => ({ ...line, indentation: 0 }));
  }
  return lines.filter((line) => !line.isHidden);
}

export function collectDatasetLines(dataset: FsNormalizedDataset | null): FsAggregatedLine[] {
  if (!dataset) return [];
  return dataset.sections.flatMap((section) => section.lines);
}
