"use client";

import type { ReactNode } from "react";
import { CompanySettingsReadOnlyBadge } from "@/components/company/settings";
import { CompanyIdentityConflictBanner } from "./company-identity-conflict-banner";
import { CompanyIdentitySaveIndicator } from "./company-identity-save-indicator";
import { CompanyIdentityUnsavedBanner } from "./company-identity-unsaved-banner";
import { CompanyIdentityUnsavedGuard } from "./company-identity-unsaved-guard";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";
import type { Dictionary } from "@/i18n/get-dictionary";

type CompanyIdentityChromeProps = {
  labels: Dictionary["companies"]["identity"];
  children: ReactNode;
};

export function CompanyIdentityChrome({ labels, children }: CompanyIdentityChromeProps) {
  const { canEditCompany, canEditClassification } = useCompanyIdentity();
  const canEdit = canEditCompany || canEditClassification;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {labels.title}
            </h2>
            {!canEdit ? <CompanySettingsReadOnlyBadge label={labels.readOnlyBadge} /> : null}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {labels.description}
          </p>
        </div>
        {canEdit ? (
          <CompanyIdentitySaveIndicator
            idleLabel={labels.saveIdle}
            savingLabel={labels.saveSaving}
            savedLabel={labels.saveSaved}
            errorLabel={labels.saveError}
          />
        ) : null}
      </div>

      <CompanyIdentityConflictBanner
        title={labels.conflictTitle}
        description={labels.conflictDescription}
        refreshLabel={labels.conflictRefresh}
        discardLabel={labels.conflictDiscard}
      />

      <CompanyIdentityUnsavedGuard />

      {children}

      <CompanyIdentityUnsavedBanner
        message={labels.unsavedMessage}
        discardLabel={labels.discardLabel}
        saveLabel={labels.saveLabel}
        savingLabel={labels.savingLabel}
      />
    </div>
  );
}
