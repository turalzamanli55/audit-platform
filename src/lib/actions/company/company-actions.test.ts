import { describe, expect, it } from "vitest";
import { COMPANY_PERMISSIONS } from "@/constants/company";

describe("company permissions and audit", () => {
  it("uses permission codes instead of role names", () => {
    expect(COMPANY_PERMISSIONS.READ).toBe("company.read");
    expect(COMPANY_PERMISSIONS.CONFIGURE).toBe("company.configure");
    expect(COMPANY_PERMISSIONS.ADMINISTER).toBe("company.administer");
  });

  it("defines expected company audit event codes", () => {
    const events = [
      "company.created",
      "company.updated",
      "company.settings.updated",
      "company.archived",
      "company.restored",
    ];

    expect(events).toHaveLength(5);
    expect(events.every((event) => event.startsWith("company."))).toBe(true);
  });
});
