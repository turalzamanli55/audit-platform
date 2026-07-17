import { describe, expect, it } from "vitest";
import { assertEntityManagementUnit } from "./entity-management";

export const ENTITYMANAGEMENT_TEST_SUITE = "entity-management";

describe("entity-management", () => {
  it("requires organization context", () => {
    expect(() => assertEntityManagementUnit({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertEntityManagementUnit({ organizationId: "org-1" })).not.toThrow();
  });
});
