import { ValidationError } from "@/lib/errors";
import { canInviteUser, type SubscriptionAndLicensingPlanInput } from "@/lib/subscription-and-licensing/subscription-and-licensing";
import type { TenantType } from "@/constants/saas";

export type UserProvisioningInvitationInput = {
  organizationId: string;
  email: string;
  roleSlug: string;
  tenantType: TenantType;
  seatLimit: number;
  seatsUsed: number;
};

export function assertUserProvisioningInvitation(input: UserProvisioningInvitationInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for user-provisioning");
  }
  if (!input.email?.trim() || !input.email.includes("@")) {
    throw new ValidationError("A valid invitation email is required");
  }
  if (!input.roleSlug?.trim()) {
    throw new ValidationError("Role slug is required");
  }
  if (
    !canInviteUser({
      tenantType: input.tenantType,
      seatLimit: input.seatLimit,
      seatsUsed: input.seatsUsed,
    })
  ) {
    throw new ValidationError(
      input.tenantType === "solo"
        ? "Solo tenants cannot invite additional users"
        : "No remaining licensed seats for invitation",
    );
  }
}

export function createInvitationToken(): string {
  return `inv_${crypto.randomUUID().replace(/-/g, "")}`;
}

export class UserProvisioningEngine {
  assert(input: UserProvisioningInvitationInput): void {
    assertUserProvisioningInvitation(input);
  }
}

export type { SubscriptionAndLicensingPlanInput };
