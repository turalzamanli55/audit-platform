import type { ReportingCommandCenterData } from "@/types/reporting-command-center";
import type { ReportingCommandCenterLabels } from "@/lib/reporting/reporting-workspace-display";
import { ReportingCommandCenter as ReportingCommandCenterComponent } from "../command-center/reporting-command-center";
import { ReportingCreateExperience } from "@/components/reporting/create/reporting-create-experience";

type ReportingWorkflowLabels = {
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

type ReportingOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  hasReporting: boolean;
  commandCenter: ReportingCommandCenterData | null;
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
  commandCenterLabels: ReportingCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: ReportingWorkflowLabels;
  emptyLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
};

export function ReportingOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  hasReporting,
  commandCenter,
  labels,
  commandCenterLabels,
  statusLabels,
  workflowLabels,
  emptyLabels,
}: ReportingOverviewExperienceProps) {
  if (!hasReporting || !commandCenter) {
    return (
      <ReportingCreateExperience
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
    <ReportingCommandCenterComponent
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
