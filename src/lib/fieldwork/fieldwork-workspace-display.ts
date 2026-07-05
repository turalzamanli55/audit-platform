import type { Dictionary } from "@/i18n/get-dictionary";
import type {
  FieldworkWorkspaceSection,
  FieldworkWorkspaceView,
} from "@/lib/fieldwork/fieldwork-workspace-view";
import type { FieldworkWorkspaceNavGroup, FieldworkWorkspaceNavItem } from "@/components/fieldwork/workspace/fieldwork-workspace-sidebar";
import { FIELDWORK_ACTIVITY_ACTIONS } from "@/constants/fieldwork";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";
import { formatOptionalText } from "@/lib/engagement/format-engagement-workspace";

export type FieldworkWorkspaceLabels = Dictionary["fieldwork"]["workspace"];

export function buildFieldworkWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: FieldworkWorkspaceLabels,
): FieldworkWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/fieldwork`;

  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "program", label: labels.navProgram, href: `${base}/program` },
    { id: "procedure-groups", label: labels.navProcedureGroups, href: `${base}/procedure-groups` },
    { id: "procedures", label: labels.navProcedures, href: `${base}/procedures` },
    { id: "working-papers", label: labels.navWorkingPapers, href: `${base}/working-papers` },
    { id: "evidence", label: labels.navEvidence, href: `${base}/evidence` },
    { id: "findings", label: labels.navFindings, href: `${base}/findings` },
    { id: "notes", label: labels.navNotes, href: `${base}/notes` },
    { id: "review-notes", label: labels.navReviewNotes, href: `${base}/review-notes` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildFieldworkWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: FieldworkWorkspaceLabels,
): FieldworkWorkspaceNavGroup[] {
  const items = buildFieldworkWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: FieldworkWorkspaceSection) => items.find((item) => item.id === id)!;

  const overviewIds = ["overview"] as const;
  const programIds = ["program", "procedure-groups"] as const;
  const executionIds = ["procedures"] as const;
  const documentationIds = ["working-papers", "evidence", "findings", "notes"] as const;
  const governanceIds = ["review-notes", "comments", "history"] as const;
  const adminIds = ["settings"] as const;

  return [
    { id: "overview", label: labels.navGroups.overview, items: overviewIds.map(byId) },
    { id: "program", label: labels.navGroups.program, items: programIds.map(byId) },
    { id: "execution", label: labels.navGroups.execution, items: executionIds.map(byId) },
    { id: "documentation", label: labels.navGroups.documentation, items: documentationIds.map(byId) },
    { id: "governance", label: labels.navGroups.governance, items: governanceIds.map(byId) },
    { id: "admin", label: labels.navGroups.admin, items: adminIds.map(byId) },
  ];
}

export function workspaceSectionTitle(
  section: FieldworkWorkspaceSection,
  labels: FieldworkWorkspaceLabels,
): string {
  return labels.sections[section]?.title ?? section;
}

export function workspaceSectionDescription(
  section: FieldworkWorkspaceSection,
  labels: FieldworkWorkspaceLabels,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildFieldworkOverviewCards(
  fieldwork: FieldworkWorkspaceView,
  labels: FieldworkWorkspaceLabels,
  fieldworkLabels: Dictionary["fieldwork"],
) {
  const completeCount = fieldwork.procedures.filter((p) => isProcedureComplete(p.procedureStatus)).length;

  return [
    {
      id: "status",
      label: labels.summaryStatus,
      value: fieldworkLabels.statuses[fieldwork.packageStatus],
      hint: `${labels.summaryVersion}: ${fieldwork.programVersion}`,
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${fieldwork.progressPct}%`,
    },
    {
      id: "procedures",
      label: labels.summaryProcedures,
      value: `${completeCount}/${fieldwork.procedures.length}`,
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(fieldwork.pendingReviewCount),
    },
    {
      id: "findings",
      label: labels.summaryFindings,
      value: String(fieldwork.findings.filter((f) => f.findingStatus === "open").length),
    },
  ];
}

