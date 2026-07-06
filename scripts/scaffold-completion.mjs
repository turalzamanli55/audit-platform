import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const pairs = [
  ["src/constants/review.ts", "src/constants/completion.ts"],
  ["src/types/review.ts", "src/types/completion.ts"],
  ["src/types/review-command-center.ts", "src/types/completion-command-center.ts"],
  ["src/lib/review/review-rules.ts", "src/lib/completion/completion-module-rules.ts"],
  ["src/lib/review/validation.ts", "src/lib/completion/validation.ts"],
  ["src/lib/review/review-workspace-view.ts", "src/lib/completion/completion-workspace-view.ts"],
  ["src/lib/review/review-workspace-mapper.ts", "src/lib/completion/completion-workspace-mapper.ts"],
  ["src/lib/review/review-workspace-display.ts", "src/lib/completion/completion-workspace-display.ts"],
  ["src/lib/review/review-workspace-page.ts", "src/lib/completion/completion-workspace-page.ts"],
  ["src/lib/review/load-review-workspace.ts", "src/lib/completion/load-completion-workspace.ts"],
  ["src/lib/review/load-review-command-center.ts", "src/lib/completion/load-completion-command-center.ts"],
  ["src/lib/review/load-review-dashboard-metrics.ts", "src/lib/completion/load-completion-dashboard-metrics.ts"],
  ["src/lib/review/load-review-activity.ts", "src/lib/completion/load-completion-activity.ts"],
  ["src/lib/review/review-section-page-props.ts", "src/lib/completion/completion-section-page-props.ts"],
  ["src/lib/review/use-review-workspace.ts", "src/lib/completion/use-completion-workspace.ts"],
  ["src/lib/review/review-workspace-provider.tsx", "src/lib/completion/completion-workspace-provider.tsx"],
  ["src/lib/actions/review/review-action.ts", "src/lib/actions/completion/completion-action.ts"],
  ["src/lib/actions/review/create-review.ts", "src/lib/actions/completion/create-completion.ts"],
  ["src/lib/actions/review/update-review.ts", "src/lib/actions/completion/update-completion.ts"],
  ["src/lib/actions/review/archive-review.ts", "src/lib/actions/completion/archive-completion.ts"],
  ["src/lib/actions/review/review-workflow-actions.ts", "src/lib/actions/completion/completion-workflow-actions.ts"],
  ["src/lib/actions/review/review-mutation-actions.ts", "src/lib/actions/completion/completion-mutation-actions.ts"],
  ["src/lib/actions/review/review-item-actions.ts", "src/lib/actions/completion/completion-item-actions.ts"],
  ["src/lib/actions/review/review-comment-actions.ts", "src/lib/actions/completion/completion-comment-actions.ts"],
  ["src/lib/actions/review/review-version-actions.ts", "src/lib/actions/completion/completion-version-actions.ts"],
];

const ROUTE_DIR_MAP = {
  "review-queue": "checklist",
  "open-findings": "outstanding-items",
  "pending-reviews": "outstanding-items",
  "resolved-reviews": "checklist",
  "reviewer-notes": "management-letter",
};

/** Route folders that map to an existing destination — skip after first write. */
const ROUTE_DEDUP_SKIP = new Set(["pending-reviews", "resolved-reviews"]);

const NEW_COMPLETION_ROUTES = [
  "subsequent-events",
  "going-concern",
  "representation-letter",
  "final-analytics",
];

const NEW_ROUTE_DICTIONARY_KEYS = {
  "subsequent-events": "subsequentEvents",
  "going-concern": "goingConcern",
  "representation-letter": "representationLetter",
  "final-analytics": "finalAnalytics",
};

function transformPathSegment(segment) {
  if (ROUTE_DIR_MAP[segment]) return ROUTE_DIR_MAP[segment];
  if (segment.startsWith("review-")) return segment.replace(/^review-/, "completion-");
  if (segment === "review") return "completion";
  return segment;
}

