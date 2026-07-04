import type { MaterialityCommandCenterData } from "@/types/materiality-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { MaterialityCommandCenter } from "../command-center/materiality-command-center";
import { MaterialityCreateExperience } from "@/components/materiality/create/materiality-create-experience";

type MaterialityOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  planningApproved: boolean;
  hasMateriality: boolean;
  commandCenter: MaterialityCommandCenterData | null;
  labels: Dictionary["materiality"]["workspace"];
  materialityLabels: Dictionary["materiality"];
};

export function MaterialityOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  planningApproved,
  hasMateriality,
  commandCenter,
  labels,
  materialityLabels,
}: MaterialityOverviewExperienceProps) {
  if (!hasMateriality || !commandCenter) {
    return (
      <MaterialityCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        labels={materialityLabels.empty}
        gateLabels={{ planningGateDescription: labels.planningGateDescription }}
      />
    );
  }

  return (
    <MaterialityCommandCenter
      locale={locale}
      slug={slug}
      commandCenter={commandCenter}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      labels={labels}
      materialityLabels={materialityLabels}
    />
  );
}
