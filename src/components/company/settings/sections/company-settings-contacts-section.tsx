"use client";

import { useCompanySettings } from "@/lib/company/use-company-settings";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsFieldRow } from "../company-settings-row";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

type CompanySettingsContactsSectionProps = {
  labels: Dictionary["companies"]["settings"];
  createLabels: Dictionary["companies"]["create"];
};

export function CompanySettingsContactsSection({
  labels,
  createLabels,
}: CompanySettingsContactsSectionProps) {
  const { draft, canEdit, updateDraft } = useCompanySettings();
  const section = labels.sections.contacts;

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-contacts"
    >
      <div className="space-y-8">
        <CompanySettingsGroup title={createLabels.financeContactSection}>
          <CompanySettingsFieldRow
            label={createLabels.contactName}
            htmlFor="settings-finance-name"
            canEdit={canEdit}
            value={draft.financeContactName}
            onChange={(value) => updateDraft({ financeContactName: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.contactTitle}
            htmlFor="settings-finance-title"
            canEdit={canEdit}
            value={draft.financeContactTitle}
            onChange={(value) => updateDraft({ financeContactTitle: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.contactEmail}
            htmlFor="settings-finance-email"
            canEdit={canEdit}
            value={draft.financeContactEmail}
            onChange={(value) => updateDraft({ financeContactEmail: value })}
            type="email"
            autoComplete="email"
          />
          <CompanySettingsFieldRow
            label={createLabels.contactPhone}
            htmlFor="settings-finance-phone"
            canEdit={canEdit}
            value={draft.financeContactPhone}
            onChange={(value) => updateDraft({ financeContactPhone: value })}
            type="tel"
            autoComplete="tel"
          />
        </CompanySettingsGroup>

        <CompanySettingsGroup title={createLabels.auditorContactSection}>
          <CompanySettingsFieldRow
            label={createLabels.contactName}
            htmlFor="settings-auditor-name"
            canEdit={canEdit}
            value={draft.auditorContactName}
            onChange={(value) => updateDraft({ auditorContactName: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.contactTitle}
            htmlFor="settings-auditor-title"
            canEdit={canEdit}
            value={draft.auditorContactTitle}
            onChange={(value) => updateDraft({ auditorContactTitle: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.contactEmail}
            htmlFor="settings-auditor-email"
            canEdit={canEdit}
            value={draft.auditorContactEmail}
            onChange={(value) => updateDraft({ auditorContactEmail: value })}
            type="email"
            autoComplete="email"
          />
          <CompanySettingsFieldRow
            label={createLabels.contactPhone}
            htmlFor="settings-auditor-phone"
            canEdit={canEdit}
            value={draft.auditorContactPhone}
            onChange={(value) => updateDraft({ auditorContactPhone: value })}
            type="tel"
            autoComplete="tel"
          />
        </CompanySettingsGroup>
      </div>
    </CompanySettingsSectionShell>
  );
}
