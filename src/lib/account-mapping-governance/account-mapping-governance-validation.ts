import { ValidationError } from "@/lib/errors";

/** Account mapping governance validation. */
export function assertAccountMappingGovernanceEntry(input: {
  accountCode: string;
  fsLineCode: string;
}): void {
  if (!input.accountCode.trim() || !input.fsLineCode.trim()) {
    throw new ValidationError("Account mapping governance requires account and FS line codes");
  }
}
