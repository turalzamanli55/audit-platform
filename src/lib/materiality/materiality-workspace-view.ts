import type {
  MaterialityBenchmarkType,
  MaterialityCalculationType,
  MaterialityCommentType,
  MaterialityPackageStatus,
  SpecificMaterialityItem,
} from "@/types/materiality";

export type MaterialityBenchmarkView = {
  id: string;
  benchmarkType: MaterialityBenchmarkType;
  benchmarkLabel: string | null;
  benchmarkAmount: number;
  percentage: number;
  calculatedMateriality: number | null;
  isSelected: boolean;
  rationale: string | null;
  sortOrder: number;
  version: number;
};

export type MaterialityVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  createdAt: string;
};

export type MaterialityCalculationView = {
  id: string;
  calculationType: MaterialityCalculationType;
  benchmarkId: string | null;
  inputAmount: number | null;
  percentage: number | null;
  resultAmount: number | null;
  isManualOverride: boolean;
  explanation: string | null;
  formula: string | null;
  createdAt: string;
};

export type MaterialityCommentView = {
  id: string;
  commentType: MaterialityCommentType;
  body: string;
  createdAt: string;
};

export type MaterialityWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  packageStatus: MaterialityPackageStatus;
  packageVersion: number;
  progressPct: number;
  currencyCode: string;
  overallMateriality: number | null;
  performanceMateriality: number | null;
  performanceMaterialityPct: number | null;
  specificMateriality: SpecificMaterialityItem[];
  trivialThreshold: number | null;
  trivialThresholdPct: number | null;
  basisNotes: string | null;
  selectedBenchmarkId: string | null;
  benchmarks: MaterialityBenchmarkView[];
  calculations: MaterialityCalculationView[];
  comments: MaterialityCommentView[];
  reviewComments: MaterialityCommentView[];
  internalComments: MaterialityCommentView[];
  versions: MaterialityVersionView[];
  pendingReviewCount: number;
  openItemsCount: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  submittedAt: string | null;
  returnedAt: string | null;
  returnNotes: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MaterialityWorkspaceLoadResult =
  | {
      ok: true;
      materiality: MaterialityWorkspaceView | null;
      /** @deprecated Use `materiality` */
      materialityPackage: MaterialityWorkspaceView | null;
      engagementSlug: string;
      planningApproved: boolean;
      materialityApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type MaterialityWorkspaceSection =
  | "overview"
  | "overall"
  | "performance"
  | "specific"
  | "benchmarks"
  | "calculations"
  | "versions"
  | "comments"
  | "history"
  | "settings";

export type MaterialityActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  versionNumber: number | null;
};

export type MaterialityActivityView = {
  entries: MaterialityActivityEntryView[];
};

export type { SpecificMaterialityItem };
