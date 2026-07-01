import { ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";
import type { EngagementWizardDraft, EngagementWizardStep } from "./engagement-wizard-draft";
import { validateCreateEngagementInput } from "./validation";

export type WizardFieldErrors = Partial<Record<keyof EngagementWizardDraft | "submit", string>>;

function messageFromError(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }
  return "Invalid value";
}

export function validateWizardStep(
  step: EngagementWizardStep,
  draft: EngagementWizardDraft,
): WizardFieldErrors {
  switch (step) {
    case 1:
      return validateGeneralStep(draft);
    case 2:
      return validateClientStep(draft);
    case 3:
      return validateReportingStep(draft);
    case 4:
      return {};
    case 5:
      return validateDatesStep(draft);
    case 6:
      return validateNotesStep(draft);
    case 7:
      return validateReviewStep(draft);
    default:
      return {};
  }
}

function validateGeneralStep(draft: EngagementWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = {};
  const name = draft.name.trim();

  if (!name) {
    errors.name = "Engagement name is required";
  } else if (!toSlug(name)) {
    errors.name = "Engagement name must contain valid characters";
  }

  return errors;
}

function validateClientStep(draft: EngagementWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateGeneralStep(draft) };

  if (!draft.companyId.trim()) {
    errors.companyId = "Client company is required";
  }

  return errors;
}

function validateReportingStep(draft: EngagementWizardDraft): WizardFieldErrors {
  return validateClientStep(draft);
}

function validateDatesStep(draft: EngagementWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateReportingStep(draft) };

  try {
    validateCreateEngagementInput({
      name: draft.name,
      companyId: draft.companyId,
      engagementCode: draft.engagementCode || null,
      engagementType: draft.engagementType,
      reportingFramework: draft.reportingFramework,
      periodStart: draft.periodStart || null,
      periodEnd: draft.periodEnd || null,
      plannedStart: draft.plannedStart || null,
      plannedEnd: draft.plannedEnd || null,
      description: draft.description || null,
      notes: draft.notes || null,
    });
  } catch (error) {
    const message = messageFromError(error);
    if (draft.periodStart && draft.periodEnd && draft.periodStart > draft.periodEnd) {
      errors.periodStart = message;
      errors.periodEnd = message;
    } else if (draft.plannedStart && draft.plannedEnd && draft.plannedStart > draft.plannedEnd) {
      errors.plannedStart = message;
      errors.plannedEnd = message;
    } else {
      errors.submit = message;
    }
  }

  return errors;
}

function validateNotesStep(draft: EngagementWizardDraft): WizardFieldErrors {
  return validateDatesStep(draft);
}

function validateReviewStep(draft: EngagementWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateNotesStep(draft) };

  try {
    validateCreateEngagementInput(draftToCreateInput(draft));
  } catch (error) {
    errors.submit = messageFromError(error);
  }

  return errors;
}

function draftToCreateInput(draft: EngagementWizardDraft) {
  return {
    name: draft.name,
    companyId: draft.companyId,
    engagementCode: draft.engagementCode || null,
    engagementType: draft.engagementType,
    reportingFramework: draft.reportingFramework,
    periodStart: draft.periodStart || null,
    periodEnd: draft.periodEnd || null,
    plannedStart: draft.plannedStart || null,
    plannedEnd: draft.plannedEnd || null,
    description: draft.description || null,
    notes: draft.notes || null,
  };
}

export function hasWizardFieldErrors(errors: WizardFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
