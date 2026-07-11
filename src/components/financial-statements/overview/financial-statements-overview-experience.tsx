import type { FinancialStatementsCommandCenterData } from "@/types/financial-statements-command-center";
import type { FinancialStatementsCommandCenterLabels } from "@/lib/financial-statements/financial-statements-workspace-display";
import { FinancialStatementsCommandCenter as FinancialStatementsCommandCenterComponent } from "../command-center/financial-statements-command-center";
import { FinancialStatementsCreateExperience } from "@/components/financial-statements/create/financial-statements-create-experience";

type FinancialStatementsWorkflowLabels = {
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

type FinancialStatementsOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  hasFinancialStatements: boolean;
  commandCenter: FinancialStatementsCommandCenterData | null;
  labels: {
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    navBalanceSheet: string;
    navIncomeStatement: string;
    navCashFlowStatement: string;
    navChangesInEquity: string;
    navNotesLinks: string;
    navComments: string;
    navHistory: string;
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
  };
  commandCenterLabels: FinancialStatementsCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: FinancialStatementsWorkflowLabels;
  emptyLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
};

export function FinancialStatementsOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  hasFinancialStatements,
  commandCenter,
  labels,
  commandCenterLabels,
  statusLabels,
  workflowLabels,
  emptyLabels,
}: FinancialStatementsOverviewExperienceProps) {
  if (!hasFinancialStatements || !commandCenter) {
    return (
      <FinancialStatementsCreateExperience
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
    <FinancialStatementsCommandCenterComponent
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
