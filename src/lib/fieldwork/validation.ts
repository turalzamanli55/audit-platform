import { ValidationError } from "@/lib/errors";

export type CreateFieldworkInput = {
  engagementId: string;
};

export function validateCreateFieldworkInput(input: CreateFieldworkInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }
  return { engagementId: input.engagementId.trim() };
}

export function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value === undefined) return undefined as never;
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
