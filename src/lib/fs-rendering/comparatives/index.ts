import type { FsRenderComparativeMode } from "@/types/fs-rendering";

/**
 * Comparatives — current / previous / multi-year presentation modes.
 */
export function comparativeModeLabel(mode: FsRenderComparativeMode): string {
  switch (mode) {
    case "current_period":
      return "Current Period";
    case "previous_period":
      return "Previous Period";
    case "multi_year":
      return "Multi-year";
    default:
      return mode;
  }
}

export function showsPreviousColumn(mode: FsRenderComparativeMode): boolean {
  return mode === "previous_period" || mode === "multi_year";
}
