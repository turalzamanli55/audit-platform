"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addCategoryAction,
  addNoteAction,
  addProcedureLinkAction,
  addResponseAction,
  addRiskItemAction,
  archiveRiskAssessmentAction,
  restoreRiskAssessmentAction,
  updateRiskItemAction,
  upsertAssertionRatingAction,
} from "@/lib/actions/risk-assessment";
import { Button, Input } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceFormPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceTable,
} from "@/components/workspace";
import { RiskAssessmentCreateExperience } from "@/components/risk-assessment/create/risk-assessment-create-experience";
import { RiskAssessmentWorkspaceSectionShell } from "@/components/risk-assessment/workspace/risk-assessment-workspace-section-shell";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import type { RiskAssessmentActivityView } from "@/lib/risk-assessment/load-risk-assessment-activity";
import {
  buildRiskHeatmapData,
  formatRiskAssessmentActivityAction,
  formatRiskAssessmentActivitySummary,
} from "@/lib/risk-assessment/risk-assessment-workspace-display";
import {
  buildAuditAreaOptions,
  buildAssertionMatrixGrid,
  HeatmapCellDetail,
  matrixCellClass,
  RiskSignificantBadge,
  useProcedureOptions,
  type MatrixGridCell,
} from "@/components/risk-assessment/sections/risk-assessment-interactive-ui";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type {
  AssertionType,
  RiskImpact,
  RiskLikelihood,
  RiskRatingLevel,
  RiskType,
} from "@/types/risk-assessment";

type CreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type SectionLabels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

type AddLabelFields = {
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  addAction?: string;
  categoryLabel?: string;
  riskTypeLabel?: string;
  likelihoodLabel?: string;
  impactLabel?: string;
  inherentRatingLabel?: string;
  namePlaceholder?: string;
  accountPlaceholder?: string;
  riskItemLabel?: string;
  referencePlaceholder?: string;
  auditAreaLabel?: string;
  auditAreaPlaceholder?: string;
  significantBadge?: string;
  procedureLinkedBadge?: string;
  procedureUnlinkedBadge?: string;
};

type OwnerLabelFields = {
  ownerPlaceholder?: string;
  updateAction?: string;
  unassignedLabel?: string;
};

type NoteLabelFields = {
  bodyPlaceholder?: string;
  addAction?: string;
};

type SummaryLabelFields = {
  ratedItems?: string;
  significant?: string;
  likelihood?: string;
  impact?: string;
  residual?: string;
};

type LabelMaps = {
  riskTypes: Record<string, string>;
  ratings: Record<string, string>;
  likelihoods: Record<string, string>;
  impacts: Record<string, string>;
  assertions: Record<string, string>;
  responseTypes: Record<string, string>;
  noteTypes: Record<string, string>;
};

type GateProps = {
  canCreate?: boolean;
  planningApproved?: boolean;
  emptyLabels: CreateLabels;
  workspaceLabels: { planningGateDescription: string; materialityGateDescription: string };
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  workflowLabels: { errorGeneric: string };
  archivedReadOnlyLabel?: string;
  locale?: string;
};

function useWorkspaceOrCreate(props: GateProps) {
  const { riskAssessment, planningApproved, materialityApproved } = useRiskAssessmentWorkspace();
  if (!riskAssessment) {
    return (
      <RiskAssessmentCreateExperience
        canCreate={props.canCreate ?? false}
        planningApproved={props.planningApproved ?? planningApproved}
        materialityApproved={materialityApproved}
        labels={props.emptyLabels}
        gateLabels={props.workspaceLabels}
      />
    );
  }
  return riskAssessment;
}

function canMutate(riskAssessment: RiskAssessmentWorkspaceView, allowed: boolean) {
  return (
    allowed &&
    !riskAssessment.isArchived &&
    riskAssessment.assessmentStatus !== "approved" &&
    riskAssessment.assessmentStatus !== "archived"
  );
}

function ArchivedNotice({ message }: { message: string }) {
  return <WorkspaceNoticeBanner variant="warning" description={message} role="status" />;
}

