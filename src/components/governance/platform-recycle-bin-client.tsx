"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RecycleBinExperience, type GovernanceLabels } from "@/components/governance/recycle-bin-experience";
import type { RecycleBinItem } from "@/lib/object-lifecycle";
import {
  restoreGovernedAction,
  bulkRestoreGovernedAction,
  permanentDeleteGovernedAction,
  bulkPermanentDeleteGovernedAction,
  requestExportBeforeDeleteAction,
  setLegalHoldGovernedAction,
  previewRestoreGovernedAction,
} from "@/lib/platform-console/actions/governance";
import { useToast } from "@/components/ui";

export function PlatformRecycleBinClient({
  items,
  labels,
  locale,
}: {
  items: RecycleBinItem[];
  labels: GovernanceLabels;
  locale: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  function refresh() {
    startTransition(() => router.refresh());
  }

  return (
    <RecycleBinExperience
      items={items}
      labels={labels}
      locale={locale}
      allowPermanentDelete
      allowLegalHold
      loadPreview={async ({ objectType, objectId, mode }) => {
        const result = await previewRestoreGovernedAction({ objectType, objectId, mode });
        if (!result.success) throw new Error(result.error.message);
        return {
          objectsToRestore: result.data.objectsToRestore.map((o) => ({
            objectType: o.objectType,
            id: o.id,
            name: o.name,
          })),
          dependencies: result.data.dependencies,
        };
      }}
      onRestore={async ({ objectType, objectId, organizationId, mode }) => {
        const result = await restoreGovernedAction({
          objectType,
          objectId,
          organizationId,
          mode,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastRestored, variant: "success" });
        refresh();
      }}
      onBulkRestore={async ({ items: selected, mode }) => {
        const result = await bulkRestoreGovernedAction({
          items: selected.map((i) => ({
            objectType: i.objectType,
            objectId: i.objectId,
            organizationId: i.organizationId,
          })),
          mode,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastRestored, variant: "success" });
        refresh();
      }}
      onExport={async ({ objectType, objectId, organizationId }) => {
        if (!organizationId) return;
        const result = await requestExportBeforeDeleteAction({
          objectType,
          objectId,
          organizationId,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastExported, variant: "success" });
      }}
      onPermanentDelete={async (input) => {
        const result = await permanentDeleteGovernedAction({
          objectType: input.objectType,
          objectId: input.objectId,
          organizationId: input.organizationId,
          reason: {
            code: input.reasonCode,
            customText: input.reasonText || null,
          },
          confirmation: input.confirmation,
          allowBeforeRetention: input.allowBeforeRetention,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastDeleted, variant: "success" });
        refresh();
      }}
      onBulkPermanentDelete={async (input) => {
        const result = await bulkPermanentDeleteGovernedAction({
          items: input.items.map((i) => ({
            objectType: i.objectType,
            objectId: i.objectId,
            organizationId: i.organizationId,
          })),
          reason: { code: input.reasonCode, customText: input.reasonText || null },
          confirmation: input.confirmation,
          allowBeforeRetention: input.allowBeforeRetention,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastDeleted, variant: "success" });
        refresh();
      }}
      onToggleLegalHold={async ({ objectType, objectId, organizationId, enabled }) => {
        if (!organizationId) return;
        const result = await setLegalHoldGovernedAction({
          objectType,
          objectId,
          organizationId,
          enabled,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastHoldUpdated, variant: "success" });
        refresh();
      }}
    />
  );
}
