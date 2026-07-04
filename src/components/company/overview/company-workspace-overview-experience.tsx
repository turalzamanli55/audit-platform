import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceCommandCenterData } from "@/types/company-workspace-command-center";
import { CompanyCommandCenter } from "../command-center/company-command-center";

type CompanyWorkspaceOverviewExperienceProps = {
  company: CompanyWorkspaceView;
  locale: string;
  canAdminister: boolean;
  commandCenter: CompanyWorkspaceCommandCenterData;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
  overviewLabels: Dictionary["companies"]["overview"];
};

export function CompanyWorkspaceOverviewExperience({
  company,
  locale,
  canAdminister,
  commandCenter,
  labels,
  companiesLabels,
  overviewLabels,
}: CompanyWorkspaceOverviewExperienceProps) {
  return (
    <CompanyCommandCenter
      company={company}
      locale={locale}
      commandCenter={commandCenter}
      canAdminister={canAdminister}
      labels={labels}
      companiesLabels={companiesLabels}
      overviewLabels={overviewLabels}
    />
  );
}
