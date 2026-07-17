import { describe, expect, it } from "vitest";
import { assertMethodologyConfiguration } from "./methodology-configuration";

export const METHODOLOGYCONFIGURATION_TEST_SUITE = "methodology-configuration";

describe("methodology-configuration", () => {
  it("requires organization context", () => {
    expect(() => assertMethodologyConfiguration({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertMethodologyConfiguration({ organizationId: "org-1" })).not.toThrow();
  });
});
