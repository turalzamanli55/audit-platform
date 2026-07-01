"use client";

import { useCompanySettings } from "@/lib/company/use-company-settings";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsFieldRow, CompanySettingsSelectRow } from "../company-settings-row";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

type CompanySettingsFinancialSectionProps = {
  labels: Dictionary["companies"]["settings"];
  createLabels: Dictionary["companies"]["create"];
};

export function CompanySettingsFinancialSection({
  labels,
  createLabels,
}: CompanySettingsFinancialSectionProps) {
  const { draft, canEdit, updateDraft } = useCompanySettings();
  const section = labels.sections.financial;

  const monthOptions = MONTHS.map((month) => ({
    value: String(month),
    label: createLabels.months[month - 1] ?? String(month),
  }));

  const dayOptions = DAYS.map((day) => ({
    value: String(day),
    label: String(day),
  }));

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-financial"
    >
      <CompanySettingsGroup title={section.groupTitle} description={section.groupDescription}>
        <CompanySettingsFieldRow
          label={createLabels.functionalCurrency}
          htmlFor="settings-functional-currency"
          canEdit={canEdit}
          value={draft.functionalCurrency}
          onChange={(value) => updateDraft({ functionalCurrency: value.toUpperCase() })}
          hint={section.currencyHint}
        />
        <CompanySettingsFieldRow
          label={createLabels.presentationCurrency}
          htmlFor="settings-presentation-currency"
          canEdit={canEdit}
          value={draft.presentationCurrency}
          onChange={(value) => updateDraft({ presentationCurrency: value.toUpperCase() })}
          hint={createLabels.optional}
        />
        <CompanySettingsSelectRow
          label={createLabels.fiscalYearEndMonth}
          htmlFor="settings-fiscal-month"
          canEdit={canEdit}
          value={String(draft.fiscalYearEndMonth)}
          onChange={(value) => updateDraft({ fiscalYearEndMonth: Number(value) })}
          options={monthOptions}
        />
        <CompanySettingsSelectRow
          label={createLabels.fiscalYearEndDay}
          htmlFor="settings-fiscal-day"
          canEdit={canEdit}
          value={String(draft.fiscalYearEndDay)}
          onChange={(value) => updateDraft({ fiscalYearEndDay: Number(value) })}
          options={dayOptions}
        />
      </CompanySettingsGroup>
    </CompanySettingsSectionShell>
  );
}
