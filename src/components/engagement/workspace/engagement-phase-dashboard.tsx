"use client";

import Link from "next/link";
import {
  WorkspaceEmpty,
  WorkspacePanel,
  WorkspaceProgressBar,
  WorkspaceStatusBadge,
  workspaceTokens,
} from "@/components/workspace";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";

export type EngagementPhaseCard = {
  id: "planning" | "materiality" | "risk-assessment" | "fieldwork" | "review";
  title: string;
  description: string;
  href: string;
  statusLabel: string;
  statusVariant: "default" | "warning" | "success" | "destructive";
  progressPct: number;
  kpiPrimary: { label: string; value: string };
  kpiSecondary: { label: string; value: string };
  ctaLabel: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
};

type EngagementPhaseDashboardProps = {
  cards: EngagementPhaseCard[];
  attentionTitle: string;
  attentionDescription: string;
  attentionItems: Array<{ id: string; label: string; href: string }>;
};

export function EngagementPhaseDashboard({
  cards,
  attentionTitle,
  attentionDescription,
  attentionItems,
}: EngagementPhaseDashboardProps) {
  return (
    <div className="space-y-6">
      {attentionItems.length > 0 ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-foreground">{attentionTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{attentionDescription}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {attentionItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-warning/40 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <WorkspacePanel key={card.id} padding="md" className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">{card.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </div>
              <WorkspaceStatusBadge label={card.statusLabel} variant={card.statusVariant} />
            </div>

            {card.isEmpty ? (
              <div className="mt-5 flex flex-1 flex-col justify-center">
                <WorkspaceEmpty title={card.emptyTitle} description={card.emptyDescription} />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.kpiPrimary.label}</span>
                  <span className="font-medium text-foreground">{card.kpiPrimary.value}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.kpiSecondary.label}</span>
                  <span className="font-medium text-foreground">{card.kpiSecondary.value}</span>
                </div>
                <WorkspaceProgressBar label={card.kpiPrimary.label} value={card.progressPct} />
              </div>
            )}

            <div className="mt-5">
              <Link href={card.href} className={`${workspaceTokens.backButton} w-full justify-center sm:w-auto`}>
                {card.ctaLabel}
              </Link>
            </div>
          </WorkspacePanel>
        ))}
      </div>
    </div>
  );
}

