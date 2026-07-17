import { ValidationError } from "@/lib/errors";

/** Control deficiency evaluation rules (PROJECT_BIBLE). */
export type ControlDeficiencyEvaluation = {
  controlId: string;
  deficiencyTitle: string;
  severity: "deficiency" | "significant_deficiency" | "material_weakness";
  remediationRequired: boolean;
};

export function assertControlDeficiencyEvaluation(
  input: ControlDeficiencyEvaluation,
): void {
  if (!input.controlId.trim()) {
    throw new ValidationError("Control id is required");
  }
  if (!input.deficiencyTitle.trim()) {
    throw new ValidationError("Deficiency title is required");
  }
  if (input.severity === "material_weakness" && !input.remediationRequired) {
    throw new ValidationError("Material weaknesses require remediation tracking");
  }
}
