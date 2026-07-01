import { describe, expect, it } from "vitest";
import { evaluatePasswordStrength } from "./password-strength";

describe("evaluatePasswordStrength", () => {
  it("returns level 0 for empty password", () => {
    expect(evaluatePasswordStrength("").level).toBe(0);
  });

  it("requires minimum length for valid check", () => {
    expect(evaluatePasswordStrength("short").checks.minLength).toBe(false);
    expect(evaluatePasswordStrength("longenough").checks.minLength).toBe(true);
  });

  it("scores strong passwords highest", () => {
    expect(evaluatePasswordStrength("Str0ng!Pass").level).toBe(4);
  });
});
