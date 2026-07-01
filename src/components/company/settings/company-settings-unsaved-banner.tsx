"use client";

import { Button } from "@/components/ui/button";
import { useCompanySettings } from "@/lib/company/use-company-settings";

type CompanySettingsUnsavedBannerProps = {
  message: string;
  discardLabel: string;
  saveLabel: string;
  savingLabel: string;
};

export function CompanySettingsUnsavedBanner({
  message,
  discardLabel,
  saveLabel,
  savingLabel,
}: CompanySettingsUnsavedBannerProps) {
  const { hasUnsavedChanges, canEdit, saveState, discardChanges, saveChanges } = useCompanySettings();

  if (!canEdit || !hasUnsavedChanges) {
    return null;
  }

  const isSaving = saveState === "saving";

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky bottom-4 z-20 mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border/60 bg-background/95 px-4 py-4 shadow-md backdrop-blur-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-5"
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
