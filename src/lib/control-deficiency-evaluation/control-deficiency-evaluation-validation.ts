import { ValidationError } from "@/lib/errors";

export function assertControlDeficiencyEvaluationValidation(input: {
  controlId: string;
  deficiencyTitle: string;
}): void {
  if (!input.controlId.trim() || !input.deficiencyTitle.trim()) {
    throw new ValidationError("Control deficiency evaluation requires control id and title");
  }
}
