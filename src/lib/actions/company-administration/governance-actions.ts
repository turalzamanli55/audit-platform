"use server";

import { revalidatePath } from "next/cache";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { createServiceClient } from "@/lib/supabase/service";
import { requireCompanyAdministrator } from "@/lib/company-administration/guards";
import { ValidationError } from "@/lib/errors";
import {
  loadRecycleBin,
  orchestrateRestore,
  orchestrateSoftDelete,
  buildRestorePreview,
  type DeleteReasonInput,
  type LifecycleObjectType,
  type RestoreMode,
} from "@/lib/object-lifecycle";

function revalidateAdmin(): void {
  revalidatePath("/[locale]/app/administration", "page");
  revalidatePath("/app/administration");
}

export const loadCompanyRecycleBinAction = createAuthenticatedAction<
  { limit?: number },
  Awaited<ReturnType<typeof loadRecycleBin>>
>({ module: "company.governance.recycle_bin.list" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const service = createServiceClient();
  return loadRecycleBin(service, {
    organizationId: actor.organizationId,
    limit: input.limit ?? 200,
  });
});

export const companySoftDeleteGovernedAction = createAuthenticatedAction<
  {
    objectType: LifecycleObjectType;
    objectId: string;
    workspaceId?: string | null;
    reason: DeleteReasonInput;
  },
  { id: string }
>({ module: "company.governance.soft_delete" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  if (input.objectType === "organization") {
    throw new ValidationError("Company administrators cannot delete the organization");
  }
  const service = createServiceClient();
  const result = await orchestrateSoftDelete(service, {
    objectType: input.objectType,
    objectId: input.objectId,
    actorUserId: actor.id,
    organizationId: actor.organizationId,
    workspaceId: input.workspaceId,
    reason: input.reason,
  });
  revalidateAdmin();
  return result;
});

export const companyPreviewRestoreAction = createAuthenticatedAction<
  {
    objectType: LifecycleObjectType;
    objectId: string;
    mode: RestoreMode;
  },
  Awaited<ReturnType<typeof buildRestorePreview>>
>({ module: "company.governance.restore.preview" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const service = createServiceClient();
  const preview = await buildRestorePreview(service, input.objectType, input.objectId, input.mode);
  if (preview.root.organizationId && preview.root.organizationId !== actor.organizationId) {
    throw new ValidationError("Object does not belong to this company");
  }
  return preview;
});

export const companyRestoreGovernedAction = createAuthenticatedAction<
  {
    objectType: LifecycleObjectType;
    objectId: string;
    mode: RestoreMode;
  },
  { restoredIds: string[] }
>({ module: "company.governance.restore" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const service = createServiceClient();
  const preview = await buildRestorePreview(service, input.objectType, input.objectId, input.mode);
  if (preview.root.organizationId && preview.root.organizationId !== actor.organizationId) {
    throw new ValidationError("Object does not belong to this company");
  }
  const result = await orchestrateRestore(service, {
    objectType: input.objectType,
    objectId: input.objectId,
    mode: input.mode,
    actorUserId: actor.id,
    organizationId: actor.organizationId,
  });
  revalidateAdmin();
  return result;
});

export const companyBulkRestoreGovernedAction = createAuthenticatedAction<
  {
    items: Array<{ objectType: LifecycleObjectType; objectId: string }>;
    mode: RestoreMode;
  },
  { restored: string[]; failed: Array<{ id: string; message: string }> }
>({ module: "company.governance.restore.bulk" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const service = createServiceClient();
  const restored: string[] = [];
  const failed: Array<{ id: string; message: string }> = [];
  for (const item of input.items) {
    try {
      const preview = await buildRestorePreview(service, item.objectType, item.objectId, input.mode);
      if (preview.root.organizationId && preview.root.organizationId !== actor.organizationId) {
        failed.push({ id: item.objectId, message: "Outside company scope" });
        continue;
      }
      const result = await orchestrateRestore(service, {
        objectType: item.objectType,
        objectId: item.objectId,
        mode: input.mode,
        actorUserId: actor.id,
        organizationId: actor.organizationId,
      });
      restored.push(...result.restoredIds);
    } catch (error) {
      failed.push({
        id: item.objectId,
        message: error instanceof Error ? error.message : "Restore failed",
      });
    }
  }
  revalidateAdmin();
  return { restored, failed };
});
