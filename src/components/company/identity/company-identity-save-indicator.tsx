"use client";

import { useCompanyIdentity } from "@/lib/company/use-company-identity";

type CompanyIdentitySaveIndicatorProps = {
  idleLabel: string;
  savingLabel: string;
  savedLabel: string;
  errorLabel: string;
};

export function CompanyIdentitySaveIndicator({
  idleLabel,
  savingLabel,
  savedLabel,
  errorLabel,
}: CompanyIdentitySaveIndicatorProps) {
  const { saveState, saveError, hasUnsavedChanges } = useCompanyIdentity();

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
