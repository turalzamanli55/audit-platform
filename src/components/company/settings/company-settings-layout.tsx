import type { ReactNode } from "react";
import { CompanySettingsConflictBanner } from "./company-settings-conflict-banner";
import { CompanySettingsNav, type CompanySettingsNavItem } from "./company-settings-nav";
import { CompanySettingsReadOnlyBadge } from "./company-settings-readonly-badge";
import { CompanySettingsSaveIndicator } from "./company-settings-save-indicator";
import { CompanySettingsUnsavedBanner } from "./company-settings-unsaved-banner";

export type CompanySettingsLayoutLabels = {
  title: string;
  description: string;
  navAriaLabel: string;
  readOnlyBadge: string;
  saveIdle: string;
  saveSaving: string;
  saveSaved: string;
  saveError: string;
  unsavedMessage: string;
  discardLabel: string;
  saveLabel: string;
  savingLabel: string;
  conflictTitle: string;
  conflictDescription: string;
  conflictRefresh: string;
  conflictDiscard: string;
};

type CompanySettingsLayoutProps = {
  navItems: CompanySettingsNavItem[];
  labels: CompanySettingsLayoutLabels;
  canEdit: boolean;
  children: ReactNode;
};

export function CompanySettingsLayout({
  navItems,
  labels,
  canEdit,
  children,
}: CompanySettingsLayoutProps) {
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
        <CompanySettingsSaveIndicator
          idleLabel={labels.saveIdle}
          savingLabel={labels.saveSaving}
          savedLabel={labels.saveSaved}
          errorLabel={labels.saveError}
        />
      </div>

      <CompanySettingsConflictBanner
        title={labels.conflictTitle}
        description={labels.conflictDescription}
        refreshLabel={labels.conflictRefresh}
        discardLabel={labels.conflictDiscard}
      />

      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[12rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CompanySettingsNav items={navItems} ariaLabel={labels.navAriaLabel} />
        </aside>
        <div className="min-w-0 space-y-8">{children}</div>
      </div>

      <CompanySettingsUnsavedBanner
        message={labels.unsavedMessage}
        discardLabel={labels.discardLabel}
        saveLabel={labels.saveLabel}
        savingLabel={labels.savingLabel}
      />
    </div>
  );
}
