import type { EngagementCommandCenterData } from "@/types/engagement-command-center";
import { EngagementCommandCenter } from "../command-center/engagement-command-center";

type EngagementWorkspaceOverviewExperienceProps = {
  locale: string;
  canUpdate: boolean;
  commandCenter: EngagementCommandCenterData;
  labels: import("@/i18n/get-dictionary").Dictionary["engagements"]["workspace"];
  engagementsLabels: import("@/i18n/get-dictionary").Dictionary["engagements"];
  overviewLabels: import("@/i18n/get-dictionary").Dictionary["engagements"]["overview"];
};

export function EngagementWorkspaceOverviewExperience({
  locale,
  canUpdate,
  commandCenter,
  labels,
  engagementsLabels,
  overviewLabels,
}: EngagementWorkspaceOverviewExperienceProps) {
  return (
    <EngagementCommandCenter
      locale={locale}
      canUpdate={canUpdate}
      commandCenter={commandCenter}
      labels={labels}
      engagementsLabels={engagementsLabels}
      overviewLabels={overviewLabels}
    />
  );
}
