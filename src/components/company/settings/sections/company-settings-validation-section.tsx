"use client";

import { useCompanySettings } from "@/lib/company/use-company-settings";
import { formatDateTime } from "@/lib/company/format-company-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

type CompanySettingsValidationSectionProps = {
  locale: string;
  labels: Dictionary["companies"]["settings"];
  workspaceLabels: Dictionary["companies"]["workspace"];
};

export function CompanySettingsValidationSection({
  locale,
  labels,
  workspaceLabels,
}: CompanySettingsValidationSectionProps) {
  const { baselineSettings, settingsVersion } = useCompanySettings();
  const section = labels.sections.validation;
  const validation = baselineSettings.validation;

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-validation"
    >
      <CompanySettingsGroup title={section.groupTitle} description={section.readOnlyNotice}>
        <div className="px-4 py-2 sm:px-5">
          <CompanyInfoList>
            <CompanyInfoRow
              label={workspaceLabels.sections.settings.schemaVersion}
              value={String(validation?.schema_version ?? 1)}
            />
            <CompanyInfoRow
              label={workspaceLabels.sections.settings.validatedAt}
              value={
                validation?.validated_at
                  ? formatDateTime(validation.validated_at, locale)
                  : workspaceLabels.notValidated
              }
            />
            <CompanyInfoRow
              label={workspaceLabels.sections.settings.settingsVersion}
              value={String(settingsVersion)}
            />
          </CompanyInfoList>
        </div>
      </CompanySettingsGroup>
    </CompanySettingsSectionShell>
  );
}
