import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyWorkspaceEmptySection } from "../company-workspace-empty-section";
import { CompanyWorkspaceSectionShell } from "../company-workspace-section-shell";

type CompanyWorkspaceComplianceSectionProps = {
  labels: Dictionary["companies"]["workspace"];
};

export function CompanyWorkspaceComplianceSection({
  labels,
}: CompanyWorkspaceComplianceSectionProps) {
  const section = labels.sections.compliance;

  return (
    <CompanyWorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-compliance"
    >
      <CompanyWorkspaceEmptySection
        title={section.emptyTitle}
        description={section.emptyDescription}
      />
    </CompanyWorkspaceSectionShell>
  );
}
