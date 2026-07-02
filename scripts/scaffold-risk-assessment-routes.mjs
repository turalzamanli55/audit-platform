import fs from "fs";
import path from "path";

const root = path.resolve(".");
const baseRoute = path.join(
  root,
  "src/app/[locale]/(protected)/app/engagements/[slug]/risk-assessment",
);

const mapsExpr = `maps={{
        riskTypes: dictionary.riskAssessment.riskTypes,
        ratings: dictionary.riskAssessment.ratingLevels,
        likelihoods: dictionary.riskAssessment.likelihoods,
        impacts: dictionary.riskAssessment.impacts,
        assertions: dictionary.riskAssessment.assertions,
        responseTypes: dictionary.riskAssessment.responseTypes,
        noteTypes: dictionary.riskAssessment.noteTypes,
      }}`;

const gateBlock = `const user = await getCurrentUser();
  const riskResult = await loadRiskAssessmentWorkspaceCached(slug);
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.CREATE) : false;
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;`;

const gateBlockWithUpdate = `${gateBlock}
  const canUpdate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.UPDATE) : false;`;

const commonProps = `locale={locale}
      canCreate={canCreate}
      planningApproved={planningApproved}
      emptyLabels={dictionary.riskAssessment.empty}
      workspaceLabels={dictionary.riskAssessment.workspace}
      workflowLabels={dictionary.riskAssessment.workflow}
      archivedReadOnlyLabel={dictionary.riskAssessment.workspace.archivedDescription}`;

