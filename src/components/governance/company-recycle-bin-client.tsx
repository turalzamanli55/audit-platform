"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RecycleBinExperience, type GovernanceLabels } from "@/components/governance/recycle-bin-experience";
import type { RecycleBinItem } from "@/lib/object-lifecycle";
import {
  companyRestoreGovernedAction,
  companyBulkRestoreGovernedAction,
  companyPreviewRestoreAction,
} from "@/lib/actions/company-administration/governance-actions";
import { useToast } from "@/components/ui";

export function CompanyRecycleBinClient({
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
      allowPermanentDelete={false}
      allowLegalHold={false}
      loadPreview={async ({ objectType, objectId, mode }) => {
        const result = await companyPreviewRestoreAction({ objectType, objectId, mode });
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
      onRestore={async ({ objectType, objectId, mode }) => {
        const result = await companyRestoreGovernedAction({ objectType, objectId, mode });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastRestored, variant: "success" });
        refresh();
      }}
      onBulkRestore={async ({ items: selected, mode }) => {
        const result = await companyBulkRestoreGovernedAction({
          items: selected.map((i) => ({ objectType: i.objectType, objectId: i.objectId })),
          mode,
        });
        if (!result.success) {
          toast({ title: result.error.message, variant: "error" });
          return;
        }
        toast({ title: labels.toastRestored, variant: "success" });
        refresh();
      }}
    />
  );
}
