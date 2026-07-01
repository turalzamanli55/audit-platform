"use client";

import { ENTITY_TYPES, INDUSTRY_CLASSIFICATIONS } from "@/constants/company";
import { useCompanySettings } from "@/lib/company/use-company-settings";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsFieldRow, CompanySettingsSelectRow } from "../company-settings-row";
import { CompanySettingsGroup } from "../company-settings-group";
import { CompanySettingsSectionShell } from "../company-settings-section-shell";

type CompanySettingsGeneralSectionProps = {
  labels: Dictionary["companies"]["settings"];
  createLabels: Dictionary["companies"]["create"];
};

export function CompanySettingsGeneralSection({
  labels,
  createLabels,
}: CompanySettingsGeneralSectionProps) {
  const { draft, canEdit, parentOptions, updateDraft } = useCompanySettings();
  const section = labels.sections.general;

  const entityOptions = ENTITY_TYPES.map((value) => ({
    value,
    label: createLabels.entityTypes[value],
  }));

  const industryOptions = INDUSTRY_CLASSIFICATIONS.map((value) => ({
    value,
    label: createLabels.industries[value],
  }));

  const parentSelectOptions = [
    { value: "", label: createLabels.selectParent },
    ...parentOptions.map((option) => ({ value: option.id, label: option.name })),
  ];

  return (
    <CompanySettingsSectionShell
      title={section.title}
      description={section.description}
      headingId="company-settings-general"
    >
      <div className="space-y-8">
        <CompanySettingsGroup title={section.classificationTitle}>
          <CompanySettingsFieldRow
            label={createLabels.jurisdiction}
            htmlFor="settings-jurisdiction"
            canEdit={canEdit}
            value={draft.jurisdiction}
            onChange={(value) => updateDraft({ jurisdiction: value })}
          />
          <CompanySettingsSelectRow
            label={createLabels.entityType}
            htmlFor="settings-entity-type"
            canEdit={canEdit}
            value={draft.entityType}
            onChange={(value) =>
              updateDraft({
                entityType: value as typeof draft.entityType,
                parentCompanyId: value === "subsidiary" ? draft.parentCompanyId : "",
              })
            }
            options={entityOptions}
          />
          {draft.entityType === "subsidiary" ? (
            <CompanySettingsSelectRow
              label={createLabels.parentCompany}
              htmlFor="settings-parent-company"
              canEdit={canEdit}
              value={draft.parentCompanyId}
              onChange={(value) => updateDraft({ parentCompanyId: value })}
              options={parentSelectOptions}
            />
          ) : null}
          <CompanySettingsSelectRow
            label={createLabels.industry}
            htmlFor="settings-industry"
            canEdit={canEdit}
            value={draft.industryClassification}
            onChange={(value) =>
              updateDraft({
                industryClassification: value as typeof draft.industryClassification,
              })
            }
            options={industryOptions}
          />
        </CompanySettingsGroup>

        <CompanySettingsGroup
          title={section.registeredAddressTitle}
          description={section.addressHint}
        >
          <CompanySettingsFieldRow
            label={createLabels.addressLine1}
            htmlFor="settings-registered-line1"
            canEdit={canEdit}
            value={draft.registeredAddressLine1}
            onChange={(value) => updateDraft({ registeredAddressLine1: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressLine2}
            htmlFor="settings-registered-line2"
            canEdit={canEdit}
            value={draft.registeredAddressLine2}
            onChange={(value) => updateDraft({ registeredAddressLine2: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressCity}
            htmlFor="settings-registered-city"
            canEdit={canEdit}
            value={draft.registeredAddressCity}
            onChange={(value) => updateDraft({ registeredAddressCity: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressRegion}
            htmlFor="settings-registered-region"
            canEdit={canEdit}
            value={draft.registeredAddressRegion}
            onChange={(value) => updateDraft({ registeredAddressRegion: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressPostalCode}
            htmlFor="settings-registered-postal"
            canEdit={canEdit}
            value={draft.registeredAddressPostalCode}
            onChange={(value) => updateDraft({ registeredAddressPostalCode: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressCountry}
            htmlFor="settings-registered-country"
            canEdit={canEdit}
            value={draft.registeredAddressCountry}
            onChange={(value) => updateDraft({ registeredAddressCountry: value })}
          />
        </CompanySettingsGroup>

        <CompanySettingsGroup
          title={section.operatingAddressTitle}
          description={section.addressHint}
        >
          <CompanySettingsFieldRow
            label={createLabels.addressLine1}
            htmlFor="settings-operating-line1"
            canEdit={canEdit}
            value={draft.operatingAddressLine1}
            onChange={(value) => updateDraft({ operatingAddressLine1: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressLine2}
            htmlFor="settings-operating-line2"
            canEdit={canEdit}
            value={draft.operatingAddressLine2}
            onChange={(value) => updateDraft({ operatingAddressLine2: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressCity}
            htmlFor="settings-operating-city"
            canEdit={canEdit}
            value={draft.operatingAddressCity}
            onChange={(value) => updateDraft({ operatingAddressCity: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressRegion}
            htmlFor="settings-operating-region"
            canEdit={canEdit}
            value={draft.operatingAddressRegion}
            onChange={(value) => updateDraft({ operatingAddressRegion: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressPostalCode}
            htmlFor="settings-operating-postal"
            canEdit={canEdit}
            value={draft.operatingAddressPostalCode}
            onChange={(value) => updateDraft({ operatingAddressPostalCode: value })}
          />
          <CompanySettingsFieldRow
            label={createLabels.addressCountry}
            htmlFor="settings-operating-country"
            canEdit={canEdit}
            value={draft.operatingAddressCountry}
            onChange={(value) => updateDraft({ operatingAddressCountry: value })}
          />
        </CompanySettingsGroup>
      </div>
    </CompanySettingsSectionShell>
  );
}
