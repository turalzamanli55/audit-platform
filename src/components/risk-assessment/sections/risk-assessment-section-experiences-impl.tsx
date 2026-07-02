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
import { Alert, Button, Input } from "@/components/ui";
import { RiskAssessmentCreateExperience } from "@/components/risk-assessment/create/risk-assessment-create-experience";
import { RiskAssessmentWorkspaceSectionShell } from "@/components/risk-assessment/workspace/risk-assessment-workspace-section-shell";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import type { RiskAssessmentActivityView } from "@/lib/risk-assessment/load-risk-assessment-activity";
import {
  buildRiskHeatmapData,
  formatRiskAssessmentActivityAction,
  formatRiskAssessmentActivitySummary,
} from "@/lib/risk-assessment/risk-assessment-workspace-display";
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
  workspaceLabels: { planningGateDescription: string };
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  workflowLabels: { errorGeneric: string };
  archivedReadOnlyLabel?: string;
  locale?: string;
};

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function useWorkspaceOrCreate(props: GateProps) {
  const { riskAssessment, planningApproved } = useRiskAssessmentWorkspace();
  if (!riskAssessment) {
    return (
      <RiskAssessmentCreateExperience
        canCreate={props.canCreate ?? false}
        planningApproved={props.planningApproved ?? planningApproved}
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

function ArchivedNotice({ message }: { message?: string }) {
  return <Alert variant="warning">{message ?? "This section is read-only while archived."}</Alert>;
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
    maps: LabelMaps;
    addLabels: AddLabelFields;
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const normalizedType = props.riskType?.replace("-", "_") as RiskType | undefined;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [riskType, setRiskType] = useState<RiskType>(normalizedType ?? "inherent");
  const [likelihood, setLikelihood] = useState<RiskLikelihood | "">("");
  const [impact, setImpact] = useState<RiskImpact | "">("");
  const [inherentRating, setInherentRating] = useState<RiskRatingLevel | "">("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("registerItems" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const items = normalizedType
    ? workspace.registerItems.filter((item) => item.riskType === normalizedType)
    : workspace.registerItems;

  const addRisk = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addRiskItemAction({
        assessmentId: workspace.id,
        version: workspace.version,
        categoryId: categoryId || null,
        riskType: normalizedType ?? riskType,
        title: title.trim(),
        description: description.trim() || null,
        likelihood: likelihood || null,
        impact: impact || null,
        inherentRating: inherentRating || null,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setTitle("");
      setDescription("");
      setCategoryId("");
      setLikelihood("");
      setImpact("");
      setInherentRating("");
      router.refresh();
    });
  };

  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {items.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {items.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <p className="font-medium text-foreground">{item.title}</p>
              {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
      {mutable ? (
        <div className="mt-6 space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          {!normalizedType ? (
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
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={props.addLabels.titlePlaceholder} />
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder={props.addLabels.descriptionPlaceholder} />
          <Button type="button" onClick={addRisk} disabled={isPending || !title.trim()}>
            {props.addLabels.addAction}
          </Button>
        </div>
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.categories.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {workspace.categories.map((category) => (
            <li key={category.id} className="px-5 py-4">
              <p className="font-medium text-foreground">{category.name}</p>
              <p className="text-sm text-muted-foreground">{category.description ?? "—"}</p>
            </li>
          ))}
        </ul>
      )}
      {mutable ? (
        <div className="mt-6 space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={props.addLabels.namePlaceholder} />
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder={props.addLabels.descriptionPlaceholder} />
          <Button type="button" onClick={addCategory} disabled={isPending || !name.trim()}>
            {props.addLabels.addAction}
          </Button>
        </div>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskScoringExperience(props: BaseProps & { maps: LabelMaps; summaryLabels: SummaryLabelFields }) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("registerItems" in workspace)) return workspace;
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {workspace.registerItems.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <div className="grid gap-3 rounded-2xl border border-border/50 bg-card/80 p-5 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label={props.summaryLabels.ratedItems ?? ""} value={workspace.registerItems.filter((item) => item.inherentRating || item.residualRating).length} />
          <Metric label={props.summaryLabels.significant ?? ""} value={workspace.significantRiskCount} />
          <Metric label={props.summaryLabels.likelihood ?? ""} value={workspace.registerItems.filter((item) => item.likelihood === "high").length} />
          <Metric label={props.summaryLabels.impact ?? ""} value={workspace.registerItems.filter((item) => item.impact === "high").length} />
          <Metric label={props.summaryLabels.residual ?? ""} value={workspace.registerItems.filter((item) => item.residualRating === "significant").length} />
        </div>
      )}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function RiskHeatmapExperience(props: BaseProps & { maps: LabelMaps; unratedLabel?: string }) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("heatmap" in workspace)) return workspace;
  if (workspace.heatmap.length === 0) {
    return (
      <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      </RiskAssessmentWorkspaceSectionShell>
    );
  }
  const buckets = buildRiskHeatmapData(workspace.heatmap);
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      <div className="grid gap-3 rounded-2xl border border-border/50 bg-card/80 p-5 sm:grid-cols-5">
        {buckets.map((bucket) => (
          <div key={bucket.rating ?? "none"} className={`rounded-xl border px-3 py-3 text-center ${bucket.cssClass}`}>
            <p className="text-xs uppercase tracking-wide">
              {bucket.rating ? (props.maps.ratings[bucket.rating] ?? bucket.rating) : props.unratedLabel}
            </p>
            <p className="mt-1 text-lg font-semibold">{bucket.count}</p>
          </div>
        ))}
      </div>
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskMatrixExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; addLabels: AddLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [accountName, setAccountName] = useState("");
  const [assertion, setAssertion] = useState<AssertionType>("existence");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("assertionRatings" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const upsert = () => {
    if (!accountName.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await upsertAssertionRatingAction({
        assessmentId: workspace.id,
        version: workspace.version,
        accountName: accountName.trim(),
        assertion,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setAccountName("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.assertionRatings.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {workspace.assertionRatings.map((rating) => <li key={rating.id} className="px-5 py-4"><p className="font-medium text-foreground">{rating.accountName} · {props.maps.assertions[rating.assertion] ?? rating.assertion}</p><p className="text-xs text-muted-foreground">{(rating.compositeRating && props.maps.ratings[rating.compositeRating]) || "—"}</p></li>)}
        </ul>
      )}
      {mutable ? (
        <div className="mt-6 flex gap-2 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder={props.addLabels.accountPlaceholder} />
          <select className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm" value={assertion} onChange={(event) => setAssertion(event.target.value as AssertionType)}>
            {Object.entries(props.maps.assertions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Button type="button" onClick={upsert} disabled={isPending || !accountName.trim()}>
            {props.addLabels.addAction}
          </Button>
        </div>
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.responses.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {workspace.responses.map((response) => (
            <li key={response.id} className="px-5 py-4">
              <p className="font-medium text-foreground">{response.riskItemTitle}</p>
              <p className="text-sm text-muted-foreground">{response.description}</p>
              <p className="text-xs text-muted-foreground">
                {props.maps.responseTypes[response.responseType] ?? response.responseType}
              </p>
            </li>
          ))}
        </ul>
      )}
      {mutable ? (
        <div className="mt-6 space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
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
        </div>
      ) : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskProceduresExperience(props: BaseProps & { canUpdate?: boolean; addLabels: AddLabelFields }) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [riskItemId, setRiskItemId] = useState("");
  const [reference, setReference] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();
  if (typeof workspace !== "object" || !("procedureLinks" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);
  const addProcedure = () => {
    if (!riskItemId || !reference.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addProcedureLinkAction({ assessmentId: workspace.id, version: workspace.version, riskItemId, procedureReference: reference.trim() });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setRiskItemId("");
      setReference("");
      router.refresh();
    });
  };
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.procedureLinks.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">{workspace.procedureLinks.map((link) => <li key={link.id} className="px-5 py-4"><p className="font-medium text-foreground">{link.riskItemTitle}</p><p className="text-sm text-muted-foreground">{link.procedureReference ?? "—"}</p></li>)}</ul>
      )}
      {mutable ? <div className="mt-6 space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5"><select className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm" value={riskItemId} onChange={(event) => setRiskItemId(event.target.value)}><option value="">{props.addLabels.riskItemLabel}</option>{workspace.registerItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder={props.addLabels.referencePlaceholder} /><Button type="button" onClick={addProcedure} disabled={isPending || !riskItemId || !reference.trim()}>{props.addLabels.addAction}</Button></div> : null}
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.registerItems.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">{workspace.registerItems.map((item) => <li key={item.id} className="space-y-2 px-5 py-4"><div className="flex justify-between"><p className="font-medium text-foreground">{item.title}</p><p className="text-xs text-muted-foreground">{item.ownerId || props.ownerLabels.unassignedLabel}</p></div>{mutable ? <div className="flex gap-2"><Input value={ownerInputs[item.id] ?? item.ownerId ?? ""} onChange={(event) => setOwnerInputs((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder={props.ownerLabels.ownerPlaceholder} /><Button type="button" size="sm" onClick={() => updateOwner(item.id, item.version)} disabled={isPending}>{props.ownerLabels.updateAction}</Button></div> : null}</li>)}</ul>
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {notes.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">{notes.map((note) => <li key={note.id} className="px-5 py-4"><p className="text-xs text-muted-foreground">{props.maps.noteTypes[note.noteType] ?? note.noteType} · {props.locale ? formatDateTime(note.createdAt, props.locale) : note.createdAt}</p><p className="text-sm text-foreground">{note.body}</p></li>)}</ul>
      )}
      {mutable ? <div className="mt-6 flex gap-2 rounded-2xl border border-border/50 bg-card/60 p-5"><Input value={body} onChange={(event) => setBody(event.target.value)} placeholder={props.noteLabels.bodyPlaceholder} /><Button type="button" onClick={addNote} disabled={isPending || !body.trim()}>{props.noteLabels.addAction}</Button></div> : null}
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export function RiskReviewNotesExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; noteLabels: NoteLabelFields }) {
  return <NotesExperience {...props} noteType="review" />;
}

export function RiskCommentsExperience(props: BaseProps & { canUpdate?: boolean; maps: LabelMaps; noteLabels: NoteLabelFields }) {
  return <NotesExperience {...props} noteType="internal" />;
}

export function RiskHistoryExperience(props: BaseProps & { activity: RiskAssessmentActivityView; historyLabels: { versionLabel: string; updatedLabel: string; actions: Record<string, string> } }) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;
  return (
    <RiskAssessmentWorkspaceSectionShell title={props.labels.title} description={props.labels.description}>
      {props.activity.entries.length === 0 ? <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} /> : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">{props.activity.entries.map((entry) => <li key={entry.id} className="px-5 py-4"><p className="text-sm font-medium text-foreground">{formatRiskAssessmentActivityAction(entry.action, props.historyLabels.actions)}</p><p className="text-xs text-muted-foreground">{props.locale ? formatDateTime(entry.createdAt, props.locale) : entry.createdAt}</p><p className="text-sm text-muted-foreground">{formatRiskAssessmentActivitySummary(entry.summary)}</p></li>)}</ul>
      )}
      <div className="grid gap-3 rounded-2xl border border-border/50 bg-card/40 p-4 sm:grid-cols-2">
        <p className="text-sm text-muted-foreground">{props.historyLabels.versionLabel}: <span className="font-medium text-foreground">{workspace.assessmentVersion}</span></p>
        <p className="text-sm text-muted-foreground">{props.historyLabels.updatedLabel}: <span className="font-medium text-foreground">{props.locale ? formatDateTime(workspace.updatedAt, props.locale) : workspace.updatedAt}</span></p>
      </div>
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? <ArchivedNotice message={props.labels.archivedBanner} /> : null}
      <div className="rounded-2xl border border-border/50 bg-card/80 p-5">
        {!props.canArchive ? <p className="text-sm text-muted-foreground">{props.labels.readOnlyNotice}</p> : workspace.isArchived ? (mode === "restore" ? <div className="flex gap-3"><Button type="button" onClick={restore} disabled={isPending}>{props.labels.restoreConfirmAction}</Button><Button type="button" variant="ghost" onClick={() => setMode("idle")}>{props.labels.cancelAction}</Button></div> : <Button type="button" onClick={() => setMode("restore")}>{props.labels.restoreAction}</Button>) : (mode === "archive" ? <div className="flex gap-3"><Button type="button" onClick={archive} disabled={isPending}>{props.labels.archiveConfirmAction}</Button><Button type="button" variant="ghost" onClick={() => setMode("idle")}>{props.labels.cancelAction}</Button></div> : <Button type="button" onClick={() => setMode("archive")}>{props.labels.archiveAction}</Button>)}
      </div>
    </RiskAssessmentWorkspaceSectionShell>
  );
}

export { RiskAssessmentOverviewExperience } from "../overview/risk-assessment-overview-experience";
