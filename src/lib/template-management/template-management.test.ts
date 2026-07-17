import { describe, expect, it } from "vitest";
import { assertTemplateManagementItem } from "./template-management";

export const TEMPLATEMANAGEMENT_TEST_SUITE = "template-management";

describe("template-management", () => {
  it("requires organization context", () => {
    expect(() => assertTemplateManagementItem({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertTemplateManagementItem({ organizationId: "org-1" })).not.toThrow();
  });
});
