import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  LOCKED_MATERIALITY_STATUSES,
} from "@/constants/materiality";
import { ValidationError } from "@/lib/errors";

const SUBMITTABLE_PACKAGE_STATUSES = ["draft", "returned"] as const;
const RETURNABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;

export type MaterialityGateTarget = Pick<AuditPlan, "planning_status">;

export type MaterialityWorkflowTarget = {
  package_status: string;
  deleted_at?: string | null;
};

export type MaterialitySubmitCheck = {
  selectedBenchmarkId: string | null;
  overallMateriality: number | null;
  performanceMateriality: number | null;
  trivialThreshold: number | null;
};

export type ComputeMaterialityProgressInput = {
  totalBenchmarks: number;
  benchmarksWithAmount: number;
  hasSelectedBenchmark: boolean;
  hasOverallMateriality: boolean;
  hasPerformanceMateriality: boolean;
  hasTrivialThreshold: boolean;
  hasBasisNotes: boolean;
};

export function isPlanningApproved(plan: MaterialityGateTarget): boolean {
  return plan.planning_status === "approved";
}

export function isMaterialityApproved(
  materialityPackage: Pick<MaterialityWorkflowTarget, "package_status">,
): boolean {
  return materialityPackage.package_status === "approved";
}

export function assertMaterialityCreateGate(plan: MaterialityGateTarget | null): void {
  if (!plan || !isPlanningApproved(plan)) {
    throw new ValidationError(
      "Materiality cannot begin until audit planning is approved (ENG-03).",
    );
  }
}

export function assertMaterialityGate(
  materialityPackage: Pick<MaterialityWorkflowTarget, "package_status"> | null,
): void {
  if (!materialityPackage || !isMaterialityApproved(materialityPackage)) {
    throw new ValidationError(
      "Risk assessment cannot begin until materiality is approved (ENG-04).",
    );
  }
}

export function assertPackageEditable(materialityPackage: MaterialityWorkflowTarget): void {
  if (
    LOCKED_MATERIALITY_STATUSES.includes(
      materialityPackage.package_status as (typeof LOCKED_MATERIALITY_STATUSES)[number],
    ) ||
    materialityPackage.deleted_at
  ) {
    throw new ValidationError("Approved or archived materiality packages are read-only.");
  }
}

export function assertCanSubmit(
  materialityPackage: Pick<MaterialityWorkflowTarget, "package_status">,
): void {
  if (
    !SUBMITTABLE_PACKAGE_STATUSES.includes(
      materialityPackage.package_status as (typeof SUBMITTABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only draft or returned materiality packages can be submitted.");
  }
}

export function assertCanReturn(
  materialityPackage: Pick<MaterialityWorkflowTarget, "package_status">,
): void {
  if (
    !RETURNABLE_PACKAGE_STATUSES.includes(
      materialityPackage.package_status as (typeof RETURNABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted materiality packages can be returned.");
  }
}

export function assertCanApprove(
  materialityPackage: Pick<MaterialityWorkflowTarget, "package_status">,
): void {
  if (
    !APPROVABLE_PACKAGE_STATUSES.includes(
      materialityPackage.package_status as (typeof APPROVABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted materiality packages can be approved.");
  }
}

export function assertSubmitPrerequisites(pkg: MaterialitySubmitCheck): void {
  if (!pkg.selectedBenchmarkId) {
    throw new ValidationError("A benchmark must be selected before submission.");
  }
  if (pkg.overallMateriality == null || pkg.overallMateriality <= 0) {
    throw new ValidationError("Overall materiality must be determined before submission.");
  }
  if (pkg.performanceMateriality == null || pkg.performanceMateriality <= 0) {
    throw new ValidationError("Performance materiality must be determined before submission.");
  }
  if (pkg.trivialThreshold == null || pkg.trivialThreshold <= 0) {
    throw new ValidationError("Clearly trivial threshold must be determined before submission.");
  }
}

export function computeMaterialityProgress(input: ComputeMaterialityProgressInput): number {
  const sections: number[] = [];

  sections.push(
    input.totalBenchmarks === 0
      ? 0
      : Math.round((input.benchmarksWithAmount / input.totalBenchmarks) * 100),
  );
  sections.push(input.hasSelectedBenchmark ? 100 : 0);
  sections.push(input.hasOverallMateriality ? 100 : 0);
  sections.push(input.hasPerformanceMateriality ? 100 : 0);
  sections.push(input.hasTrivialThreshold ? 100 : 0);
  sections.push(input.hasBasisNotes ? 100 : 0);

  if (sections.length === 0) return 0;
  return Math.round(sections.reduce((sum, value) => sum + value, 0) / sections.length);
}

export function computeOpenMaterialityItems(
  pkg: {
    selected_benchmark_id: string | null;
    overall_materiality: number | null;
    performance_materiality: number | null;
    trivial_threshold: number | null;
    basis_notes: string | null;
  },
  benchmarks: Array<{ benchmark_amount: number }>,
): number {
  let open = 0;
  if (benchmarks.some((benchmark) => benchmark.benchmark_amount <= 0)) open += 1;
  if (!pkg.selected_benchmark_id) open += 1;
  if (pkg.overall_materiality == null) open += 1;
  if (pkg.performance_materiality == null) open += 1;
  if (pkg.trivial_threshold == null) open += 1;
  if (!pkg.basis_notes?.trim()) open += 1;
  return open;
}
