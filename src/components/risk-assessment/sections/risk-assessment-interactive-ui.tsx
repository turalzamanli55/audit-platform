"use client";

import { useMemo } from "react";
import { WorkspacePanel } from "@/components/workspace";
import { DEFAULT_AUDIT_AREAS, DEFAULT_MATRIX_ACCOUNTS, DEFAULT_PROCEDURE_TEMPLATES } from "@/constants/risk-assessment";
import { ratingToHeatmapColor } from "@/lib/risk-assessment/risk-assessment-rules";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { AssertionType, RiskHeatmapCell, RiskRatingLevel } from "@/types/risk-assessment";

export function buildAuditAreaOptions(workspace: RiskAssessmentWorkspaceView): string[] {
  const fromItems = workspace.registerItems
    .map((item) => item.auditArea)
    .filter((value): value is string => Boolean(value?.trim()));
  const fromMatrix = workspace.assertionRatings.map((rating) => rating.accountName);
  return [...new Set([...DEFAULT_AUDIT_AREAS, ...fromItems, ...fromMatrix])].sort((a, b) =>
    a.localeCompare(b),
  );
}

export type MatrixGridCell = {
  accountName: string;
  assertion: AssertionType;
  rating: RiskRatingLevel | null;
  isSignificant: boolean;
  rationale: string | null;
};

export function buildAssertionMatrixGrid(workspace: RiskAssessmentWorkspaceView): {
  accounts: string[];
  assertions: AssertionType[];
  cells: MatrixGridCell[];
} {
  const accounts = [
    ...new Set([
      ...DEFAULT_MATRIX_ACCOUNTS,
      ...workspace.assertionRatings.map((rating) => rating.accountName),
      ...workspace.heatmap.map((cell) => cell.accountName),
    ]),
  ];
  const assertions = Object.keys({
    existence: true,
    completeness: true,
    accuracy: true,
    cutoff: true,
    classification: true,
    presentation: true,
  }) as AssertionType[];

  const ratingMap = new Map<string, MatrixGridCell>();
  for (const rating of workspace.assertionRatings) {
    ratingMap.set(`${rating.accountName}::${rating.assertion}`, {
      accountName: rating.accountName,
      assertion: rating.assertion,
      rating: rating.compositeRating,
      isSignificant: rating.isSignificant,
      rationale: rating.rationale,
    });
  }
  for (const cell of workspace.heatmap) {
    const key = `${cell.accountName}::${cell.assertion}`;
    if (!ratingMap.has(key)) {
      ratingMap.set(key, {
        accountName: cell.accountName,
        assertion: cell.assertion,
        rating: cell.rating,
        isSignificant: cell.isSignificant,
        rationale: null,
      });
    }
  }

  const cells: MatrixGridCell[] = [];
  for (const accountName of accounts) {
    for (const assertion of assertions) {
      cells.push(
        ratingMap.get(`${accountName}::${assertion}`) ?? {
          accountName,
          assertion,
          rating: null,
          isSignificant: false,
          rationale: null,
        },
      );
    }
  }

  return { accounts, assertions, cells };
}

export function matrixCellClass(cell: MatrixGridCell, selected: boolean): string {
  const base = ratingToHeatmapColor(cell.rating);
  return `${base} ${selected ? "ring-2 ring-foreground/40" : ""} ${cell.isSignificant ? "font-semibold" : ""}`;
}

export function useProcedureOptions() {
  return useMemo(
    () =>
      DEFAULT_PROCEDURE_TEMPLATES.map((template) => ({
        id: template.id,
        reference: template.reference,
        label: `${template.reference} — ${template.label}`,
      })),
    [],
  );
}

export function RiskSignificantBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
      {label}
    </span>
  );
}

export function HeatmapCellDetail({
  cell,
  labels,
  ratingLabels,
}: {
  cell: MatrixGridCell | RiskHeatmapCell | null;
  labels: {
    accountLabel: string;
    assertionLabel: string;
    ratingLabel: string;
    significantLabel: string;
    emptyDetail: string;
  };
  ratingLabels: Record<string, string>;
}) {
  if (!cell) {
    return <p className="text-sm text-muted-foreground">{labels.emptyDetail}</p>;
  }

  const assertion = cell.assertion;
  const accountName = cell.accountName;
  const rating = cell.rating;
  const isSignificant = cell.isSignificant;

  return (
    <WorkspacePanel padding="sm" className="space-y-2 text-sm">
      <p>
        <span className="text-muted-foreground">{labels.accountLabel}: </span>
        <span className="font-medium text-foreground">{accountName}</span>
      </p>
      <p>
        <span className="text-muted-foreground">{labels.assertionLabel}: </span>
        <span className="font-medium text-foreground">{assertion}</span>
      </p>
      <p>
        <span className="text-muted-foreground">{labels.ratingLabel}: </span>
        <span className="font-medium text-foreground">
          {rating ? (ratingLabels[rating] ?? rating) : "—"}
        </span>
      </p>
      {isSignificant ? (
        <p className="text-xs font-medium uppercase tracking-wide text-destructive">{labels.significantLabel}</p>
      ) : null}
    </WorkspacePanel>
  );
}
