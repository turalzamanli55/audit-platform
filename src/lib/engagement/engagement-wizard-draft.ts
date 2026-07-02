import type { CreateEngagementActionInput } from "@/lib/actions/engagement/create-engagement";
import { ENGAGEMENT_MEMBER_ROLES, ENGAGEMENT_REPORTING_FRAMEWORKS, ENGAGEMENT_TYPES } from "@/constants/engagement";
import type { EngagementMemberRole, EngagementReportingFramework, EngagementType } from "@/types/engagement";

export const ENGAGEMENT_WIZARD_DRAFT_VERSION = 2;
export const ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY = "audit.engagement-wizard.draft";

export type EngagementWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EngagementWizardTeamMember = {
  userId: string;
  memberRole: EngagementMemberRole;
};

export type EngagementWizardDraft = {
  version: number;
  step: EngagementWizardStep;
  name: string;
  engagementCode: string;
  engagementType: EngagementType;
  companyId: string;
  reportingFramework: EngagementReportingFramework;
  periodStart: string;
  periodEnd: string;
  plannedStart: string;
  plannedEnd: string;
  description: string;
  notes: string;
  teamMembers: EngagementWizardTeamMember[];
};

export const DEFAULT_ENGAGEMENT_WIZARD_DRAFT: EngagementWizardDraft = {
  version: ENGAGEMENT_WIZARD_DRAFT_VERSION,
  step: 1,
  name: "",
  engagementCode: "",
  engagementType: ENGAGEMENT_TYPES[0],
  companyId: "",
  reportingFramework: ENGAGEMENT_REPORTING_FRAMEWORKS[0],
  periodStart: "",
  periodEnd: "",
  plannedStart: "",
  plannedEnd: "",
  description: "",
  notes: "",
  teamMembers: [],
};

export function draftToCreateEngagementInput(
  draft: EngagementWizardDraft,
): CreateEngagementActionInput {
  return {
    name: draft.name,
    companyId: draft.companyId,
    engagementCode: draft.engagementCode.trim() || null,
    engagementType: draft.engagementType,
    reportingFramework: draft.reportingFramework,
    periodStart: draft.periodStart.trim() || null,
    periodEnd: draft.periodEnd.trim() || null,
    plannedStart: draft.plannedStart.trim() || null,
    plannedEnd: draft.plannedEnd.trim() || null,
    description: draft.description.trim() || null,
    notes: draft.notes.trim() || null,
    members: draft.teamMembers,
  };
}

export function isValidTeamMemberRole(value: string): value is EngagementMemberRole {
  return (ENGAGEMENT_MEMBER_ROLES as readonly string[]).includes(value);
}

export function mergeWizardDraft(
  current: EngagementWizardDraft,
  patch: Partial<EngagementWizardDraft>,
): EngagementWizardDraft {
  return {
    ...current,
    ...patch,
    version: ENGAGEMENT_WIZARD_DRAFT_VERSION,
    teamMembers: patch.teamMembers ?? current.teamMembers ?? [],
  };
}
