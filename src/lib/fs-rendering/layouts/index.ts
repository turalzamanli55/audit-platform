import type {
  FsRenderLayoutMode,
  FsRenderStandard,
  FsRenderFormattingOptions,
} from "@/types/fs-rendering";
import { resolveFormatting } from "@/lib/fs-rendering/formatting";

export type LayoutBlueprint = {
  layoutCode: string;
  layoutName: string;
  layoutMode: FsRenderLayoutMode;
  standard: FsRenderStandard;
  formatting: FsRenderFormattingOptions;
};

/**
 * Layout Engine — collapsed / expanded / tree / grouped / flat blueprints.
 */
export function buildSystemLayouts(standard: FsRenderStandard): LayoutBlueprint[] {
  const formatting = resolveFormatting({ currencyCode: "AZN" });
  const modes: FsRenderLayoutMode[] = ["collapsed", "expanded", "tree", "grouped", "flat"];
  return modes.map((layoutMode) => ({
    layoutCode: `${standard.toUpperCase()}-${layoutMode.toUpperCase()}`,
    layoutName: `${standardLabel(standard)} · ${layoutModeLabel(layoutMode)}`,
    layoutMode,
    standard,
    formatting,
  }));
}

export function layoutModeLabel(mode: FsRenderLayoutMode): string {
  switch (mode) {
    case "collapsed":
      return "Collapsed";
    case "expanded":
      return "Expanded";
    case "tree":
      return "Tree";
    case "grouped":
      return "Grouped";
    case "flat":
      return "Flat";
    default:
      return mode;
  }
}

export function standardLabel(standard: FsRenderStandard): string {
  switch (standard) {
    case "ifrs":
      return "IFRS";
    case "sme_ifrs":
      return "SME IFRS";
    case "local_gaap":
      return "Local GAAP";
    case "custom":
      return "Custom";
    default:
      return standard;
  }
}
