import type { CompletionCommandCenterData } from "@/types/completion-command-center";
import type { CompletionCommandCenterLabels } from "@/lib/completion/completion-workspace-display";
import { CompletionCommandCenter as CompletionCommandCenterComponent } from "../command-center/completion-command-center";
import { CompletionCreateExperience } from "@/components/completion/create/completion-create-experience";

type CompletionWorkflowLabels = {
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

type CompletionOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  hasCompletion: boolean;
  commandCenter: CompletionCommandCenterData | null;
  labels: {
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    navChecklist: string;
    navOutstandingItems: string;
    navOutstandingItemsPending: string;
    navChecklistResolved: string;
    navManagementLetter: string;
    navComments: string;
    navHistory: string;
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
  commandCenterLabels: CompletionCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: CompletionWorkflowLabels;
  emptyLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
};

export function CompletionOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  hasCompletion,
  commandCenter,
  labels,
  commandCenterLabels,
  statusLabels,
  workflowLabels,
  emptyLabels,
}: CompletionOverviewExperienceProps) {
  if (!hasCompletion || !commandCenter) {
    return (
      <CompletionCreateExperience
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
    <CompletionCommandCenterComponent
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
