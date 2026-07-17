/** Account mapping governance version control helpers. */

export function nextAccountMappingGovernanceVersion(currentVersion: number): number {
  if (!Number.isInteger(currentVersion) || currentVersion < 1) {
    return 1;
  }
  return currentVersion + 1;
}

export function assertAccountMappingGovernanceVersion(version: number): void {
  if (!Number.isInteger(version) || version < 1) {
    throw new Error("Mapping governance version must be a positive integer");
  }
}

export class AccountMappingGovernanceVersioningEngine {
  next(currentVersion: number): number {
    return nextAccountMappingGovernanceVersion(currentVersion);
  }

  assert(version: number): void {
    assertAccountMappingGovernanceVersion(version);
  }
}
