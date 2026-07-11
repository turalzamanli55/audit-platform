import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const SECTION_MAP = {
  checklist: "executive-summary",
  "outstanding-items": "financial-statements",
  "management-letter": "ifrs-notes",
  "subsequent-events": "management-letter",
  "going-concern": "audit-findings",
  "representation-letter": "recommendations",
  "final-analytics": "appendices",
};

const pairs = [
  ["src/constants/completion.ts", "src/constants/reporting.ts"],
  ["src/types/completion.ts", "src/types/reporting.ts"],
  ["src/types/completion-command-center.ts", "src/types/reporting-command-center.ts"],
  ["src/lib/completion/completion-module-rules.ts", "src/lib/reporting/reporting-module-rules.ts"],
  ["src/lib/completion/validation.ts", "src/lib/reporting/validation.ts"],
  ["src/lib/completion/completion-workspace-view.ts", "src/lib/reporting/reporting-workspace-view.ts"],
  ["src/lib/completion/completion-workspace-mapper.ts", "src/lib/reporting/reporting-workspace-mapper.ts"],
  ["src/lib/completion/completion-workspace-display.ts", "src/lib/reporting/reporting-workspace-display.ts"],
  ["src/lib/completion/completion-workspace-page.ts", "src/lib/reporting/reporting-workspace-page.ts"],
  ["src/lib/completion/load-completion-workspace.ts", "src/lib/reporting/load-reporting-workspace.ts"],
  ["src/lib/completion/load-completion-command-center.ts", "src/lib/reporting/load-reporting-command-center.ts"],
  ["src/lib/completion/load-completion-dashboard-metrics.ts", "src/lib/reporting/load-reporting-dashboard-metrics.ts"],
  ["src/lib/completion/load-completion-activity.ts", "src/lib/reporting/load-reporting-activity.ts"],
  ["src/lib/completion/completion-section-page-props.ts", "src/lib/reporting/reporting-section-page-props.ts"],
  ["src/lib/completion/use-completion-workspace.ts", "src/lib/reporting/use-reporting-workspace.ts"],
  ["src/lib/completion/completion-workspace-provider.tsx", "src/lib/reporting/reporting-workspace-provider.tsx"],
  ["src/lib/actions/completion/completion-action.ts", "src/lib/actions/reporting/reporting-action.ts"],
  ["src/lib/actions/completion/create-completion.ts", "src/lib/actions/reporting/create-reporting.ts"],
  ["src/lib/actions/completion/update-completion.ts", "src/lib/actions/reporting/update-reporting.ts"],
  ["src/lib/actions/completion/archive-completion.ts", "src/lib/actions/reporting/archive-reporting.ts"],
  ["src/lib/actions/completion/completion-workflow-actions.ts", "src/lib/actions/reporting/reporting-workflow-actions.ts"],
  ["src/lib/actions/completion/completion-mutation-actions.ts", "src/lib/actions/reporting/reporting-mutation-actions.ts"],
  ["src/lib/actions/completion/completion-item-actions.ts", "src/lib/actions/reporting/reporting-section-actions.ts"],
  ["src/lib/actions/completion/completion-comment-actions.ts", "src/lib/actions/reporting/reporting-comment-actions.ts"],
  ["src/lib/actions/completion/completion-version-actions.ts", "src/lib/actions/reporting/reporting-version-actions.ts"],
  ["src/lib/actions/completion/index.ts", "src/lib/actions/reporting/index.ts"],
  ["src/repositories/completion/completion-repository.ts", "src/repositories/reporting/reporting-repository.ts"],
];

