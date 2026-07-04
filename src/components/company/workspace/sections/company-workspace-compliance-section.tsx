import type { Dictionary } from "@/i18n/get-dictionary";
import { WorkspaceSectionShell } from "@/components/workspace";
import { CompanyWorkspaceEmptySection } from "../company-workspace-empty-section";

type CompanyWorkspaceComplianceSectionProps = {
  labels: Dictionary["companies"]["workspace"];
};

export function CompanyWorkspaceComplianceSection({
  labels,
}: CompanyWorkspaceComplianceSectionProps) {
  const section = labels.sections.compliance;

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-compliance"
    >
      <CompanyWorkspaceEmptySection
        title={section.emptyTitle}
        description={section.emptyDescription}
      />
    </WorkspaceSectionShell>
  );
}
