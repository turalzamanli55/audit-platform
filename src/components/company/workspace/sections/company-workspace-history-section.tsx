import type { Dictionary } from "@/i18n/get-dictionary";
import { WorkspaceSectionShell } from "@/components/workspace";
import { CompanyWorkspaceEmptySection } from "../company-workspace-empty-section";

type CompanyWorkspaceHistorySectionProps = {
  labels: Dictionary["companies"]["workspace"];
};

export function CompanyWorkspaceHistorySection({ labels }: CompanyWorkspaceHistorySectionProps) {
  const section = labels.sections.history;

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-history"
    >
      <CompanyWorkspaceEmptySection
        title={section.emptyTitle}
        description={section.emptyDescription}
      />
    </WorkspaceSectionShell>
  );
}
