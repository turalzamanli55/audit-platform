import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { IfrsNoteStandard } from "@/types/ifrs-notes";

/**
 * Dataset adapter — consume FSME normalized dataset for IFRS Notes.
 */
export function mapMappingStandardToNoteStandard(
  standard: string | null | undefined,
): IfrsNoteStandard {
  switch (standard) {
    case "ias":
      return "ias";
    case "ifric":
      return "ifric";
    case "sic":
      return "sic";
    case "sme_ifrs":
    case "sme-ifrs":
    case "ifrs_for_smes":
      return "sme_ifrs";
    case "ifrs":
    default:
      return "ifrs";
  }
}

export function summarizeDatasetForNotes(dataset: FsNormalizedDataset | null): {
  hasDataset: boolean;
  classificationCount: number;
  lineCount: number;
  coveragePct: number;
} {
  if (!dataset) {
    return {
      hasDataset: false,
      classificationCount: 0,
      lineCount: 0,
      coveragePct: 0,
    };
  }
  const lines = dataset.sections.flatMap((section) => section.lines);
  const classifications = new Set(lines.map((line) => line.classification));
  return {
    hasDataset: true,
    classificationCount: classifications.size,
    lineCount: lines.length,
    coveragePct: dataset.coveragePct,
  };
}
