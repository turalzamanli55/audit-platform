"use client";

import { Button } from "@/components/ui/button";
import { WorkspacePanel } from "@/components/workspace";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";

type CompanyIdentityUnsavedBannerProps = {
  message: string;
  discardLabel: string;
  saveLabel: string;
  savingLabel: string;
};

export function CompanyIdentityUnsavedBanner({
  message,
  discardLabel,
  saveLabel,
  savingLabel,
}: CompanyIdentityUnsavedBannerProps) {
  const { hasUnsavedChanges, saveState, discardChanges, saveChanges, canEditCompany, canEditClassification } =
    useCompanyIdentity();

  if ((!canEditCompany && !canEditClassification) || !hasUnsavedChanges) {
    return null;
  }

  const isSaving = saveState === "saving";

  return (
    <div role="status" aria-live="polite">
      <WorkspacePanel padding="sm" className="mx-auto max-w-3xl shadow-md backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground">{message}</p>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="secondary" onClick={discardChanges} disabled={isSaving}>
            {discardLabel}
          </Button>
          <Button type="button" onClick={saveChanges} disabled={isSaving}>
            {isSaving ? savingLabel : saveLabel}
          </Button>
        </div>
      </div>
      </WorkspacePanel>
    </div>
  );
}
