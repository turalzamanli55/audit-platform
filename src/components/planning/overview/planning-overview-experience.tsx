import type { PlanningCommandCenterData } from "@/types/planning-command-center";
import type { PlanningCommentView } from "@/lib/planning/load-planning-comments";
import type { Dictionary } from "@/i18n/get-dictionary";
import { PlanningCommandCenter } from "../command-center/planning-command-center";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  canComment: boolean;
  hasPlan: boolean;
  commandCenter: PlanningCommandCenterData | null;
  comments: PlanningCommentView[];
  engagementReportingFramework?: string | null;
  labels: Dictionary["planning"]["workspace"];
  planningLabels: Dictionary["planning"];
};

export function PlanningOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  canComment,
  hasPlan,
  commandCenter,
  comments,
  engagementReportingFramework,
  labels,
  planningLabels,
}: PlanningOverviewExperienceProps) {
  if (!hasPlan || !commandCenter) {
    return (
      <PlanningCreateExperience
        canCreate={canCreate}
        engagementReportingFramework={engagementReportingFramework}
        labels={planningLabels.empty}
      />
    );
  }

  return (
    <PlanningCommandCenter
      locale={locale}
      slug={slug}
      commandCenter={commandCenter}
      comments={comments}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      canComment={canComment}
      labels={labels}
      planningLabels={planningLabels}
    />
  );
}