function transformRelativePath(relativePath) {
  return relativePath
    .split(/[/\\]/)
    .map(transformPathSegment)
    .join("/");
}

function transform(content) {
  return (
    content
      .replace(/review_packages/g, "completion_packages")
      .replace(/review_package/g, "completion_package")
      .replace(/review_items/g, "completion_items")
      .replace(/review_item/g, "completion_item")
      .replace(/review_comments/g, "completion_comments")
      .replace(/review_comment/g, "completion_comment")
      .replace(/review_versions/g, "completion_versions")
      .replace(/review_version/g, "completion_version")
      .replace(/review_activity/g, "completion_activity")
      .replace(/ReviewPackage/g, "CompletionPackage")
      .replace(/ReviewItem/g, "CompletionItem")
      .replace(/ReviewComment/g, "CompletionComment")
      .replace(/ReviewVersion/g, "CompletionVersion")
      .replace(/ReviewActivity/g, "CompletionActivity")
      .replace(/ReviewRepository/g, "CompletionRepository")
      .replace(/ReviewCommandCenter/g, "CompletionCommandCenter")
      .replace(/ReviewWorkspace/g, "CompletionWorkspace")
      .replace(/ReviewWorkflow/g, "CompletionWorkflow")
      .replace(/ReviewOverview/g, "CompletionOverview")
      .replace(/ReviewCreate/g, "CompletionCreate")
      .replace(/ReviewSection/g, "CompletionSection")
      .replace(/ReviewQueueExperience/g, "ChecklistExperience")
      .replace(/ReviewQueue/g, "Checklist")
      .replace(/OpenFindingsExperience/g, "OutstandingItemsExperience")
      .replace(/OpenFindings/g, "OutstandingItems")
      .replace(/PendingReviewsExperience/g, "OutstandingItemsPendingExperience")
      .replace(/PendingReviews/g, "OutstandingItemsPending")
      .replace(/ResolvedReviewsExperience/g, "ChecklistResolvedExperience")
      .replace(/ResolvedReviews/g, "ChecklistResolved")
      .replace(/ReviewerNotesExperience/g, "ManagementLetterExperience")
      .replace(/ReviewerNotes/g, "ManagementLetter")
      .replace(/review-workspace/g, "completion-workspace")
      .replace(/review-command-center/g, "completion-command-center")
      .replace(/load-review-/g, "load-completion-")
      .replace(/loadReview/g, "loadCompletion")
      .replace(/review-workflow/g, "completion-workflow")
      .replace(/review-rules/g, "completion-module-rules")
      .replace(/review-workspace-display/g, "completion-workspace-display")
      .replace(/review-workspace-mapper/g, "completion-workspace-mapper")
      .replace(/review-workspace-page/g, "completion-workspace-page")
      .replace(/review-workspace-view/g, "completion-workspace-view")
      .replace(/review-section-page-props/g, "completion-section-page-props")
      .replace(/use-review-workspace/g, "use-completion-workspace")
      .replace(/review-workspace-provider/g, "completion-workspace-provider")
      .replace(/createReviewAction/g, "createCompletionAction")
      .replace(/createReviewPackageAction/g, "createCompletionPackageAction")
      .replace(/updateReviewPackageAction/g, "updateCompletionPackageAction")
      .replace(/archiveReviewAction/g, "archiveCompletionAction")
      .replace(/restoreReviewAction/g, "restoreCompletionAction")
      .replace(/submitReviewAction/g, "submitCompletionAction")
      .replace(/returnReviewAction/g, "returnCompletionAction")
      .replace(/approveReviewAction/g, "approveCompletionAction")
      .replace(/commentReviewAction/g, "commentCompletionAction")
      .replace(/archiveReviewCommentAction/g, "archiveCompletionCommentAction")
      .replace(/restoreReviewCommentAction/g, "restoreCompletionCommentAction")
      .replace(/restoreReviewVersionAction/g, "restoreCompletionVersionAction")
      .replace(/resolveReviewCommentAction/g, "resolveCompletionCommentAction")
      .replace(/unresolveReviewCommentAction/g, "unresolveCompletionCommentAction")
      .replace(/updateReviewCommentAction/g, "updateCompletionCommentAction")
      .replace(/buildReviewSectionPageProps/g, "buildCompletionSectionPageProps")
      .replace(/generateReviewWorkspaceMetadata/g, "generateCompletionWorkspaceMetadata")
      .replace(/formatReviewActivityAction/g, "formatCompletionActivityAction")
      .replace(/formatReviewActivitySummary/g, "formatCompletionActivitySummary")
      .replace(/buildReviewOverviewCards/g, "buildCompletionOverviewCards")
      .replace(/buildReviewWorkspaceNavItems/g, "buildCompletionWorkspaceNavItems")
      .replace(/buildReviewWorkspaceNavGroups/g, "buildCompletionWorkspaceNavGroups")
      .replace(/reviewSectionTitle/g, "completionSectionTitle")
      .replace(/reviewSectionDescription/g, "completionSectionDescription")
      .replace(/REVIEW_PERMISSIONS/g, "COMPLETION_PERMISSIONS")
      .replace(/REVIEW_ACTIVITY_ACTIONS/g, "COMPLETION_ACTIVITY_ACTIONS")
      .replace(/REVIEW_PACKAGE_STATUSES/g, "COMPLETION_PACKAGE_STATUSES")
      .replace(/REVIEW_ITEM_STATUSES/g, "COMPLETION_ITEM_STATUSES")
      .replace(/REVIEW_COMMENT_TYPES/g, "COMPLETION_COMMENT_TYPES")
      .replace(/LOCKED_REVIEW_STATUSES/g, "LOCKED_COMPLETION_STATUSES")
      .replace(/AUDIT_RESOURCE_TYPE = "review"/g, 'AUDIT_RESOURCE_TYPE = "completion"')
      .replace(/REVIEW_SOURCE_MODULES/g, "COMPLETION_ITEM_TYPES")
      .replace(/dictionary\.review/g, "dictionary.completion")
      .replace(/ReviewLabels/g, "CompletionLabels")
      .replace(/\/review\//g, "/completion/")
      .replace(/navReviewQueue/g, "navChecklist")
      .replace(/open_findings/g, "outstanding_items")
      .replace(/pending_reviews/g, "outstanding_items")
      .replace(/resolved_reviews/g, "checklist")
      .replace(/reviewer_notes/g, "management_letter")
      .replace(/review-queue/g, "checklist")
      .replace(/open-findings/g, "outstanding-items")
      .replace(/pending-reviews/g, "outstanding-items")
      .replace(/resolved-reviews/g, "checklist")
      .replace(/reviewer-notes/g, "management-letter")
      .replace(/fieldwork_package_id/g, "review_package_id")
      .replace(/fieldworkPackageId/g, "reviewPackageId")
      .replace(/FieldworkRepository/g, "ReviewRepository")
      .replace(/assertReviewCreateGate/g, "assertCompletionCreateGate")
      .replace(/assertReviewApprovedForCompletion/g, "assertCompletionApprovedForReporting")
      .replace(/isReviewApproved/g, "isCompletionApproved")
      .replace(/computeReviewProgress/g, "computeCompletionProgress")
      .replace(/SyncReviewItemCandidate/g, "SeedCompletionItemCandidate")
      .replace(/open_findings_count/g, "outstanding_count")
      .replace(/openFindingsCount/g, "outstandingCount")
      .replace(/ReviewCommandCenterLabels/g, "CompletionCommandCenterLabels")
      .replace(/ReviewSectionLabels/g, "CompletionSectionLabels")
      .replace(/from "@\/constants\/review"/g, 'from "@/constants/completion"')
      .replace(/from "@\/types\/review"/g, 'from "@/types/completion"')
      .replace(/from "@\/types\/review-command-center"/g, 'from "@/types/completion-command-center"')
      .replace(/from "@\/repositories\/review\/review-repository"/g, 'from "@/repositories/completion/completion-repository"')
      .replace(/from "@\/lib\/review\//g, 'from "@/lib/completion/')
      .replace(/from "@\/lib\/actions\/review/g, 'from "@/lib/actions/completion')
      .replace(/from "@\/components\/review/g, 'from "@/components/completion')
      .replace(/ReviewHistoryExperience/g, "CompletionHistoryExperience")
      .replace(/ReviewSettingsExperience/g, "CompletionSettingsExperience")
      .replace(/\/review-create-experience/g, "/completion-create-experience")
      .replace(/\/review-overview-experience/g, "/completion-overview-experience")
      .replace(/\/review-item-row/g, "/completion-item-row")
      .replace(/\/review-section-experiences/g, "/completion-section-experiences")
      .replace(/headingId="review-/g, 'headingId="completion-')
      .replace(/hasReview/g, "hasCompletion")
  );
}

function copyFilePair(src, dest) {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  let content = fs.readFileSync(src, "utf8");
  content = transform(content);
  fs.writeFileSync(dest, content);
  console.log("created", dest);
}

function walkDir(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function copyDirectory(srcDir, destRoot, { routeMode = false } = {}) {
  if (!fs.existsSync(srcDir)) {
    console.log("skip missing dir", srcDir);
    return;
  }

  const writtenRouteDests = new Set();

  walkDir(srcDir, (srcFile) => {
    const relative = path.relative(srcDir, srcFile);
    const segments = relative.split(/[/\\]/);

    if (routeMode && segments.length > 1 && ROUTE_DEDUP_SKIP.has(segments[0])) {
      console.log("skip duplicate route", relative);
      return;
    }

    const transformedRelative = transformRelativePath(relative);
    const destFile = path.join(destRoot, transformedRelative);

    if (routeMode && segments.length > 1) {
      const routeKey = segments.slice(0, -1).join("/");
      const mappedRoute = segments
        .slice(0, -1)
        .map((s) => ROUTE_DIR_MAP[s] ?? s)
        .join("/");
      if (writtenRouteDests.has(mappedRoute)) {
        console.log("skip duplicate route dest", relative, "->", mappedRoute);
        return;
      }
      writtenRouteDests.add(mappedRoute);
    }

    copyFilePair(srcFile, destFile);
  });
}

function createNewRoutePages(completionRouteDir, checklistPagePath) {
  if (!fs.existsSync(checklistPagePath)) {
    console.log("skip new routes — no checklist template at", checklistPagePath);
    return;
  }

  const template = fs.readFileSync(checklistPagePath, "utf8");

  for (const route of NEW_COMPLETION_ROUTES) {
    const dictKey = NEW_ROUTE_DICTIONARY_KEYS[route];
    let page = template.replace(
      /labels=\{dictionary\.completion\.\w+\}/,
      `labels={dictionary.completion.${dictKey}}`,
    );

    const dest = path.join(completionRouteDir, route, "page.tsx");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, page);
    console.log("created", dest);
  }
}

for (const [src, dest] of pairs) {
  if (!fs.existsSync(src)) {
    console.log("skip missing", src);
    continue;
  }
  copyFilePair(src, dest);
}

copyDirectory(
  path.join(ROOT, "src/components/review"),
  path.join(ROOT, "src/components/completion"),
);

const reviewRouteDir = path.join(
  ROOT,
  "src/app/[locale]/(protected)/app/engagements/[slug]/review",
);
const completionRouteDir = path.join(
  ROOT,
  "src/app/[locale]/(protected)/app/engagements/[slug]/completion",
);

copyDirectory(reviewRouteDir, completionRouteDir, { routeMode: true });

createNewRoutePages(
  completionRouteDir,
  path.join(completionRouteDir, "checklist", "page.tsx"),
);

console.log("scaffold complete");