const pages = [
  {
    slug: null,
    comp: "RiskAssessmentOverviewExperience",
    extraImports: "",
    gate: `const user = await getCurrentUser();
  const riskResult = await loadRiskAssessmentWorkspaceCached(slug);
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.CREATE) : false;
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;`,
    body: `<RiskAssessmentOverviewExperience
      canCreate={canCreate}
      planningApproved={planningApproved}
      workspaceLabels={dictionary.riskAssessment.workspace}
      createLabels={dictionary.riskAssessment.empty}
      statusLabels={dictionary.riskAssessment.statuses}
      labels={{
        title: dictionary.riskAssessment.workspace.title,
        description: dictionary.riskAssessment.workspace.description,
        statusTitle: dictionary.riskAssessment.workspace.statusTitle,
        statusDescription: dictionary.riskAssessment.workspace.statusDescription,
        progress: dictionary.riskAssessment.workspace.progress,
        workflowTitle: dictionary.riskAssessment.workspace.workflowTitle,
        workflowDescription: dictionary.riskAssessment.workspace.workflowDescription,
        heatmapPreviewTitle: dictionary.riskAssessment.workspace.heatmapPreviewTitle,
        heatmapPreviewDescription: dictionary.riskAssessment.workspace.heatmapPreviewDescription,
      }}
      workflowLabels={dictionary.riskAssessment.workflow}
      ratingLabels={dictionary.riskAssessment.ratingLevels}
    />`,
  },
  {
    slug: "inherent-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "inherentRisks",
    riskType: "inherent",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.inherentRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.inherentRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.inherentRisks.addAction,
        categoryLabel: dictionary.riskAssessment.inherentRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.inherentRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.inherentRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.inherentRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.inherentRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "control-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "controlRisks",
    riskType: "control",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.controlRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.controlRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.controlRisks.addAction,
        categoryLabel: dictionary.riskAssessment.controlRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.controlRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.controlRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.controlRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.controlRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "detection-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "detectionRisks",
    riskType: "detection",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.detectionRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.detectionRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.detectionRisks.addAction,
        categoryLabel: dictionary.riskAssessment.detectionRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.detectionRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.detectionRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.detectionRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.detectionRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "fraud-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "fraudRisks",
    riskType: "fraud",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.fraudRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.fraudRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.fraudRisks.addAction,
        categoryLabel: dictionary.riskAssessment.fraudRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.fraudRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.fraudRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.fraudRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.fraudRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "it-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "itRisks",
    riskType: "it",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.itRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.itRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.itRisks.addAction,
        categoryLabel: dictionary.riskAssessment.itRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.itRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.itRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.itRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.itRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "compliance-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "complianceRisks",
    riskType: "compliance",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.complianceRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.complianceRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.complianceRisks.addAction,
        categoryLabel: dictionary.riskAssessment.complianceRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.complianceRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.complianceRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.complianceRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.complianceRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "financial-statement-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "financialStatementRisks",
    riskType: "financial_statement",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.financialStatementRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.financialStatementRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.financialStatementRisks.addAction,
        categoryLabel: dictionary.riskAssessment.financialStatementRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.financialStatementRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.financialStatementRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.financialStatementRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.financialStatementRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "assertion-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "assertionRisks",
    riskType: "assertion",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.assertionRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.assertionRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.assertionRisks.addAction,
        categoryLabel: dictionary.riskAssessment.assertionRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.assertionRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.assertionRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.assertionRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.assertionRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "significant-risks",
    comp: "RiskRegisterExperience",
    labelsKey: "significantRisks",
    riskType: "significant",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        titlePlaceholder: dictionary.riskAssessment.significantRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.significantRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.significantRisks.addAction,
        categoryLabel: dictionary.riskAssessment.significantRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.significantRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.significantRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.significantRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.significantRisks.inherentRatingLabel,
      }`,
  },
  {
    slug: "categories",
    comp: "RiskCategoriesExperience",
    labelsKey: "categories",
    withUpdate: true,
    addLabels: `{
        namePlaceholder: dictionary.riskAssessment.categories.namePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.categories.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.categories.addAction,
      }`,
  },
  {
    slug: "scoring",
    comp: "RiskScoringExperience",
    labelsKey: "scoring",
    readOnly: true,
    extraProps: `summaryLabels={{
        ratedItems: dictionary.riskAssessment.scoring.ratedItems,
        significant: dictionary.riskAssessment.scoring.significant,
        likelihood: dictionary.riskAssessment.scoring.likelihood,
        impact: dictionary.riskAssessment.scoring.impact,
        residual: dictionary.riskAssessment.scoring.residual,
      }}`,
    withMaps: true,
  },
  {
    slug: "heatmap",
    comp: "RiskHeatmapExperience",
    labelsKey: "heatmap",
    readOnly: true,
    extraProps: "unratedLabel={dictionary.riskAssessment.heatmap.unratedLabel}",
    withMaps: true,
  },
  {
    slug: "matrix",
    comp: "RiskMatrixExperience",
    labelsKey: "matrix",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        accountPlaceholder: dictionary.riskAssessment.matrix.accountPlaceholder,
        addAction: dictionary.riskAssessment.matrix.addAction,
      }`,
  },
  {
    slug: "responses",
    comp: "RiskResponsesExperience",
    labelsKey: "responses",
    withUpdate: true,
    withMaps: true,
    addLabels: `{
        riskItemLabel: dictionary.riskAssessment.responses.riskItemLabel,
        descriptionPlaceholder: dictionary.riskAssessment.responses.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.responses.addAction,
      }`,
  },
  {
    slug: "procedures",
    comp: "RiskProceduresExperience",
    labelsKey: "procedures",
    withUpdate: true,
    addLabels: `{
        riskItemLabel: dictionary.riskAssessment.procedures.riskItemLabel,
        referencePlaceholder: dictionary.riskAssessment.procedures.referencePlaceholder,
        addAction: dictionary.riskAssessment.procedures.addAction,
      }`,
  },
  {
    slug: "owners",
    comp: "RiskOwnersExperience",
    labelsKey: "owners",
    withUpdate: true,
    extraProps: `ownerLabels={{
        ownerPlaceholder: dictionary.riskAssessment.owners.ownerPlaceholder,
        updateAction: dictionary.riskAssessment.owners.updateAction,
        unassignedLabel: dictionary.riskAssessment.owners.unassignedLabel,
      }}`,
  },
  {
    slug: "review-notes",
    comp: "RiskReviewNotesExperience",
    labelsKey: "reviewNotes",
    withUpdate: true,
    withMaps: true,
    extraProps: `noteLabels={{
        bodyPlaceholder: dictionary.riskAssessment.reviewNotes.bodyPlaceholder,
        addAction: dictionary.riskAssessment.reviewNotes.addAction,
      }}`,
  },
  {
    slug: "comments",
    comp: "RiskCommentsExperience",
    labelsKey: "comments",
    withUpdate: true,
    withMaps: true,
    extraProps: `noteLabels={{
        bodyPlaceholder: dictionary.riskAssessment.comments.bodyPlaceholder,
        addAction: dictionary.riskAssessment.comments.addAction,
      }}`,
  },
  {
    slug: "history",
    comp: "RiskHistoryExperience",
    labelsKey: "history",
    readOnly: true,
    extraImports: `import { loadRiskAssessmentActivityCached } from "@/lib/risk-assessment/load-risk-assessment-activity";
`,
    gate: `${gateBlock}
  const activityResult = await loadRiskAssessmentActivityCached(slug);
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };`,
    extraProps: `activity={activity}
      historyLabels={{
        versionLabel: dictionary.riskAssessment.history.versionLabel,
        updatedLabel: dictionary.riskAssessment.history.updatedLabel,
        actions: dictionary.riskAssessment.history.actions,
      }}`,
  },
  {
    slug: "settings",
    comp: "RiskSettingsExperience",
    gate: `const user = await getCurrentUser();
  const riskResult = await loadRiskAssessmentWorkspaceCached(slug);
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.CREATE) : false;
  const canArchive = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.ARCHIVE) : false;
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;`,
    body: `<RiskSettingsExperience
      canCreate={canCreate}
      canArchive={canArchive}
      planningApproved={planningApproved}
      labels={dictionary.riskAssessment.settings}
      emptyLabels={dictionary.riskAssessment.empty}
      workspaceLabels={dictionary.riskAssessment.workspace}
      workflowLabels={dictionary.riskAssessment.workflow}
    />`,
  },
];

