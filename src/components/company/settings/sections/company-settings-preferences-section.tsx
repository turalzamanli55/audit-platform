"use client";

import { useCompanySettings } from "@/lib/company/use-company-settings";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsFieldRow } from "../company-settings-row";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

type CompanySettingsPreferencesSectionProps = {
  labels: Dictionary["companies"]["settings"];
  createLabels: Dictionary["companies"]["create"];
};

export function CompanySettingsPreferencesSection({
  labels,
  createLabels,
}: CompanySettingsPreferencesSectionProps) {
  const { draft, canEdit, updateDraft } = useCompanySettings();
  const section = labels.sections.preferences;

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-preferences"
    >
      <CompanySettingsGroup title={section.groupTitle} description={section.groupDescription}>
        <CompanySettingsFieldRow
          label={createLabels.tradeName}
          htmlFor="settings-trade-name"
          canEdit={canEdit}
          value={draft.tradeName}
          onChange={(value) => updateDraft({ tradeName: value })}
          hint={section.tradeNameHint}
        />
        <CompanySettingsFieldRow
          label={section.defaultLocale}
          htmlFor="settings-default-locale"
          canEdit={canEdit}
          value={draft.defaultLocale}
          onChange={(value) => updateDraft({ defaultLocale: value })}
          hint={createLabels.optional}
        />
        <CompanySettingsFieldRow
          label={section.dataImportSource}
          htmlFor="settings-data-import"
          canEdit={canEdit}
          value={draft.dataImportSource}
          onChange={(value) => updateDraft({ dataImportSource: value })}
          hint={createLabels.optional}
        />
        <CompanySettingsFieldRow
          label={section.roundingConvention}
          htmlFor="settings-rounding"
          canEdit={canEdit}
          value={draft.roundingConvention}
          onChange={(value) => updateDraft({ roundingConvention: value })}
          hint={createLabels.optional}
        />
      </CompanySettingsGroup>
    </CompanySettingsSectionShell>
  );
}
