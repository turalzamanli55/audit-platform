import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  IfrsDisclosureRequirement,
  IfrsNoteStandard,
} from "@/types/ifrs-notes";
import { resolveRequirementsForStandard } from "@/lib/ifrs-notes/requirements";

/**
 * Disclosure Resolver — determine applicable disclosures from dataset presence.
 */
export function resolveApplicableDisclosures(input: {
  standard: IfrsNoteStandard;
  dataset: FsNormalizedDataset | null;
}): IfrsDisclosureRequirement[] {
  const catalog = resolveRequirementsForStandard(input.standard);
  const classifications = new Set(
    (input.dataset?.sections ?? [])
      .flatMap((section) => section.lines)
      .map((line) => line.classification),
  );

  return catalog.map((requirement) => {
    if (requirement.disclosureKind === "mandatory") {
      return { ...requirement, isRequired: true };
    }
    if (requirement.disclosureKind === "optional" || requirement.disclosureKind === "custom") {
      const triggered = requirement.triggerClassifications.some((classification) =>
        classifications.has(classification as never),
      );
      return { ...requirement, isRequired: triggered };
    }
    // conditional
    if (requirement.triggerClassifications.length === 0) {
      return { ...requirement, isRequired: true };
    }
    const triggered = requirement.triggerClassifications.some((classification) =>
      classifications.has(classification as never),
    );
    return { ...requirement, isRequired: triggered };
  });
}
