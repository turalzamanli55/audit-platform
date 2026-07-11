import type { OpinionCommandCenterData } from "@/types/opinion-command-center";
import type { OpinionCommandCenterLabels } from "@/lib/opinion/opinion-workspace-display";
import { OpinionCommandCenter as OpinionCommandCenterComponent } from "../command-center/opinion-command-center";
import { OpinionCreateExperience } from "@/components/opinion/create/opinion-create-experience";

type OpinionWorkflowLabels = {
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

type OpinionOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  hasOpinion: boolean;
  commandCenter: OpinionCommandCenterData | null;
  labels: {
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    navOpinionType: string;
    navBasisForOpinion: string;
    navKeyAuditMatters: string;
    navEmphasisOfMatter: string;
    navOtherInformation: string;
    navComments: string;
    navHistory: string;
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
  commandCenterLabels: OpinionCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: OpinionWorkflowLabels;
  emptyLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
};

export function OpinionOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  hasOpinion,
  commandCenter,
  labels,
  commandCenterLabels,
  statusLabels,
  workflowLabels,
  emptyLabels,
}: OpinionOverviewExperienceProps) {
  if (!hasOpinion || !commandCenter) {
    return (
      <OpinionCreateExperience
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
    <OpinionCommandCenterComponent
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