function useMutationError() {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);
  return { error, setError, clearError };
}

export function RiskRegisterExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    riskType?: RiskType | "financial-statement";
    significantOnly?: boolean;
    defaultSignificant?: boolean;
    maps: LabelMaps;
    addLabels: AddLabelFields;
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const normalizedType = props.significantOnly
    ? undefined
    : (props.riskType?.replace("-", "_") as RiskType | undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [auditArea, setAuditArea] = useState("");
  const [riskType, setRiskType] = useState<RiskType>(normalizedType ?? "inherent");
  const [likelihood, setLikelihood] = useState<RiskLikelihood | "">("");
  const [impact, setImpact] = useState<RiskImpact | "">("");
  const [inherentRating, setInherentRating] = useState<RiskRatingLevel | "">("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("registerItems" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const auditAreas = buildAuditAreaOptions(workspace);
  const linkedRiskIds = new Set(workspace.procedureLinks.map((link) => link.riskItemId));
  const items = props.significantOnly
    ? workspace.registerItems.filter((item) => item.isSignificant)
    : normalizedType
      ? workspace.registerItems.filter((item) => item.riskType === normalizedType)
      : workspace.registerItems;

  const addRisk = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      clearError();
      const autoSignificant =
        props.defaultSignificant ||
        props.significantOnly ||
        riskType === "fraud" ||
        inherentRating === "significant" ||
        (likelihood === "high" && impact === "high");
      const result = await addRiskItemAction({
        assessmentId: workspace.id,
        version: workspace.version,
        categoryId: categoryId || null,
        riskType: normalizedType ?? riskType,
        title: title.trim(),
        description: description.trim() || null,
        auditArea: auditArea.trim() || null,
        accountName: auditArea.trim() || null,
        likelihood: likelihood || null,
        impact: impact || null,
        inherentRating: inherentRating || null,
        isSignificant: autoSignificant,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setTitle("");
      setDescription("");
      setCategoryId("");
      setAuditArea("");
      setLikelihood("");
      setImpact("");
      setInherentRating("");
      router.refresh();
    });
  };

  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {items.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {items.map((item) => (
            <WorkspaceListItem key={item.id} className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{item.title}</p>
                {item.isSignificant && props.addLabels.significantBadge ? (
                  <RiskSignificantBadge label={props.addLabels.significantBadge} />
                ) : null}
                {item.isSignificant ? (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {linkedRiskIds.has(item.id)
                      ? props.addLabels.procedureLinkedBadge
                      : props.addLabels.procedureUnlinkedBadge}
                  </span>
                ) : null}
              </div>
              {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {item.auditArea ? <span>{props.addLabels.auditAreaLabel}: {item.auditArea}</span> : null}
                {item.likelihood ? (
                  <span>
                    {props.addLabels.likelihoodLabel}: {props.maps.likelihoods[item.likelihood] ?? item.likelihood}
                  </span>
                ) : null}
                {item.inherentRating ? (
                  <span>
                    {props.addLabels.inherentRatingLabel}:{" "}
                    {props.maps.ratings[item.inherentRating] ?? item.inherentRating}
                  </span>
                ) : null}
              </div>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {mutable ? (
        <WorkspaceFormPanel className="mt-6">
          {!normalizedType && !props.significantOnly ? (
            <select
              className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
              value={riskType}
              onChange={(event) => setRiskType(event.target.value as RiskType)}
            >
              {Object.entries(props.maps.riskTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {`${props.addLabels.riskTypeLabel}: ${label}`}
                </option>
              ))}
            </select>
          ) : null}
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">{props.addLabels.categoryLabel}</option>
            {workspace.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={auditArea}
            onChange={(event) => setAuditArea(event.target.value)}
          >
            <option value="">{props.addLabels.auditAreaPlaceholder ?? props.addLabels.auditAreaLabel}</option>
            {auditAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
              value={likelihood}
              onChange={(event) => setLikelihood(event.target.value as RiskLikelihood | "")}
            >
              <option value="">{props.addLabels.likelihoodLabel}</option>
              {Object.entries(props.maps.likelihoods).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
              value={impact}
              onChange={(event) => setImpact(event.target.value as RiskImpact | "")}
            >
              <option value="">{props.addLabels.impactLabel}</option>
              {Object.entries(props.maps.impacts).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
              value={inherentRating}
              onChange={(event) => setInherentRating(event.target.value as RiskRatingLevel | "")}
            >
              <option value="">{props.addLabels.inherentRatingLabel}</option>
              {Object.entries(props.maps.ratings).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={props.addLabels.titlePlaceholder} />
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder={props.addLabels.descriptionPlaceholder} />
          <Button type="button" onClick={addRisk} disabled={isPending || !title.trim()}>
            {props.addLabels.addAction}
          </Button>
        </WorkspaceFormPanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskCategoriesExperience(props: BaseProps & { canUpdate?: boolean; addLabels: AddLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("categories" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const addCategory = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addCategoryAction({
        assessmentId: workspace.id,
        version: workspace.version,
        name: name.trim(),
        description: description.trim() || null,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setName("");
      setDescription("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {workspace.categories.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.categories.map((category) => (
            <WorkspaceListItem key={category.id}>
              <p className="font-medium text-foreground">{category.name}</p>
              <p className="text-sm text-muted-foreground">{category.description ?? "—"}</p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {mutable ? (
        <WorkspaceFormPanel className="mt-6">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={props.addLabels.namePlaceholder} />
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder={props.addLabels.descriptionPlaceholder} />
          <Button type="button" onClick={addCategory} disabled={isPending || !name.trim()}>
            {props.addLabels.addAction}
          </Button>
        </WorkspaceFormPanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskScoringExperience(props: BaseProps & { maps: LabelMaps; summaryLabels: SummaryLabelFields }) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("registerItems" in workspace)) return workspace;
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {workspace.registerItems.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <WorkspaceMetricCard
            label={props.summaryLabels.ratedItems ?? ""}
            value={String(workspace.registerItems.filter((item) => item.inherentRating || item.residualRating).length)}
          />
          <WorkspaceMetricCard
            label={props.summaryLabels.significant ?? ""}
            value={String(workspace.significantRiskCount)}
          />
          <WorkspaceMetricCard
            label={props.summaryLabels.likelihood ?? ""}
            value={String(workspace.registerItems.filter((item) => item.likelihood === "high").length)}
          />
          <WorkspaceMetricCard
            label={props.summaryLabels.impact ?? ""}
            value={String(workspace.registerItems.filter((item) => item.impact === "high").length)}
          />
          <WorkspaceMetricCard
            label={props.summaryLabels.residual ?? ""}
            value={String(workspace.registerItems.filter((item) => item.residualRating === "significant").length)}
          />
        </div>
      )}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskHeatmapExperience(
  props: BaseProps & {
    maps: LabelMaps;
    unratedLabel?: string;
    heatmapLabels?: {
      accountLabel: string;
      assertionLabel: string;
      ratingLabel: string;
      significantLabel: string;
      emptyDetail: string;
      filterSignificant: string;
      summaryLabel: string;
    };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  const [selectedCell, setSelectedCell] = useState<MatrixGridCell | null>(null);
  const [significantOnly, setSignificantOnly] = useState(false);
  if (typeof workspace !== "object" || !("heatmap" in workspace)) return workspace;
  const grid = buildAssertionMatrixGrid(workspace);
  const visibleCells = significantOnly ? grid.cells.filter((cell) => cell.isSignificant || cell.rating) : grid.cells;
  if (grid.cells.every((cell) => !cell.rating)) {
    const buckets = buildRiskHeatmapData(workspace.heatmap);
    return (
      <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
        <WorkspacePanel padding="md" className="grid gap-3 sm:grid-cols-5">
          {buckets.map((bucket) => (
            <button
              key={bucket.rating ?? "none"}
              type="button"
              className={`rounded-xl border px-3 py-3 text-center transition hover:opacity-90 ${bucket.cssClass}`}
              onClick={() =>
                setSelectedCell({
                  accountName: props.heatmapLabels?.summaryLabel ?? props.heatmapLabels?.accountLabel ?? "",
                  assertion: "existence",
                  rating: bucket.rating,
                  isSignificant: bucket.rating === "significant",
                  rationale: null,
                })
              }
            >
              <p className="text-xs uppercase tracking-wide">
                {bucket.rating ? (props.maps.ratings[bucket.rating] ?? bucket.rating) : props.unratedLabel}
              </p>
              <p className="mt-1 text-lg font-semibold">{bucket.count}</p>
            </button>
          ))}
        </WorkspacePanel>
        {selectedCell && props.heatmapLabels ? (
          <div className="mt-4">
            <HeatmapCellDetail cell={selectedCell} labels={props.heatmapLabels} ratingLabels={props.maps.ratings} />
          </div>
        ) : null}
      </RiskAssessmentWorkspaceSectionShell>
    );
  }
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={significantOnly}
            onChange={(event) => setSignificantOnly(event.target.checked)}
            className="rounded border-border"
          />
          {props.heatmapLabels?.filterSignificant}
        </label>
      </div>
      <WorkspacePanel padding="sm" className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-muted-foreground" />
              {grid.assertions.map((assertion) => (
                <th key={assertion} className="px-2 py-2 text-center text-muted-foreground">
                  {props.maps.assertions[assertion] ?? assertion}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.accounts.map((account) => (
              <tr key={account}>
                <th className="px-2 py-2 text-left font-medium text-foreground">{account}</th>
                {grid.assertions.map((assertion) => {
                  const cell =
                    visibleCells.find(
                      (entry) => entry.accountName === account && entry.assertion === assertion,
                    ) ??
                    ({
                      accountName: account,
                      assertion,
                      rating: null,
                      isSignificant: false,
                      rationale: null,
                    } as MatrixGridCell);
                  if (significantOnly && !cell.isSignificant && !cell.rating) return null;
                  return (
                    <td key={`${account}-${assertion}`} className="px-1 py-1">
                      <button
                        type="button"
                        className={`h-10 w-full min-w-[3rem] rounded-lg border text-center text-[10px] sm:text-xs ${matrixCellClass(cell, selectedCell?.accountName === account && selectedCell?.assertion === assertion)}`}
                        onClick={() => setSelectedCell(cell)}
                      >
                        {cell.rating ? (props.maps.ratings[cell.rating] ?? cell.rating).slice(0, 3) : "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </WorkspacePanel>
      {selectedCell && props.heatmapLabels ? (
        <div className="mt-4">
          <HeatmapCellDetail cell={selectedCell} labels={props.heatmapLabels} ratingLabels={props.maps.ratings} />
        </div>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskMatrixExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    maps: LabelMaps;
    addLabels: AddLabelFields;
    matrixLabels?: {
      accountLabel: string;
      assertionLabel: string;
      ratingLabel: string;
      significantLabel: string;
      emptyDetail: string;
      selectRating: string;
    };
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [accountName, setAccountName] = useState("");
  const [assertion, setAssertion] = useState<AssertionType>("existence");
  const [compositeRating, setCompositeRating] = useState<RiskRatingLevel | "">("");
  const [selectedCell, setSelectedCell] = useState<MatrixGridCell | null>(null);
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("assertionRatings" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const grid = buildAssertionMatrixGrid(workspace);
  const upsert = (cell?: MatrixGridCell, rating?: RiskRatingLevel | "") => {
    const targetAccount = cell?.accountName ?? accountName.trim();
    const targetAssertion = cell?.assertion ?? assertion;
    const targetRating = rating ?? compositeRating;
    if (!targetAccount) return;
    startTransition(async () => {
      clearError();
      const result = await upsertAssertionRatingAction({
        assessmentId: workspace.id,
        version: workspace.version,
        accountName: targetAccount,
        assertion: targetAssertion,
        compositeRating: targetRating || null,
        isSignificant: targetRating === "significant" || targetRating === "high",
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setAccountName("");
      setCompositeRating("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {grid.cells.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspacePanel padding="sm" className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-muted-foreground" />
                {grid.assertions.map((item) => (
                  <th key={item} className="px-2 py-2 text-center text-muted-foreground">
                    {props.maps.assertions[item] ?? item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.accounts.map((account) => (
                <tr key={account}>
                  <th className="px-2 py-2 text-left font-medium text-foreground">{account}</th>
                  {grid.assertions.map((item) => {
                    const cell =
                      grid.cells.find((entry) => entry.accountName === account && entry.assertion === item) ?? {
                        accountName: account,
                        assertion: item,
                        rating: null,
                        isSignificant: false,
                        rationale: null,
                      };
                    return (
                      <td key={`${account}-${item}`} className="px-1 py-1">
                        <button
                          type="button"
                          className={`h-10 w-full min-w-[3rem] rounded-lg border text-center ${matrixCellClass(cell, selectedCell?.accountName === account && selectedCell?.assertion === item)}`}
                          onClick={() => setSelectedCell(cell)}
                        >
                          {cell.rating ? (props.maps.ratings[cell.rating] ?? cell.rating).slice(0, 3) : "—"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </WorkspacePanel>
      )}
      {selectedCell && props.matrixLabels ? (
        <div className="mt-4 space-y-3">
          <HeatmapCellDetail cell={selectedCell} labels={props.matrixLabels} ratingLabels={props.maps.ratings} />
          {mutable ? (
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm"
                value={compositeRating}
                onChange={(event) => setCompositeRating(event.target.value as RiskRatingLevel | "")}
              >
                <option value="">{props.matrixLabels.selectRating}</option>
                {Object.entries(props.maps.ratings).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Button type="button" size="sm" onClick={() => upsert(selectedCell, compositeRating)} disabled={isPending || !compositeRating}>
                {props.addLabels.addAction}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {mutable ? (
        <WorkspacePanel variant="form" className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder={props.addLabels.accountPlaceholder} />
          <select className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm" value={assertion} onChange={(event) => setAssertion(event.target.value as AssertionType)}>
            {Object.entries(props.maps.assertions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm" value={compositeRating} onChange={(event) => setCompositeRating(event.target.value as RiskRatingLevel | "")}>
            <option value="">{props.matrixLabels?.selectRating}</option>
            {Object.entries(props.maps.ratings).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Button type="button" onClick={() => upsert()} disabled={isPending || !accountName.trim() || !compositeRating}>
            {props.addLabels.addAction}
          </Button>
        </WorkspacePanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskResponsesExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; addLabels: AddLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [riskItemId, setRiskItemId] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("responses" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const addResponse = () => {
    if (!riskItemId || !description.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addResponseAction({
        assessmentId: workspace.id,
        version: workspace.version,
        riskItemId,
        responseType: "reduce",
        description: description.trim(),
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setRiskItemId("");
      setDescription("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {workspace.responses.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.responses.map((response) => (
            <WorkspaceListItem key={response.id}>
              <p className="font-medium text-foreground">{response.riskItemTitle}</p>
              <p className="text-sm text-muted-foreground">{response.description}</p>
              <p className="text-xs text-muted-foreground">
                {props.maps.responseTypes[response.responseType] ?? response.responseType}
              </p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {mutable ? (
        <WorkspaceFormPanel className="mt-6">
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={riskItemId}
            onChange={(event) => setRiskItemId(event.target.value)}
          >
            <option value="">{props.addLabels.riskItemLabel}</option>
            {workspace.registerItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={props.addLabels.descriptionPlaceholder}
          />
          <Button
            type="button"
            onClick={addResponse}
            disabled={isPending || !riskItemId || !description.trim()}
          >
            {props.addLabels.addAction}
          </Button>
        </WorkspaceFormPanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskProceduresExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    addLabels: AddLabelFields;
    locale?: string;
    engagementSlug?: string;
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const procedureOptions = useProcedureOptions();
  const [riskItemId, setRiskItemId] = useState("");
  const [procedureTemplateId, setProcedureTemplateId] = useState("");
  const [reference, setReference] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("procedureLinks" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const selectedTemplate = procedureOptions.find((option) => option.id === procedureTemplateId);
  const addProcedure = () => {
    const procedureReference = reference.trim() || selectedTemplate?.reference;
    if (!riskItemId || !procedureReference) return;
    startTransition(async () => {
      clearError();
      const result = await addProcedureLinkAction({
        assessmentId: workspace.id,
        version: workspace.version,
        riskItemId,
        procedureReference,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setRiskItemId("");
      setProcedureTemplateId("");
      setReference("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {workspace.procedureLinks.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.procedureLinks.map((link) => (
            <WorkspaceListItem key={link.id}>
              <p className="font-medium text-foreground">{link.riskItemTitle}</p>
              <p className="text-sm text-muted-foreground">{link.procedureReference ?? "—"}</p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {mutable ? (
        <WorkspaceFormPanel className="mt-6">
          <select className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm" value={riskItemId} onChange={(event) => setRiskItemId(event.target.value)}>
            <option value="">{props.addLabels.riskItemLabel}</option>
            {workspace.registerItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.isSignificant ? `★ ${item.title}` : item.title}
              </option>
            ))}
          </select>
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={procedureTemplateId}
            onChange={(event) => {
              setProcedureTemplateId(event.target.value);
              const template = procedureOptions.find((option) => option.id === event.target.value);
              if (template) setReference(template.reference);
            }}
          >
            <option value="">{props.addLabels.referencePlaceholder}</option>
            {procedureOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder={props.addLabels.referencePlaceholder} />
          <Button type="button" onClick={addProcedure} disabled={isPending || !riskItemId || (!reference.trim() && !selectedTemplate)}>
            {props.addLabels.addAction}
          </Button>
        </WorkspaceFormPanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskOwnersExperience(props: BaseProps & { canUpdate?: boolean; ownerLabels: OwnerLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [ownerInputs, setOwnerInputs] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("registerItems" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const updateOwner = (riskItemId: string, riskItemVersion: number) => {
    startTransition(async () => {
      clearError();
      const result = await updateRiskItemAction({
        assessmentId: workspace.id,
        version: workspace.version,
        riskItemId,
        riskItemVersion,
        ownerId: ownerInputs[riskItemId]?.trim() || null,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {workspace.registerItems.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.registerItems.map((item) => (
            <WorkspaceListItem key={item.id} className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.ownerId || props.ownerLabels.unassignedLabel}</p>
              </div>
              {mutable ? (
                <div className="flex gap-2">
                  <Input
                    value={ownerInputs[item.id] ?? item.ownerId ?? ""}
                    onChange={(event) => setOwnerInputs((prev) => ({ ...prev, [item.id]: event.target.value }))}
                    placeholder={props.ownerLabels.ownerPlaceholder}
                  />
                  <Button type="button" size="sm" onClick={() => updateOwner(item.id, item.version)} disabled={isPending}>
                    {props.ownerLabels.updateAction}
                  </Button>
                </div>
              ) : null}
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

function NotesExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; noteType: "review" | "internal"; noteLabels: NoteLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("notes" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const notes = props.noteType === "review" ? workspace.reviewNotes : workspace.internalNotes;
  const addNote = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addNoteAction({ assessmentId: workspace.id, version: workspace.version, body: body.trim(), noteType: props.noteType });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setBody("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived && props.archivedReadOnlyLabel ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel} />
      ) : null}
      {notes.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {notes.map((note) => (
            <WorkspaceListItem key={note.id}>
              <p className="text-xs text-muted-foreground">
                {props.maps.noteTypes[note.noteType] ?? note.noteType} ·{" "}
                {props.locale ? formatDateTime(note.createdAt, props.locale) : note.createdAt}
              </p>
              <p className="text-sm text-foreground">{note.body}</p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {mutable ? (
        <WorkspacePanel variant="form" className="mt-6 flex gap-2">
          <Input value={body} onChange={(event) => setBody(event.target.value)} placeholder={props.noteLabels.bodyPlaceholder} />
          <Button type="button" onClick={addNote} disabled={isPending || !body.trim()}>
            {props.noteLabels.addAction}
          </Button>
        </WorkspacePanel>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskReviewNotesExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; noteLabels: NoteLabelFields }) {
  return <NotesExperience {...props} noteType="review" />;
}

export function RiskCommentsExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; noteLabels: NoteLabelFields }) {
  return <NotesExperience {...props} noteType="internal" />;
}

export function RiskHistoryExperience(props: BaseProps & { activity: RiskAssessmentActivityView; historyLabels: { versionLabel: string; updatedLabel: string; actionColumn: string; dateColumn: string; summaryColumn: string; actions: Record<string, string> } }) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      <WorkspaceTable
        columns={[
          {
            id: "action",
            header: props.historyLabels.actionColumn,
            cell: (entry) => formatRiskAssessmentActivityAction(entry.action, props.historyLabels.actions),
          },
          {
            id: "date",
            header: props.historyLabels.dateColumn,
            cell: (entry) => (props.locale ? formatDateTime(entry.createdAt, props.locale) : entry.createdAt),
            hideOnMobile: true,
          },
          {
            id: "summary",
            header: props.historyLabels.summaryColumn,
            cell: (entry) => formatRiskAssessmentActivitySummary(entry.summary),
          },
        ]}
        rows={props.activity.entries}
        keyFn={(entry) => entry.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
      <WorkspacePanel variant="muted" padding="sm" className="grid gap-3 sm:grid-cols-2">
        <p className="text-sm text-muted-foreground">
          {props.historyLabels.versionLabel}:{" "}
          <span className="font-medium text-foreground">{workspace.assessmentVersion}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {props.historyLabels.updatedLabel}:{" "}
          <span className="font-medium text-foreground">
            {props.locale ? formatDateTime(workspace.updatedAt, props.locale) : workspace.updatedAt}
          </span>
        </p>
      </WorkspacePanel>
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskSettingsExperience(props: GateProps & { canArchive?: boolean; workflowLabels: { errorGeneric: string }; labels: { title: string; description: string; archiveAction: string; archiveConfirmAction: string; restoreAction: string; restoreConfirmAction: string; cancelAction: string; archivedBanner: string; readOnlyNotice: string } }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "archive" | "restore">("idle");
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;
  const archive = () => startTransition(async () => {
    clearError();
    const result = await archiveRiskAssessmentAction({ assessmentId: workspace.id, version: workspace.version });
    if (!result.success) {
      setError(result.error?.message ?? props.workflowLabels.errorGeneric);
      return;
    }
    setMode("idle");
    router.refresh();
  });
  const restore = () => startTransition(async () => {
    clearError();
    const result = await restoreRiskAssessmentAction({ assessmentId: workspace.id, version: workspace.version });
    if (!result.success) {
      setError(result.error?.message ?? props.workflowLabels.errorGeneric);
      return;
    }
    setMode("idle");
    router.refresh();
  });
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.labels.archivedBanner} /> : null}
      <WorkspacePanel>
        {!props.canArchive ? (
          <p className="text-sm text-muted-foreground">{props.labels.readOnlyNotice}</p>
        ) : workspace.isArchived ? (
          mode === "restore" ? (
            <div className="flex gap-3">
              <Button type="button" onClick={restore} disabled={isPending}>
                {props.labels.restoreConfirmAction}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                {props.labels.cancelAction}
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setMode("restore")}>
              {props.labels.restoreAction}
            </Button>
          )
        ) : mode === "archive" ? (
          <div className="flex gap-3">
            <Button type="button" onClick={archive} disabled={isPending}>
              {props.labels.archiveConfirmAction}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
              {props.labels.cancelAction}
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setMode("archive")}>
            {props.labels.archiveAction}
          </Button>
        )}
      </WorkspacePanel>
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export { RiskAssessmentOverviewExperience } from "../overview/risk-assessment-overview-experience";
