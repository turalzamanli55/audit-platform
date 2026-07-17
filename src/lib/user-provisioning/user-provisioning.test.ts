import { describe, expect, it } from "vitest";
import { assertUserProvisioningInvitation, createInvitationToken } from "./user-provisioning";

export const USER_PROVISIONING_TEST_SUITE = "user-provisioning";

describe("user-provisioning", () => {
  it("blocks solo invites and over-seat invites", () => {
    expect(() =>
      assertUserProvisioningInvitation({
        organizationId: "org-1",
        email: "admin@firm.test",
        roleSlug: "auditor",
        tenantType: "solo",
        seatLimit: 1,
        seatsUsed: 0,
      }),
    ).toThrowError(/cannot invite/i);

    expect(() =>
      assertUserProvisioningInvitation({
        organizationId: "org-1",
        email: "partner@firm.test",
        roleSlug: "partner",
        tenantType: "business",
        seatLimit: 3,
        seatsUsed: 3,
      }),
    ).toThrowError(/remaining licensed seats/i);

    expect(() =>
      assertUserProvisioningInvitation({
        organizationId: "org-1",
        email: "partner@firm.test",
        roleSlug: "partner",
        tenantType: "enterprise",
        seatLimit: 100,
        seatsUsed: 12,
      }),
    ).not.toThrow();

    expect(createInvitationToken().startsWith("inv_")).toBe(true);
  });
});
