import type { FsMappingStandard } from "@/types/fs-mapping";
import type { FsRenderStandard } from "@/types/fs-rendering";

/**
 * Standards mapping between FSME dataset standards and FSRE presentations.
 */
export function mapMappingStandardToRenderStandard(
  standard: FsMappingStandard,
): FsRenderStandard {
  switch (standard) {
    case "ifrs":
      return "ifrs";
    case "sme_ifrs":
      return "sme_ifrs";
    case "local_gaap":
      return "local_gaap";
    case "custom":
      return "custom";
    default:
      return "custom";
  }
}

export function supportedRenderStandards(): FsRenderStandard[] {
  return ["ifrs", "sme_ifrs", "local_gaap", "custom"];
}
