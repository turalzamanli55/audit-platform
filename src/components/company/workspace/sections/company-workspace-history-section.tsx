import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyWorkspaceEmptySection } from "../company-workspace-empty-section";
import { CompanyWorkspaceSectionShell } from "../company-workspace-section-shell";

type CompanyWorkspaceHistorySectionProps = {
  labels: Dictionary["companies"]["workspace"];
};

export function CompanyWorkspaceHistorySection({ labels }: CompanyWorkspaceHistorySectionProps) {
  const section = labels.sections.history;

  return (
    <CompanyWorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-history"
    >
      <CompanyWorkspaceEmptySection
        title={section.emptyTitle}
        description={section.emptyDescription}
      />
    </CompanyWorkspaceSectionShell>
  );
}
