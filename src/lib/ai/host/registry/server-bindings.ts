import "server-only";

/**
 * Server-only Host Action invokers.
 * Binds registered server actions — never repositories, never Supabase clients here.
 */

import type { AiHostActionRegistry } from "@/lib/ai/host/registry";
import type { AiHostActionInvoker, AiHostInvokeResult } from "@/lib/ai/host/types";
import { createHostError } from "@/lib/ai/host/utils";
import type { ActionResult } from "@/lib/actions/types";

function fromActionResult(
  label: string,
  entityType: string,
  result: ActionResult<Record<string, unknown>>,
  idKeys: string[] = ["id", "companyId", "engagementId", "packageId"],
): AiHostInvokeResult {
  if (!result.success) {
    return {
      ok: false,
      summary: `${label} failed.`,
      affectedEntities: [],
      errors: [createHostError(result.error.code, result.error.message)],
    };
  }
  const data = (result.data ?? {}) as Record<string, unknown>;
  let entityId = "unknown";
  for (const key of idKeys) {
    if (typeof data[key] === "string") {
      entityId = data[key] as string;
      break;
    }
  }
  return {
    ok: true,
    summary: `${label} completed through Host Execution Layer.`,
    affectedEntities: [{ type: entityType, id: entityId }],
    data,
  };
}

/**
 * Attach live invokers for known modules. Remaining catalog entries stay unbound
 * (executor fails closed — never silent repository access).
 */
export async function bindLiveHostActionInvokers(
  registry: AiHostActionRegistry,
): Promise<number> {
  let bound = 0;

  const { createCompanyAction } = await import("@/lib/actions/company/create-company");
  const { updateCompanyAction } = await import("@/lib/actions/company/update-company");
  const { archiveCompanyAction } = await import("@/lib/actions/company/archive-company");
  const { createEngagementAction } = await import("@/lib/actions/engagement/create-engagement");
  const { updateEngagementAction } = await import("@/lib/actions/engagement/update-engagement");
  const { archiveEngagementAction } = await import("@/lib/actions/engagement/archive-engagement");

  const bindings: Array<{ id: string; invoke: AiHostActionInvoker }> = [
    {
      id: "company.create",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Create Company",
          "company",
          (await createCompanyAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["companyId", "id"],
        ),
    },
    {
      id: "company.update",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Update Company",
          "company",
          (await updateCompanyAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["companyId", "id"],
        ),
    },
    {
      id: "company.archive",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Archive Company",
          "company",
          (await archiveCompanyAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["companyId", "id"],
        ),
    },
    {
      id: "engagement.create",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Create Engagement",
          "engagement",
          (await createEngagementAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["engagementId", "id"],
        ),
    },
    {
      id: "engagement.update",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Update Engagement",
          "engagement",
          (await updateEngagementAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["engagementId", "id"],
        ),
    },
    {
      id: "engagement.archive",
      invoke: async ({ payload }) =>
        fromActionResult(
          "Archive Engagement",
          "engagement",
          (await archiveEngagementAction(payload as never)) as ActionResult<Record<string, unknown>>,
          ["engagementId", "id"],
        ),
    },
  ];

  for (const entry of bindings) {
    registry.bindInvoker(entry.id, entry.invoke);
    bound += 1;
  }

  return bound;
}
