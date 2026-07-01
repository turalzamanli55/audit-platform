"use client";

import { Button } from "@/components/ui/button";
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
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border/60 bg-background/95 px-4 py-4 shadow-md backdrop-blur-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
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
  );
}
