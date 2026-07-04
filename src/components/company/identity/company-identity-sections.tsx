"use client";

import { ENTITY_TYPES, INDUSTRY_CLASSIFICATIONS } from "@/constants/company";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";
import type { Dictionary } from "@/i18n/get-dictionary";
import {
  CompanySettingsFieldRow,
  CompanySettingsGroup,
  CompanySettingsSelectRow,
} from "@/components/company/settings";
import { CompanySettingsReadOnlyBadge } from "@/components/company/settings";
import { WorkspaceSectionShell } from "@/components/workspace";

type CompanyIdentityExperienceLabels = Dictionary["companies"]["identity"];

type CompanyIdentityLegalSectionProps = {
  labels: CompanyIdentityExperienceLabels;
  createLabels: Dictionary["companies"]["create"];
};

export function CompanyIdentityLegalSection({
  labels,
  createLabels,
}: CompanyIdentityLegalSectionProps) {
  const { draft, canEditCompany, updateDraft } = useCompanyIdentity();
  const section = labels.sections.legal;

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-legal"
    >
      <CompanySettingsGroup title={section.groupTitle}>
        {!canEditCompany ? (
          <div className="border-b border-border/40 px-4 py-3 sm:px-5">
            <CompanySettingsReadOnlyBadge label={labels.readOnlyBadge} />
          </div>
        ) : null}
        <CompanySettingsFieldRow
          label={createLabels.displayName}
          htmlFor="identity-display-name"
          canEdit={canEditCompany}
          value={draft.name}
          onChange={(value) => updateDraft({ name: value })}
          hint={createLabels.displayNameHint}
        />
        <CompanySettingsFieldRow
          label={createLabels.legalName}
          htmlFor="identity-legal-name"
          canEdit={canEditCompany}
          value={draft.legalName}
          onChange={(value) => updateDraft({ legalName: value })}
        />
        <CompanySettingsFieldRow
          label={createLabels.description}
          htmlFor="identity-description"
          canEdit={canEditCompany}
          value={draft.description}
          onChange={(value) => updateDraft({ description: value })}
        />
      </CompanySettingsGroup>
    </WorkspaceSectionShell>
  );
}

type CompanyIdentityRegistrationSectionProps = {
  labels: CompanyIdentityExperienceLabels;
  createLabels: Dictionary["companies"]["create"];
};

export function CompanyIdentityRegistrationSection({
  labels,
  createLabels,
}: CompanyIdentityRegistrationSectionProps) {
  const { draft, canEditCompany, updateDraft, company } = useCompanyIdentity();
  const section = labels.sections.registration;

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-registration"
    >
      <CompanySettingsGroup title={section.groupTitle}>
        <CompanySettingsFieldRow
          label={createLabels.registrationNumber}
          htmlFor="identity-registration-number"
          canEdit={canEditCompany}
          value={draft.registrationNumber}
          onChange={(value) => updateDraft({ registrationNumber: value })}
          hint={createLabels.optional}
        />
        <CompanySettingsFieldRow
          label={labels.slugLabel}
          htmlFor="identity-slug"
          canEdit={false}
          value={company.slug}
        />
      </CompanySettingsGroup>
    </WorkspaceSectionShell>
  );
}

export function CompanyIdentityClassificationSection({
  labels,
  createLabels,
}: CompanyIdentityLegalSectionProps) {
  const { draft, canEditClassification, parentOptions, updateDraft } = useCompanyIdentity();
  const section = labels.sections.classification;

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
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-classification"
    >
      <CompanySettingsGroup title={section.groupTitle}>
        {!canEditClassification ? (
          <div className="border-b border-border/40 px-4 py-3 sm:px-5">
            <CompanySettingsReadOnlyBadge label={labels.readOnlyConfigureBadge} />
          </div>
        ) : null}
        <CompanySettingsSelectRow
          label={createLabels.entityType}
          htmlFor="identity-entity-type"
          canEdit={canEditClassification}
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
            htmlFor="identity-parent-company"
            canEdit={canEditClassification}
            value={draft.parentCompanyId}
            onChange={(value) => updateDraft({ parentCompanyId: value })}
            options={parentSelectOptions}
          />
        ) : null}
        <CompanySettingsSelectRow
          label={createLabels.industry}
          htmlFor="identity-industry"
          canEdit={canEditClassification}
          value={draft.industryClassification}
          onChange={(value) =>
            updateDraft({
              industryClassification: value as typeof draft.industryClassification,
            })
          }
          options={industryOptions}
        />
      </CompanySettingsGroup>
    </WorkspaceSectionShell>
  );
}

export function CompanyIdentityStatusSection({
  labels,
  companiesLabels,
}: {
  labels: CompanyIdentityExperienceLabels;
  companiesLabels: Dictionary["companies"];
}) {
  const { company } = useCompanyIdentity();
  const section = labels.sections.status;

  const statusLabel = (() => {
    switch (company.status) {
      case "active":
        return companiesLabels.filterActive;
      case "inactive":
        return companiesLabels.filterInactive;
      case "archived":
        return companiesLabels.filterArchived;
      case "suspended":
        return companiesLabels.filterSuspended;
      default:
        return company.status;
    }
  })();

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-status"
    >
      <CompanySettingsGroup>
        <CompanySettingsFieldRow
          label={companiesLabels.columnStatus}
          htmlFor="identity-status"
          canEdit={false}
          value={statusLabel}
        />
        <CompanySettingsFieldRow
          label={section.archivedState}
          htmlFor="identity-archived"
          canEdit={false}
          value={company.isArchived ? labels.archivedYes : labels.archivedNo}
        />
      </CompanySettingsGroup>
    </WorkspaceSectionShell>
  );
}
