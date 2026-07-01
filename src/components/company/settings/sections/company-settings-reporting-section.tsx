"use client";

import { REPORTING_FRAMEWORKS } from "@/constants/company";
import { useCompanySettings } from "@/lib/company/use-company-settings";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsSelectRow } from "../company-settings-row";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

type CompanySettingsReportingSectionProps = {
  labels: Dictionary["companies"]["settings"];
  createLabels: Dictionary["companies"]["create"];
};

export function CompanySettingsReportingSection({
  labels,
  createLabels,
}: CompanySettingsReportingSectionProps) {
  const { draft, canEdit, updateDraft } = useCompanySettings();
  const section = labels.sections.reporting;

  const frameworkOptions = REPORTING_FRAMEWORKS.map((value) => ({
    value,
    label: createLabels.frameworks[value],
  }));

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-reporting"
    >
      <CompanySettingsGroup title={section.groupTitle} description={section.groupDescription}>
        <CompanySettingsSelectRow
          label={createLabels.reportingFramework}
          htmlFor="settings-reporting-framework"
          canEdit={canEdit}
          value={draft.reportingFramework}
          onChange={(value) =>
            updateDraft({ reportingFramework: value as typeof draft.reportingFramework })
          }
          options={frameworkOptions}
        />
      </CompanySettingsGroup>
    </CompanySettingsSectionShell>
  );
}