function buildSectionPage(page) {
  const updateProp = page.withUpdate ? "\n      canUpdate={canUpdate}" : "";
  const mapsProp = page.withMaps ? `\n      ${mapsExpr}` : "";
  const addLabelsProp = page.addLabels ? `\n      addLabels={${page.addLabels}}` : "";
  const riskTypeProp = page.riskType ? `\n      riskType="${page.riskType}"` : "";
  const extraProps = page.extraProps ? `\n      ${page.extraProps}` : "";

  return `<${page.comp}
      ${commonProps}${updateProp}
      labels={dictionary.riskAssessment.${page.labelsKey}}${riskTypeProp}${mapsProp}${addLabelsProp}${extraProps}
    />`;
}

for (const page of pages) {
  const dir = page.slug ? path.join(baseRoute, page.slug) : baseRoute;
  fs.mkdirSync(dir, { recursive: true });

  const workspaceImport = `import { loadRiskAssessmentWorkspaceCached } from "@/lib/risk-assessment/load-risk-assessment-workspace";
`;

  const gate = page.gate ?? (page.readOnly ? gateBlock : gateBlockWithUpdate);
  const body = page.body ?? buildSectionPage(page);

  const content = `import { ${page.comp} } from "@/components/risk-assessment";
import { getDictionary, type Locale } from "@/i18n";
import { generateRiskAssessmentWorkspaceMetadata } from "@/lib/risk-assessment/risk-assessment-workspace-page";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
${workspaceImport}${page.extraImports ?? ""}
type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateRiskAssessmentWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  ${gate}
  return (
    ${body}
  );
}
`;

  fs.writeFileSync(path.join(dir, "page.tsx"), content);
}

console.log(`Regenerated ${pages.length} risk-assessment pages`);