export function buildFieldworkStatusItems(
  fieldwork: FieldworkWorkspaceView,
  labels: FieldworkWorkspaceLabels,
  fieldworkLabels: Dictionary["fieldwork"],
) {
  return [
    {
      id: "status",
      label: labels.status.packageStatus,
      value: fieldworkLabels.statuses[fieldwork.packageStatus],
    },
    {
      id: "program",
      label: labels.status.programStatus,
      value: fieldwork.program
        ? fieldworkLabels.programStatuses[fieldwork.program.programStatus]
        : formatOptionalText(null),
    },
    {
      id: "progress",
      label: labels.status.progress,
      value: `${fieldwork.progressPct}%`,
    },
    {
      id: "papers",
      label: labels.status.workingPapers,
      value: String(fieldwork.workingPapers.length),
    },
    {
      id: "evidence",
      label: labels.status.evidence,
      value: String(fieldwork.evidence.length),
    },
  ];
}

export function formatFieldworkActivityAction(
  action: string,
  actionLabels: Dictionary["fieldwork"]["history"]["actions"],
): string {
  const map: Record<string, string> = {
    [FIELDWORK_ACTIVITY_ACTIONS.CREATED]: actionLabels.created,
    [FIELDWORK_ACTIVITY_ACTIONS.UPDATED]: actionLabels.updated,
    [FIELDWORK_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels.archived,
    [FIELDWORK_ACTIVITY_ACTIONS.RESTORED]: actionLabels.restored,
    [FIELDWORK_ACTIVITY_ACTIONS.PROGRAM_UPDATED]: actionLabels.programUpdated,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_ASSIGNED]: actionLabels.procedureAssigned,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_UPDATED]: actionLabels.procedureUpdated,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_COMPLETED]: actionLabels.procedureCompleted,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_SUBMITTED]: actionLabels.procedureSubmitted,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_RETURNED]: actionLabels.procedureReturned,
    [FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_CLEARED]: actionLabels.procedureCleared,
    [FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_ADDED]: actionLabels.workingPaperAdded,
    [FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_UPDATED]: actionLabels.workingPaperUpdated,
    [FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_SUBMITTED]: actionLabels.workingPaperSubmitted,
    [FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_RETURNED]: actionLabels.workingPaperReturned,
    [FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_CLEARED]: actionLabels.workingPaperCleared,
    [FIELDWORK_ACTIVITY_ACTIONS.EVIDENCE_ADDED]: actionLabels.evidenceAdded,
    [FIELDWORK_ACTIVITY_ACTIONS.FINDING_ADDED]: actionLabels.findingAdded,
    [FIELDWORK_ACTIVITY_ACTIONS.NOTE_ADDED]: actionLabels.noteAdded,
  };

  return map[action] ?? action;
}

export function formatFieldworkCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function formatFieldworkGroupProcedureSummary(
  template: string,
  groupCount: number,
  procedureCount: number,
): string {
  return template
    .replace("{groupCount}", String(groupCount))
    .replace("{procedureCount}", String(procedureCount));
}

export function formatFieldworkFindingSeverity(
  severity: string | null | undefined,
  labels: Dictionary["fieldwork"]["findingSeverities"],
  fallback: string,
): string {
  const key = severity?.trim();
  if (!key) return fallback;
  return labels[key as keyof typeof labels] ?? key;
}

export function formatFieldworkDocumentType(
  documentType: string | null | undefined,
  labels: Dictionary["fieldwork"]["evidence"]["documentTypes"],
): string {
  const key = documentType?.trim();
  if (!key) return labels.other;
  return labels[key as keyof typeof labels] ?? key;
}

export function formatFieldworkNoteType(
  noteType: string,
  labels: Dictionary["fieldwork"]["noteTypes"],
): string {
  return labels[noteType as keyof typeof labels] ?? noteType;
}
