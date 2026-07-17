import { describe, expect, it } from "vitest";
import {
  assertSubscriptionAndLicensingPlan,
  canInviteUser,
  remainingSeats,
} from "./subscription-and-licensing";

export const SUBSCRIPTION_AND_LICENSING_TEST_SUITE = "subscription-and-licensing";

describe("subscription-and-licensing", () => {
  it("enforces seat limits and solo tenant rules", () => {
    expect(() =>
      assertSubscriptionAndLicensingPlan({
        organizationId: "org-1",
        planCode: "business-standard",
        tenantType: "business",
        seatLimit: 10,
        seatsUsed: 11,
      }),
    ).toThrowError(/exceed/i);

    expect(() =>
      assertSubscriptionAndLicensingPlan({
        organizationId: "org-1",
        planCode: "solo",
        tenantType: "solo",
        seatLimit: 2,
      }),
    ).toThrowError(/one licensed seat/i);

    expect(remainingSeats(10, 3)).toBe(7);
    expect(canInviteUser({ tenantType: "solo", seatLimit: 1, seatsUsed: 0 })).toBe(false);
    expect(canInviteUser({ tenantType: "business", seatLimit: 5, seatsUsed: 4 })).toBe(true);
  });
});
