import { describe, expect, it } from "vitest";
import { assertExportAndPortabilityRequest } from "./export-and-portability";

export const EXPORTANDPORTABILITY_TEST_SUITE = "export-and-portability";

describe("export-and-portability", () => {
  it("requires organization context", () => {
    expect(() => assertExportAndPortabilityRequest({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertExportAndPortabilityRequest({ organizationId: "org-1" })).not.toThrow();
  });
});
