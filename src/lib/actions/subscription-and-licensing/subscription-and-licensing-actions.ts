"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import {
  assertSubscriptionAndLicensingPlan,
  type SubscriptionAndLicensingPlanInput,
} from "@/lib/subscription-and-licensing/subscription-and-licensing";
import { createServerClient } from "@/lib/supabase/server";
import { SubscriptionAndLicensingRepository } from "@/repositories/subscription-and-licensing/subscription-and-licensing-repository";
import type { RepositoryContext } from "@/types/context";

export type AssignSubscriptionAndLicensingInput = SubscriptionAndLicensingPlanInput & {
  workspaceId?: string | null;
  endsAt?: string | null;
  trialEndsAt?: string | null;
};

export type AssignSubscriptionAndLicensingResult = {
  planId: string;
  planCode: string;
  seatLimit: number;
};

function repoContext(userId: string, organizationId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const assignSubscriptionAndLicensingAction = createAuthenticatedAction<
  AssignSubscriptionAndLicensingInput,
  AssignSubscriptionAndLicensingResult
>({ module: "saas.subscription-and-licensing.assign" }, async (input, context) => {
  assertSubscriptionAndLicensingPlan(input);

  const supabase = await createServerClient();
  const repository = new SubscriptionAndLicensingRepository(
    supabase,
    repoContext(context.userId, input.organizationId),
  );

  const plan = await repository.create({
    organization_id: input.organizationId,
    workspace_id: input.workspaceId ?? null,
    plan_code: input.planCode,
    tenant_type: input.tenantType,
    subscription_status: input.subscriptionStatus ?? "trial",
    seat_limit: input.seatLimit,
    seats_used: input.seatsUsed ?? 0,
    module_entitlements: input.moduleEntitlements ?? {},
    ends_at: input.endsAt ?? null,
    trial_ends_at: input.trialEndsAt ?? null,
  });

  return {
    planId: plan.id,
    planCode: plan.plan_code,
    seatLimit: plan.seat_limit,
  };
});
