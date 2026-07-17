import { ValidationError } from "@/lib/errors";
import type { TenantType } from "@/constants/saas";
import { TENANT_TYPES, SUBSCRIPTION_STATUSES } from "@/constants/saas";

export type SubscriptionAndLicensingPlanInput = {
  organizationId: string;
  planCode: string;
  tenantType: TenantType;
  seatLimit: number;
  seatsUsed?: number;
  subscriptionStatus?: (typeof SUBSCRIPTION_STATUSES)[number];
  moduleEntitlements?: Record<string, boolean>;
};

export function assertSubscriptionAndLicensingPlan(input: SubscriptionAndLicensingPlanInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for subscription-and-licensing");
  }
  if (!input.planCode?.trim()) {
    throw new ValidationError("Plan code is required");
  }
  if (!TENANT_TYPES.includes(input.tenantType)) {
    throw new ValidationError("Invalid tenant type");
  }
  if (!Number.isInteger(input.seatLimit) || input.seatLimit < 0) {
    throw new ValidationError("Seat limit must be a non-negative integer");
  }
  const used = input.seatsUsed ?? 0;
  if (used > input.seatLimit) {
    throw new ValidationError("Seats used cannot exceed licensed seat limit");
  }
  if (input.tenantType === "solo" && input.seatLimit !== 1) {
    throw new ValidationError("Solo tenants are limited to one licensed seat");
  }
}

export function remainingSeats(seatLimit: number, seatsUsed: number): number {
  return Math.max(0, seatLimit - seatsUsed);
}

export function canInviteUser(input: {
  tenantType: TenantType;
  seatLimit: number;
  seatsUsed: number;
}): boolean {
  if (input.tenantType === "solo") return false;
  return remainingSeats(input.seatLimit, input.seatsUsed) > 0;
}

export class SubscriptionAndLicensingEngine {
  assert(input: SubscriptionAndLicensingPlanInput): void {
    assertSubscriptionAndLicensingPlan(input);
  }
}
