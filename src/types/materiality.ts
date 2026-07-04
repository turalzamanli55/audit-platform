export type MaterialityPackageStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "returned"
  | "approved"
  | "archived";

export type MaterialityBenchmarkType =
  | "revenue"
  | "profit_before_tax"
  | "ebitda"
  | "total_assets"
  | "equity"
  | "expenses"
  | "manual";

export type MaterialityCalculationType = "overall" | "performance" | "specific" | "trivial";

export type MaterialityCommentType = "review" | "internal";

export type SpecificMaterialityItem = {
  id: string;
  label: string;
  amount: number;
  rationale?: string | null;
};

export type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
