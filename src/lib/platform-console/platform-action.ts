import "server-only";

import { createAction } from "@/lib/actions/base";
import { getPlatformOwnerIdentity } from "@/lib/auth/platform-owner";
import { AuthorizationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { ActionHandler, ActionOptions, ActionResult } from "@/lib/actions/types";

export type PlatformActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  ownerUserId: string;
  service: SupabaseClient<Database>;
};

type PlatformHandler<TInput, TOutput> = (
  input: TInput,
  context: PlatformActionContext,
) => Promise<TOutput>;

/**
 * Wraps a server action so it can only run for the authenticated Platform Owner.
 * Injects the service-role client because the Platform Owner has no tenant
 * membership and therefore cannot satisfy tenant RLS on its own.
 */
export function createPlatformAction<TInput, TOutput>(
  options: ActionOptions,
  handler: PlatformHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const owner = await getPlatformOwnerIdentity();
    if (!owner) {
      throw new AuthorizationError("Platform Owner access required");
    }

    return handler(input, {
      ...context,
      ownerUserId: owner.userId,
      service: createServiceClient(),
    });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