function transform(content) {
  let out = content;
  // Table/column renames first (order matters)
  out = out
    .replace(/completion_packages/g, "reporting_packages")
    .replace(/completion_package/g, "reporting_package")
    .replace(/completion_items/g, "report_sections")
    .replace(/completion_item/g, "report_section")
    .replace(/completion_comments/g, "report_comments")
    .replace(/completion_comment/g, "report_comment")
    .replace(/completion_versions/g, "report_versions")
    .replace(/completion_version/g, "report_version")
    .replace(/completion_activity/g, "report_activity")
    .replace(/CompletionPackage/g, "ReportingPackage")
    .replace(/CompletionItem/g, "ReportSection")
    .replace(/CompletionComment/g, "ReportComment")
    .replace(/CompletionVersion/g, "ReportVersion")
    .replace(/CompletionActivity/g, "ReportActivity")
    .replace(/CompletionRepository/g, "ReportingRepository")
    .replace(/CompletionCommandCenter/g, "ReportingCommandCenter")
    .replace(/CompletionWorkspace/g, "ReportingWorkspace")
    .replace(/CompletionWorkflow/g, "ReportingWorkflow")
    .replace(/CompletionOverview/g, "ReportingOverview")
    .replace(/CompletionCreate/g, "ReportingCreate")
    .replace(/CompletionSection/g, "ReportingSection")
    .replace(/CompletionLabels/g, "ReportingLabels")
    .replace(/completion-workspace/g, "reporting-workspace")
    .replace(/completion-command-center/g, "reporting-command-center")
    .replace(/load-completion-/g, "load-reporting-")
    .replace(/loadCompletion/g, "loadReporting")
    .replace(/completion-workflow/g, "reporting-workflow")
    .replace(/completion-module-rules/g, "reporting-module-rules")
    .replace(/completion-workspace-display/g, "reporting-workspace-display")
    .replace(/completion-workspace-mapper/g, "reporting-workspace-mapper")
    .replace(/completion-workspace-page/g, "reporting-workspace-page")
    .replace(/completion-workspace-view/g, "reporting-workspace-view")
    .replace(/completion-section-page-props/g, "reporting-section-page-props")
    .replace(/use-completion-workspace/g, "use-reporting-workspace")
    .replace(/completion-workspace-provider/g, "reporting-workspace-provider")
    .replace(/createCompletionPackageAction/g, "createReportingPackageAction")
    .replace(/updateCompletionPackageAction/g, "updateReportingPackageAction")
    .replace(/archiveCompletionAction/g, "archiveReportingAction")
    .replace(/restoreCompletionAction/g, "restoreReportingAction")
    .replace(/submitCompletionAction/g, "submitReportingAction")
    .replace(/returnCompletionAction/g, "returnReportingAction")
    .replace(/approveCompletionAction/g, "approveReportingAction")
    .replace(/commentCompletionAction/g, "commentReportingAction")
    .replace(/createCompletionAction/g, "createReportingAction")
    .replace(/updateCompletionItemAction/g, "updateReportSectionAction")
    .replace(/reopenCompletionItemAction/g, "reopenReportSectionAction")
    .replace(/approveCompletionItemAction/g, "approveReportSectionAction")
    .replace(/resolveCompletionItemAction/g, "resolveReportSectionAction")
    .replace(/returnCompletionItemAction/g, "returnReportSectionAction")
    .replace(/updateCompletionCommentAction/g, "updateReportCommentAction")
    .replace(/archiveCompletionCommentAction/g, "archiveReportCommentAction")
    .replace(/restoreCompletionCommentAction/g, "restoreReportCommentAction")
    .replace(/resolveCompletionCommentAction/g, "resolveReportCommentAction")
    .replace(/unresolveCompletionCommentAction/g, "unresolveReportCommentAction")
    .replace(/restoreCompletionVersionAction/g, "restoreReportVersionAction")
    .replace(/COMPLETION_PERMISSIONS/g, "REPORTING_PERMISSIONS")
    .replace(/COMPLETION_ACTIVITY_ACTIONS/g, "REPORTING_ACTIVITY_ACTIONS")
    .replace(/COMPLETION_PACKAGE_STATUSES/g, "REPORTING_PACKAGE_STATUSES")
    .replace(/COMPLETION_ITEM_STATUSES/g, "REPORT_SECTION_STATUSES")
    .replace(/COMPLETION_ITEM_TYPES/g, "REPORT_SECTION_TYPES")
    .replace(/COMPLETION_COMMENT_TYPES/g, "REPORT_COMMENT_TYPES")
    .replace(/LOCKED_COMPLETION_STATUSES/g, "LOCKED_REPORTING_STATUSES")
    .replace(/COMPLETION_ITEM_PRIORITIES/g, "REPORT_SECTION_PRIORITIES")
    .replace(/COMPLETION_ITEM_SEVERITIES/g, "REPORT_SECTION_SEVERITIES")
    .replace(/AUDIT_RESOURCE_TYPE = "completion"/g, 'AUDIT_RESOURCE_TYPE = "reporting"')
    .replace(/dictionary\.completion/g, "dictionary.reporting")
    .replace(/\/completion\//g, "/reporting/")
    .replace(/\/completion"/g, '/reporting"')
    .replace(/from "@\/constants\/completion"/g, 'from "@/constants/reporting"')
    .replace(/from "@\/types\/completion"/g, 'from "@/types/reporting"')
    .replace(/from "@\/types\/completion-command-center"/g, 'from "@/types/reporting-command-center"')
    .replace(
      /from "@\/repositories\/completion\/completion-repository"/g,
      'from "@/repositories/reporting/reporting-repository"',
    )
    .replace(/from "@\/lib\/completion\//g, 'from "@/lib/reporting/')
    .replace(/from "@\/lib\/actions\/completion/g, 'from "@/lib/actions/reporting')
    .replace(/from "@\/components\/completion/g, 'from "@/components/reporting')
    .replace(/@\/components\/completion/g, "@/components/reporting")
    .replace(/assertEngagementCompletionGate/g, "assertCompletionApprovedForReporting")
    .replace(/assertCompletionApprovedForReporting/g, "assertReportingApprovedForOpinion")
    .replace(/isCompletionApproved/g, "isReportingApproved")
    .replace(/computeCompletionProgress/g, "computeReportingProgress")
    .replace(/SeedCompletionItemCandidate/g, "SeedReportSectionCandidate")
    .replace(/itemType/g, "sectionType")
    .replace(/item_type/g, "section_type")
    .replace(/itemStatus/g, "sectionStatus")
    .replace(/item_status/g, "section_status")
    .replace(/CompletionItemView/g, "ReportSectionView")
    .replace(/ReviewHistoryExperience/g, "ReportingHistoryExperience")
    .replace(/ReviewSettingsExperience/g, "ReportingSettingsExperience")
    .replace(/CompletionHistoryExperience/g, "ReportingHistoryExperience")
    .replace(/CompletionSettingsExperience/g, "ReportingSettingsExperience")
    .replace(/CompletionItemRow/g, "ReportSectionRow")
    .replace(/outstandingCount/g, "pendingSectionsCount")
    .replace(/outstanding_count/g, "pending_sections_count")
    .replace(/pendingCount/g, "pendingCount")
    .replace(/reviewPackageId/g, "completionPackageId")
    .replace(/review_package_id/g, "completion_package_id")
    .replace(/ReviewRepository/g, "CompletionRepository")
    .replace(
      /@\/repositories\/review\/review-repository/g,
      "@/repositories/completion/completion-repository",
    )
    .replace(/AUDIT_ACTIONS\.COMPLETION/g, "AUDIT_ACTIONS.REPORTING")
    .replace(/"completion\./g, '"reporting.')
    .replace(/completion\.created/g, "reporting.created")
    .replace(/completion\.updated/g, "reporting.updated")
    .replace(/completion\.archived/g, "reporting.archived")
    .replace(/completion\.restored/g, "reporting.restored")
    .replace(/completion\.submitted/g, "reporting.submitted")
    .replace(/completion\.returned/g, "reporting.returned")
    .replace(/completion\.approved/g, "reporting.approved")
    .replace(/completion\.item\./g, "reporting.section.")
    .replace(/completion\.comment\./g, "reporting.comment.")
    .replace(/completion\.version\./g, "reporting.version.")
    .replace(/module: "completion\./g, 'module: "reporting.')
    .replace(/READ: "completion\.read"/g, 'READ: "reporting.read"')
    .replace(/CREATE: "completion\.create"/g, 'CREATE: "reporting.create"')
    .replace(/UPDATE: "completion\.update"/g, 'UPDATE: "reporting.update"')
    .replace(/ARCHIVE: "completion\.archive"/g, 'ARCHIVE: "reporting.archive"')
    .replace(/REVIEW: "completion\.review"/g, 'REVIEW: "reporting.review"')
    .replace(/APPROVE: "completion\.approve"/g, 'APPROVE: "reporting.approve"')
    .replace(/COMMENT: "completion\.comment"/g, 'COMMENT: "reporting.comment"');

  return out;
}

function transformPathName(name) {
  return name
    .replace(/completion/g, "reporting")
    .replace(/Completion/g, "Reporting");
}

for (const [src, dest] of pairs) {
  const srcPath = path.join(ROOT, src);
  if (!fs.existsSync(srcPath)) {
    console.log("skip missing", src);
    continue;
  }
  const destPath = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, transform(fs.readFileSync(srcPath, "utf8")));
  console.log("created", dest);
}

// Components
const compSrc = path.join(ROOT, "src/components/completion");
const compDest = path.join(ROOT, "src/components/reporting");

function walkCopy(srcDir, destDir, fileTransform) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const from = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      walkCopy(from, path.join(destDir, transformPathName(entry.name)), fileTransform);
      continue;
    }
    const toName = transformPathName(entry.name);
    const to = path.join(destDir, toName);
    let content = fs.readFileSync(from, "utf8");
    content = fileTransform(content);
    fs.writeFileSync(to, content);
    console.log("created", path.relative(ROOT, to));
  }
}

walkCopy(compSrc, compDest, transform);

// Routes
const routeSrc = path.join(
  ROOT,
  "src/app/[locale]/(protected)/app/engagements/[slug]/completion",
);
const routeDest = path.join(
  ROOT,
  "src/app/[locale]/(protected)/app/engagements/[slug]/reporting",
);

function copyRoutes(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const from = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      const mapped = SECTION_MAP[entry.name] ?? transformPathName(entry.name);
      if (["checklist", "outstanding-items", "management-letter", "subsequent-events", "going-concern", "representation-letter", "final-analytics"].includes(entry.name) && !SECTION_MAP[entry.name]) {
        console.log("skip unmapped", entry.name);
        continue;
      }
      // Avoid writing duplicate dirs when multiple map to same
      copyRoutes(from, path.join(destDir, mapped));
      continue;
    }
    const to = path.join(destDir, entry.name);
    let content = transform(fs.readFileSync(from, "utf8"));
    // Fix section dictionary keys in pages
    content = content
      .replace(/dictionary\.reporting\.checklist/g, "dictionary.reporting.executiveSummary")
      .replace(/dictionary\.reporting\.outstandingItems/g, "dictionary.reporting.financialStatements")
      .replace(/dictionary\.reporting\.managementLetter/g, "dictionary.reporting.ifrsNotes")
      .replace(/dictionary\.reporting\.subsequentEvents/g, "dictionary.reporting.managementLetter")
      .replace(/dictionary\.reporting\.goingConcern/g, "dictionary.reporting.auditFindings")
      .replace(/dictionary\.reporting\.representationLetter/g, "dictionary.reporting.recommendations")
      .replace(/dictionary\.reporting\.finalAnalytics/g, "dictionary.reporting.appendices")
      .replace(/ChecklistExperience/g, "ExecutiveSummaryExperience")
      .replace(/OutstandingItemsExperience/g, "FinancialStatementsExperience")
      .replace(/ManagementLetterExperience/g, "IfrsNotesExperience")
      .replace(/SubsequentEventsExperience/g, "ManagementLetterExperience")
      .replace(/GoingConcernExperience/g, "AuditFindingsExperience")
      .replace(/RepresentationLetterExperience/g, "RecommendationsExperience")
      .replace(/FinalAnalyticsExperience/g, "AppendicesExperience");
    fs.writeFileSync(to, content);
    console.log("created", path.relative(ROOT, to));
  }
}

copyRoutes(routeSrc, routeDest);
console.log("scaffold complete");
