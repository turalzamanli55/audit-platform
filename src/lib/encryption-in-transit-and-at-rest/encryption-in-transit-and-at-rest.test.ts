import { describe, expect, it } from "vitest";
import { assertEncryptionControls } from "./encryption-in-transit-and-at-rest";

export const ENCRYPTIONINTRANSITANDATREST_TEST_SUITE = "encryption-in-transit-and-at-rest";

describe("encryption-in-transit-and-at-rest", () => {
  it("requires organization context", () => {
    expect(() => assertEncryptionControls({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertEncryptionControls({ organizationId: "org-1" })).not.toThrow();
  });
});
