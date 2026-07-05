import type { ReviewCommandCenterData } from "@/types/review-command-center";
import type { ReviewCommandCenterLabels } from "@/lib/review/review-workspace-display";
import { ReviewCommandCenter as ReviewCommandCenterComponent } from "../command-center/review-command-center";
import { ReviewCreateExperience } from "@/components/review/create/review-create-experience";

type ReviewWorkflowLabels = {
  title: string;
  description: string;
  submitAction: string;
  returnAction: string;
  returnConfirmAction: string;
  approveAction: string;
  cancelAction: string;
  returnNotesLabel: string;
  returnNotesPlaceholder: string;
  readOnlyNotice: string;
  submittedNotice: string;
  approvedNotice: string;
  returnedNotice: string;
  errorGeneric: string;
};

type ReviewOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  hasReview: boolean;
  commandCenter: ReviewCommandCenterData | null;
  labels: {
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    navReviewQueue: string;
    navOpenFindings: string;
    navPendingReviews: string;
    navResolvedReviews: string;
    navReviewerNotes: string;
    navComments: string;
    navHistory: string;
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
  commandCenterLabels: ReviewCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: ReviewWorkflowLabels;
  emptyLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
};

export function ReviewOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  hasReview,
  commandCenter,
  labels,
  commandCenterLabels,
  statusLabels,
  workflowLabels,
  emptyLabels,
}: ReviewOverviewExperienceProps) {
  if (!hasReview || !commandCenter) {
    return (
      <ReviewCreateExperience
        canCreate={canCreate}
        fieldworkStarted={fieldworkStarted}
        fieldworkSubstantiallyComplete={fieldworkSubstantiallyComplete}
        labels={emptyLabels}
        gateLabels={{
          fieldworkGateDescription: labels.fieldworkGateDescription,
          fieldworkSubstantiallyCompleteDescription: labels.fieldworkSubstantiallyCompleteDescription,
        }}
      />
    );
  }

  return (
    <ReviewCommandCenterComponent
      locale={locale}
      slug={slug}
      commandCenter={commandCenter}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      labels={labels}
      commandCenterLabels={commandCenterLabels}
      statusLabels={statusLabels}
      workflowLabels={workflowLabels}
    />
  );
}