export function buildEngagementPhaseCards(input: {
  locale: string;
  slug: string;
  labels: {
    planning: { title: string; description: string; openPlanning: string; planningProgress: string; planningStatus: string };
    materiality: {
      title: string;
      description: string;
      openMateriality: string;
      materialityProgress: string;
      materialityStatus: string;
      overallMateriality: string;
    };
    riskAssessment: {
      title: string;
      description: string;
      openRiskAssessment: string;
      riskProgress: string;
      riskStatus: string;
      significantRisks: string;
    };
    fieldwork: {
      title: string;
      description: string;
      openFieldwork: string;
      fieldworkProgress: string;
      fieldworkStatus: string;
      findingsCount: string;
    };
    review: {
      title: string;
      description: string;
      openReview: string;
      reviewProgress: string;
      reviewStatus: string;
      pendingReviews: string;
    };
    phaseEmpty: {
      planningTitle: string;
      planningDescription: string;
      materialityTitle: string;
      materialityDescription: string;
      riskTitle: string;
      riskDescription: string;
      fieldworkTitle: string;
      fieldworkDescription: string;
      reviewTitle: string;
      reviewDescription: string;
      notStarted: string;
    };
  };
  planningLabels: { statuses: Record<string, string> };
  materialityLabels: { statuses: Record<string, string> };
  riskLabels: { statuses: Record<string, string> };
  fieldworkLabels: { statuses: Record<string, string> };
  reviewLabels: { statuses: Record<string, string> };
  plan: PlanningWorkspaceView | null;
  materiality: MaterialityWorkspaceView | null;
  riskAssessment: RiskAssessmentWorkspaceView | null;
  fieldwork: FieldworkWorkspaceView | null;
  review: ReviewWorkspaceView | null;
}): EngagementPhaseCard[] {
  const base = `/${input.locale}/app/engagements/${input.slug}`;
  const { labels, planningLabels, materialityLabels, riskLabels, fieldworkLabels } = input;
  const notStarted = labels.phaseEmpty.notStarted;

  function statusVariant(
    status: string,
  ): "default" | "warning" | "success" | "destructive" {
    if (status === "approved") return "success";
    if (["submitted", "under_review", "pending_review"].includes(status)) return "warning";
    if (status === "returned") return "destructive";
    return "default";
  }

  return [
    {
      id: "planning",
      title: labels.planning.title,
      description: labels.planning.description,
      href: `${base}/planning`,
      statusLabel: input.plan
        ? planningLabels.statuses[input.plan.planningStatus]
        : notStarted,
      statusVariant: input.plan ? statusVariant(input.plan.planningStatus) : "default",
      progressPct: input.plan?.kpiProgress ?? 0,
      kpiPrimary: {
        label: labels.planning.planningStatus,
        value: input.plan ? planningLabels.statuses[input.plan.planningStatus] : notStarted,
      },
      kpiSecondary: {
        label: labels.planning.planningProgress,
        value: input.plan ? `${input.plan.kpiProgress}%` : "—",
      },
      ctaLabel: labels.planning.openPlanning,
      isEmpty: !input.plan,
      emptyTitle: labels.phaseEmpty.planningTitle,
      emptyDescription: labels.phaseEmpty.planningDescription,
    },
    {
      id: "materiality",
      title: labels.materiality.title,
      description: labels.materiality.description,
      href: `${base}/materiality`,
      statusLabel: input.materiality
        ? materialityLabels.statuses[input.materiality.packageStatus]
        : notStarted,
      statusVariant: input.materiality
        ? statusVariant(input.materiality.packageStatus)
        : "default",
      progressPct: input.materiality?.progressPct ?? 0,
      kpiPrimary: {
        label: labels.materiality.materialityStatus,
        value: input.materiality
          ? materialityLabels.statuses[input.materiality.packageStatus]
          : notStarted,
      },
      kpiSecondary: {
        label: labels.materiality.overallMateriality,
        value:
          input.materiality?.overallMateriality != null
            ? new Intl.NumberFormat(input.locale, {
                style: "currency",
                currency: input.materiality.currencyCode,
                maximumFractionDigits: 0,
              }).format(input.materiality.overallMateriality)
            : "—",
      },
      ctaLabel: labels.materiality.openMateriality,
      isEmpty: !input.materiality,
      emptyTitle: labels.phaseEmpty.materialityTitle,
      emptyDescription: labels.phaseEmpty.materialityDescription,
    },
    {
      id: "risk-assessment",
      title: labels.riskAssessment.title,
      description: labels.riskAssessment.description,
      href: `${base}/risk-assessment`,
      statusLabel: input.riskAssessment
        ? riskLabels.statuses[input.riskAssessment.assessmentStatus]
        : notStarted,
      statusVariant: input.riskAssessment
        ? statusVariant(input.riskAssessment.assessmentStatus)
        : "default",
      progressPct: input.riskAssessment?.progressPct ?? 0,
      kpiPrimary: {
        label: labels.riskAssessment.riskStatus,
        value: input.riskAssessment
          ? riskLabels.statuses[input.riskAssessment.assessmentStatus]
          : notStarted,
      },
      kpiSecondary: {
        label: labels.riskAssessment.significantRisks,
        value: input.riskAssessment ? String(input.riskAssessment.significantRiskCount) : "—",
      },
      ctaLabel: labels.riskAssessment.openRiskAssessment,
      isEmpty: !input.riskAssessment,
      emptyTitle: labels.phaseEmpty.riskTitle,
      emptyDescription: labels.phaseEmpty.riskDescription,
    },
    {
      id: "fieldwork",
      title: labels.fieldwork.title,
      description: labels.fieldwork.description,
      href: `${base}/fieldwork`,
      statusLabel: input.fieldwork
        ? fieldworkLabels.statuses[input.fieldwork.packageStatus]
        : notStarted,
      statusVariant: input.fieldwork ? statusVariant(input.fieldwork.packageStatus) : "default",
      progressPct: input.fieldwork?.progressPct ?? 0,
      kpiPrimary: {
        label: labels.fieldwork.fieldworkStatus,
        value: input.fieldwork
          ? fieldworkLabels.statuses[input.fieldwork.packageStatus]
          : notStarted,
      },
      kpiSecondary: {
        label: labels.fieldwork.findingsCount,
        value: input.fieldwork ? String(input.fieldwork.findings.length) : "—",
      },
      ctaLabel: labels.fieldwork.openFieldwork,
      isEmpty: !input.fieldwork,
      emptyTitle: labels.phaseEmpty.fieldworkTitle,
      emptyDescription: labels.phaseEmpty.fieldworkDescription,
    },
    {
      id: "review",
      title: labels.review.title,
      description: labels.review.description,
      href: `${base}/review`,
      statusLabel: input.review
        ? input.reviewLabels.statuses[input.review.packageStatus]
        : notStarted,
      statusVariant: input.review ? statusVariant(input.review.packageStatus) : "default",
      progressPct: input.review?.progressPct ?? 0,
      kpiPrimary: {
        label: labels.review.reviewStatus,
        value: input.review
          ? input.reviewLabels.statuses[input.review.packageStatus]
          : notStarted,
      },
      kpiSecondary: {
        label: labels.review.pendingReviews,
        value: input.review
          ? `${input.review.pendingCount} / ${input.review.returnedCount}`
          : "—",
      },
      ctaLabel: labels.review.openReview,
      isEmpty: !input.review,
      emptyTitle: labels.phaseEmpty.reviewTitle,
      emptyDescription: labels.phaseEmpty.reviewDescription,
    },
  ];
}

export function buildEngagementAttentionItems(input: {
  locale: string;
  slug: string;
  plan: PlanningWorkspaceView | null;
  materiality: MaterialityWorkspaceView | null;
  riskAssessment: RiskAssessmentWorkspaceView | null;
  fieldwork: FieldworkWorkspaceView | null;
  labels: {
    attentionPlanning: string;
    attentionMateriality: string;
    attentionRisk: string;
    attentionFieldwork: string;
  };
}): Array<{ id: string; label: string; href: string }> {
  const base = `/${input.locale}/app/engagements/${input.slug}`;
  const items: Array<{ id: string; label: string; href: string }> = [];

  if (input.plan?.planningStatus === "pending_review") {
    items.push({ id: "planning", label: input.labels.attentionPlanning, href: `${base}/planning` });
  }
  if (
    input.materiality &&
    ["submitted", "under_review", "returned"].includes(input.materiality.packageStatus)
  ) {
    items.push({
      id: "materiality",
      label: input.labels.attentionMateriality,
      href: `${base}/materiality`,
    });
  }
  if (
    input.riskAssessment &&
    ["submitted", "under_review", "returned"].includes(input.riskAssessment.assessmentStatus)
  ) {
    items.push({ id: "risk", label: input.labels.attentionRisk, href: `${base}/risk-assessment` });
  }
  if (input.fieldwork && input.fieldwork.pendingReviewCount > 0) {
    items.push({
      id: "fieldwork",
      label: input.labels.attentionFieldwork.replace(
        "{count}",
        String(input.fieldwork.pendingReviewCount),
      ),
      href: `${base}/fieldwork`,
    });
  }

  return items;
}
