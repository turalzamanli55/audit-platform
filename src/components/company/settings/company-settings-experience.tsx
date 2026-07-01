"use client";

import type { ReactNode } from "react";
import { CompanySettingsProvider } from "@/lib/company/use-company-settings";
import type { CompanySettings } from "@/types/company";
import type { CompanySettingsParentOption } from "@/lib/company/use-company-settings";
import { CompanySettingsLayout, type CompanySettingsLayoutLabels } from "./company-settings-layout";
import type { CompanySettingsNavItem } from "./company-settings-nav";
import { CompanySettingsUnsavedGuard } from "./company-settings-unsaved-guard";

type CompanySettingsExperienceProps = {
  companyId: string;
  settingsVersion: number;
  settings: CompanySettings;
  canEdit: boolean;
  parentOptions: CompanySettingsParentOption[];
  navItems: CompanySettingsNavItem[];
  layoutLabels: CompanySettingsLayoutLabels;
  children: ReactNode;
};

export function CompanySettingsExperience({
  companyId,
  settingsVersion,
  settings,
  canEdit,
  parentOptions,
  navItems,
  layoutLabels,
  children,
}: CompanySettingsExperienceProps) {
  return (
    <CompanySettingsProvider
      companyId={companyId}
      settingsVersion={settingsVersion}
      settings={settings}
      canEdit={canEdit}
      parentOptions={parentOptions}
    >
      <CompanySettingsUnsavedGuard />
      <CompanySettingsLayout navItems={navItems} labels={layoutLabels} canEdit={canEdit}>
        {children}
      </CompanySettingsLayout>
    </CompanySettingsProvider>
  );
}
