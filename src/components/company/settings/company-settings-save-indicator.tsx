"use client";

import { useCompanySettings } from "@/lib/company/use-company-settings";

type CompanySettingsSaveIndicatorProps = {
  idleLabel: string;
  savingLabel: string;
  savedLabel: string;
  errorLabel: string;
};

export function CompanySettingsSaveIndicator({
  idleLabel,
  savingLabel,
  savedLabel,
  errorLabel,
}: CompanySettingsSaveIndicatorProps) {
  const { saveState, saveError, hasUnsavedChanges } = useCompanySettings();

  let label = idleLabel;
  if (saveState === "saving") {
    label = savingLabel;
  } else if (saveState === "saved") {
    label = savedLabel;
  } else if (saveState === "error") {
    label = saveError ?? errorLabel;
  } else if (hasUnsavedChanges) {
    label = idleLabel;
  }

  return (
    <p
      aria-live="polite"
      className={`text-xs font-medium tracking-wide ${
        saveState === "error"
          ? "text-destructive"
          : saveState === "saved"
            ? "text-success"
            : "text-muted-foreground"
      }`}
    >
      {label}
    </p>
  );
}
