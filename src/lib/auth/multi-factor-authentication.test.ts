import { describe, expect, it } from "vitest";
import {
  assertFactorId,
  assertValidTotpCode,
  isValidTotpCode,
  normalizeFactorFriendlyName,
} from "./multi-factor-authentication";

const validCodes = ["000000", "123456", " 654321 "];

describe("multi-factor authentication rules", () => {
  it("accepts six-digit TOTP codes", () => {
    for (const code of validCodes) {
      expect(isValidTotpCode(code)).toBe(true);
    }
  });

  it("rejects malformed TOTP codes", () => {
    expect(isValidTotpCode("12345")).toBe(false);
    expect(isValidTotpCode("1234567")).toBe(false);
    expect(isValidTotpCode("12a456")).toBe(false);
    expect(isValidTotpCode("")).toBe(false);
    expect(() => assertValidTotpCode("abc")).toThrowError(/6-digit/);
  });

  it("normalizes and trims codes on assertion", () => {
    expect(assertValidTotpCode(" 123456 ")).toBe("123456");
  });

  it("normalizes factor friendly names", () => {
    expect(normalizeFactorFriendlyName("  My   Phone  ")).toBe("My Phone");
    expect(normalizeFactorFriendlyName(null)).toBe("Authenticator app");
    expect(normalizeFactorFriendlyName(undefined)).toBe("Authenticator app");
    expect(() => normalizeFactorFriendlyName("x".repeat(61))).toThrowError(/60/);
  });

  it("requires a factor id", () => {
    expect(assertFactorId(" factor-1 ")).toBe("factor-1");
    expect(() => assertFactorId("")).toThrowError(/factor/i);
    expect(() => assertFactorId(null)).toThrowError(/factor/i);
  });
});
