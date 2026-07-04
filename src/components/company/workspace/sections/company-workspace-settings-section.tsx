import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { formatAddress, formatDateTime, formatOptionalText } from "@/lib/company/format-company-workspace";
import { CompanyInfoCard, CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { WorkspaceSectionShell } from "@/components/workspace";

type CompanyWorkspaceSettingsSectionProps = {
  company: CompanyWorkspaceView;
  locale: string;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
};

export function CompanyWorkspaceSettingsSection({
  company,
  locale,
  labels,
  companiesLabels,
}: CompanyWorkspaceSettingsSectionProps) {
  const section = labels.sections.settings;
  const { settings } = company;
  const preferences = settings.preferences;
  const branding = settings.branding;
  const registeredAddress = formatAddress(settings.registered_address);
  const operatingAddress = formatAddress(settings.operating_address);

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-settings"
    >
      <div className="space-y-6">
        <CompanyInfoCard title={section.configurationTitle} description={section.configurationDescription}>
          <CompanyInfoList>
            <CompanyInfoRow
              label={companiesLabels.create.tradeName}
              value={formatOptionalText(branding?.trade_name)}
            />
            <CompanyInfoRow
              label={section.defaultLocale}
              value={formatOptionalText(preferences?.default_locale)}
            />
            <CompanyInfoRow
              label={section.dataImportSource}
              value={formatOptionalText(preferences?.data_import_source)}
            />
            <CompanyInfoRow
              label={section.roundingConvention}
              value={formatOptionalText(preferences?.rounding_convention)}
            />
            <CompanyInfoRow label={section.recordVersion} value={String(company.version)} />
            <CompanyInfoRow label={section.settingsVersion} value={String(company.settingsVersion)} />
          </CompanyInfoList>
        </CompanyInfoCard>

        <CompanyInfoCard title={section.addressesTitle} description={section.addressesDescription}>
          <CompanyInfoList>
            <CompanyInfoRow
              label={section.registeredAddress}
              value={registeredAddress ?? labels.noAddress}
            />
            <CompanyInfoRow
              label={section.operatingAddress}
              value={operatingAddress ?? labels.noAddress}
            />
          </CompanyInfoList>
        </CompanyInfoCard>

        <CompanyInfoCard title={section.validationTitle} description={section.validationDescription}>
          <CompanyInfoList>
            <CompanyInfoRow
              label={section.schemaVersion}
              value={String(settings.validation?.schema_version ?? 1)}
            />
            <CompanyInfoRow
              label={section.validatedAt}
              value={
                settings.validation?.validated_at
                  ? formatDateTime(settings.validation.validated_at, locale)
                  : labels.notValidated
              }
            />
          </CompanyInfoList>
        </CompanyInfoCard>
      </div>
    </WorkspaceSectionShell>
  );
}
