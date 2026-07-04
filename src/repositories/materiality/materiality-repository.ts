import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { SpecificMaterialityItem } from "@/types/materiality";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import {
  DEFAULT_MATERIALITY_BENCHMARKS,
  DEFAULT_PERFORMANCE_MATERIALITY_PCT,
  DEFAULT_TRIVIAL_THRESHOLD_PCT,
  LOCKED_MATERIALITY_STATUSES,
  MATERIALITY_ACTIVITY_ACTIONS,
} from "@/constants/materiality";
import {
  buildCalculationExplanation,
  calculateOverallMateriality,
  calculatePerformanceMateriality,
  calculateTrivialThreshold,
} from "@/lib/materiality/materiality-engine";
import { computeMaterialityProgress } from "@/lib/materiality/materiality-rules";

export type MaterialityPackage = Tables<"materiality_packages">;
export type MaterialityBenchmark = Tables<"materiality_benchmarks">;
export type MaterialityCalculation = Tables<"materiality_calculations">;
export type MaterialityComment = Tables<"materiality_comments">;
export type MaterialityVersion = Tables<"materiality_versions">;
export type MaterialityActivity = Tables<"materiality_activity">;

export type CreateMaterialityPackageInput = Pick<
  TablesInsert<"materiality_packages">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id"
>;

export type UpdateMaterialityPackageInput = Partial<
  Pick<
    TablesUpdate<"materiality_packages">,
    | "package_status"
    | "package_version"
    | "progress_pct"
    | "currency_code"
    | "overall_materiality"
    | "performance_materiality"
    | "performance_materiality_pct"
    | "specific_materiality"
    | "trivial_threshold"
    | "trivial_threshold_pct"
    | "basis_notes"
    | "selected_benchmark_id"
    | "return_notes"
    | "submitted_at"
    | "submitted_by"
    | "returned_at"
    | "returned_by"
    | "approved_at"
    | "approved_by"
    | "status"
  >
>;

export type UpsertBenchmarkInput = {
  materialityPackageId: string;
  benchmarkId?: string;
  benchmarkType: TablesInsert<"materiality_benchmarks">["benchmark_type"];
  benchmarkLabel?: string | null;
  benchmarkAmount: number;
  percentage: number;
  rationale?: string | null;
  sortOrder?: number;
};

export type RecordCalculationInput = {
  materialityPackageId: string;
  benchmarkId?: string | null;
  calculationType: TablesInsert<"materiality_calculations">["calculation_type"];
  inputAmount?: number | null;
  percentage?: number | null;
  resultAmount?: number | null;
  isManualOverride?: boolean;
  explanation?: string | null;
  formula?: string | null;
};

export type AddCommentInput = {
  materialityPackageId: string;
  commentType?: TablesInsert<"materiality_comments">["comment_type"];
  body: string;
};

export type LogMaterialityActivityInput = {
  materialityPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class MaterialityRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<MaterialityPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("materiality_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<MaterialityPackage | null> {
    const result = await this.client
      .from("materiality_packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<MaterialityPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("materiality_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<MaterialityPackage | null> {
    const result = await this.client
      .from("materiality_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createPackage(input: CreateMaterialityPackageInput): Promise<MaterialityPackage> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Materiality package already exists for this engagement");
    }

    const result = await this.client
      .from("materiality_packages")
      .insert({
        ...input,
        package_status: "draft",
        performance_materiality_pct: DEFAULT_PERFORMANCE_MATERIALITY_PCT,
        trivial_threshold_pct: DEFAULT_TRIVIAL_THRESHOLD_PCT,
      })
      .select("*")
      .single();

    const pkg = requireRow(unwrapSupabaseResult(result), "MaterialityPackage");
    await this.seedDefaultBenchmarks(pkg);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.CREATED,
      summary: "Materiality package initiated from approved audit plan",
      metadata: { packageVersion: pkg.package_version },
    });

    await this.recomputeProgress(pkg.id);
    return (await this.findById(pkg.id)) ?? pkg;
  }

  async updatePackage(
    id: string,
    expectedVersion: number,
    input: UpdateMaterialityPackageInput,
  ): Promise<MaterialityPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }

    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.UPDATED,
      summary: "Materiality package updated",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async archive(id: string, expectedVersion: number): Promise<MaterialityPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
          package_status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Materiality package archived",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async restore(id: string, expectedVersion: number): Promise<MaterialityPackage> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Materiality package is not archived");
    }

    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await this.client
      .from("materiality_packages")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
        package_status: existing.package_status === "archived" ? "draft" : existing.package_status,
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.RESTORED,
      summary: "Materiality package restored",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<MaterialityPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }
    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({
          package_status: "submitted",
          submitted_at: new Date().toISOString(),
          submitted_by: this.userId,
          returned_at: null,
          returned_by: null,
          return_notes: null,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Materiality package submitted for review",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<MaterialityPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({
          package_status: "returned",
          returned_at: new Date().toISOString(),
          returned_by: this.userId,
          return_notes: returnNotes,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Materiality package returned for revision",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async approve(id: string, expectedVersion: number): Promise<MaterialityPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Materiality package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "MaterialityPackage");

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({
          package_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: this.userId,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.APPROVED,
      summary: "Materiality package approved",
      metadata: { approvedBy: this.userId, packageVersion: pkg.package_version },
    });

    return pkg;
  }

  async createVersion(
    materialityPackageId: string,
    changeSummary?: string | null,
  ): Promise<MaterialityVersion> {
    const pkg = await this.requirePackageForMutation(materialityPackageId);
    const [benchmarks, calculations] = await Promise.all([
      this.listBenchmarks(materialityPackageId),
      this.listCalculations(materialityPackageId),
    ]);

    const nextVersionNumber = pkg.package_version + 1;
    const snapshot = {
      package: pkg,
      benchmarks,
      calculations,
      specificMateriality: pkg.specific_materiality,
    };

    const versionResult = await this.client
      .from("materiality_versions")
      .insert({
        materiality_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        version_number: nextVersionNumber,
        snapshot: snapshot as Database["public"]["Tables"]["materiality_versions"]["Insert"]["snapshot"],
        change_summary: changeSummary ?? null,
        created_by: this.userId,
      })
      .select("*")
      .single();

    const version = requireRow(unwrapSupabaseResult(versionResult), "MaterialityVersion");

    await this.client
      .from("materiality_packages")
      .update({ package_version: nextVersionNumber })
      .eq("id", pkg.id);

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.VERSION_CREATED,
      summary: changeSummary ?? `Version ${nextVersionNumber} created`,
      metadata: { versionNumber: nextVersionNumber, versionId: version.id },
    });

    return version;
  }

  async upsertBenchmark(input: UpsertBenchmarkInput): Promise<MaterialityBenchmark> {
    const pkg = await this.requirePackageForMutation(input.materialityPackageId);

    let benchmark: MaterialityBenchmark;

    if (input.benchmarkId) {
      const existingResult = await applyActiveFilter(
        this.client.from("materiality_benchmarks").select("*").eq("id", input.benchmarkId),
      ).maybeSingle();
      const existing = requireRow(
        unwrapSupabaseMaybeSingle(existingResult),
        "MaterialityBenchmark",
        input.benchmarkId,
      );

      if (existing.materiality_package_id !== pkg.id) {
        throw new ValidationError("Benchmark does not belong to this materiality package");
      }

      const calculatedMateriality = calculateOverallMateriality(
        input.benchmarkAmount,
        input.percentage,
      );

      const updateResult = await applyActiveFilter(
        this.client
          .from("materiality_benchmarks")
          .update({
            benchmark_type: input.benchmarkType,
            benchmark_label: input.benchmarkLabel ?? null,
            benchmark_amount: input.benchmarkAmount,
            percentage: input.percentage,
            calculated_materiality: calculatedMateriality,
            rationale: input.rationale ?? null,
            sort_order: input.sortOrder ?? existing.sort_order,
          })
          .eq("id", existing.id)
          .select("*"),
      ).maybeSingle();

      benchmark = requireRow(
        unwrapSupabaseMaybeSingle(updateResult),
        "MaterialityBenchmark",
        existing.id,
      );
    } else {
      const calculatedMateriality = calculateOverallMateriality(
        input.benchmarkAmount,
        input.percentage,
      );

      const insertResult = await this.client
        .from("materiality_benchmarks")
        .insert({
          materiality_package_id: pkg.id,
          engagement_id: pkg.engagement_id,
          organization_id: pkg.organization_id,
          workspace_id: pkg.workspace_id,
          benchmark_type: input.benchmarkType,
          benchmark_label: input.benchmarkLabel ?? null,
          benchmark_amount: input.benchmarkAmount,
          percentage: input.percentage,
          calculated_materiality: calculatedMateriality,
          rationale: input.rationale ?? null,
          sort_order: input.sortOrder ?? 0,
        })
        .select("*")
        .single();

      benchmark = requireRow(unwrapSupabaseResult(insertResult), "MaterialityBenchmark");
    }

    await this.recordCalculation({
      materialityPackageId: pkg.id,
      benchmarkId: benchmark.id,
      calculationType: "overall",
      inputAmount: benchmark.benchmark_amount,
      percentage: benchmark.percentage,
      resultAmount: benchmark.calculated_materiality,
      explanation: buildCalculationExplanation({
        calculationType: "overall",
        inputAmount: Number(benchmark.benchmark_amount),
        percentage: Number(benchmark.percentage),
        resultAmount: Number(benchmark.calculated_materiality ?? 0),
        benchmarkLabel: benchmark.benchmark_label,
        currencyCode: pkg.currency_code,
      }),
      formula: `${benchmark.benchmark_amount} × ${benchmark.percentage}%`,
    });

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_UPSERTED,
      summary: `Benchmark "${benchmark.benchmark_label ?? benchmark.benchmark_type}" updated`,
      metadata: { benchmarkId: benchmark.id },
    });

    await this.recomputeProgress(pkg.id);
    return benchmark;
  }

  async selectBenchmark(
    materialityPackageId: string,
    expectedVersion: number,
    benchmarkId: string,
  ): Promise<MaterialityPackage> {
    const pkg = await this.requirePackageForMutation(materialityPackageId);
    assertVersionMatch(pkg.version, expectedVersion, "MaterialityPackage");

    const benchmarkResult = await applyActiveFilter(
      this.client.from("materiality_benchmarks").select("*").eq("id", benchmarkId),
    ).maybeSingle();
    const benchmark = requireRow(
      unwrapSupabaseMaybeSingle(benchmarkResult),
      "MaterialityBenchmark",
      benchmarkId,
    );

    if (benchmark.materiality_package_id !== pkg.id) {
      throw new ValidationError("Benchmark does not belong to this materiality package");
    }

    await applyActiveFilter(
      this.client
        .from("materiality_benchmarks")
        .update({ is_selected: false })
        .eq("materiality_package_id", pkg.id),
    );

    await applyActiveFilter(
      this.client.from("materiality_benchmarks").update({ is_selected: true }).eq("id", benchmarkId),
    );

    const overallMateriality = benchmark.calculated_materiality;
    const performancePct = Number(pkg.performance_materiality_pct ?? DEFAULT_PERFORMANCE_MATERIALITY_PCT);
    const trivialPct = Number(pkg.trivial_threshold_pct ?? DEFAULT_TRIVIAL_THRESHOLD_PCT);
    const performanceMateriality =
      overallMateriality != null
        ? calculatePerformanceMateriality(Number(overallMateriality), performancePct)
        : null;
    const trivialThreshold =
      overallMateriality != null
        ? calculateTrivialThreshold(Number(overallMateriality), trivialPct)
        : null;

    const updateResult = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({
          selected_benchmark_id: benchmarkId,
          overall_materiality: overallMateriality,
          performance_materiality: performanceMateriality,
          trivial_threshold: trivialThreshold,
        })
        .eq("id", pkg.id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(updateResult), "MaterialityPackage", pkg.id);

    if (overallMateriality != null) {
      await this.recordCalculation({
        materialityPackageId: pkg.id,
        benchmarkId,
        calculationType: "performance",
        inputAmount: Number(overallMateriality),
        percentage: performancePct,
        resultAmount: performanceMateriality,
        explanation: buildCalculationExplanation({
          calculationType: "performance",
          inputAmount: Number(overallMateriality),
          percentage: performancePct,
          resultAmount: Number(performanceMateriality ?? 0),
          currencyCode: pkg.currency_code,
        }),
      });

      await this.recordCalculation({
        materialityPackageId: pkg.id,
        benchmarkId,
        calculationType: "trivial",
        inputAmount: Number(overallMateriality),
        percentage: trivialPct,
        resultAmount: trivialThreshold,
        explanation: buildCalculationExplanation({
          calculationType: "trivial",
          inputAmount: Number(overallMateriality),
          percentage: trivialPct,
          resultAmount: Number(trivialThreshold ?? 0),
          currencyCode: pkg.currency_code,
        }),
      });
    }

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_SELECTED,
      summary: `Benchmark "${benchmark.benchmark_label ?? benchmark.benchmark_type}" selected`,
      metadata: { benchmarkId, overallMateriality },
    });

    await this.recomputeProgress(updated.id);
    return updated;
  }

  async recordCalculation(input: RecordCalculationInput): Promise<MaterialityCalculation> {
    const pkg = await this.findById(input.materialityPackageId);
    if (!pkg) {
      throw new NotFoundError("Materiality package not found", { id: input.materialityPackageId });
    }

    const result = await this.client
      .from("materiality_calculations")
      .insert({
        materiality_package_id: pkg.id,
        benchmark_id: input.benchmarkId ?? null,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        calculation_type: input.calculationType,
        input_amount: input.inputAmount ?? null,
        percentage: input.percentage ?? null,
        result_amount: input.resultAmount ?? null,
        is_manual_override: input.isManualOverride ?? false,
        explanation: input.explanation ?? null,
        formula: input.formula ?? null,
        created_by: this.userId,
      })
      .select("*")
      .single();

    const calculation = requireRow(unwrapSupabaseResult(result), "MaterialityCalculation");

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.CALCULATION_RECORDED,
      summary: `${input.calculationType} calculation recorded`,
      metadata: { calculationId: calculation.id, calculationType: input.calculationType },
    });

    return calculation;
  }

  async addComment(input: AddCommentInput): Promise<MaterialityComment> {
    const pkg = await this.requirePackageForMutation(input.materialityPackageId);

    const result = await this.client
      .from("materiality_comments")
      .insert({
        materiality_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        comment_type: input.commentType ?? "review",
        body: input.body.trim(),
      })
      .select("*")
      .single();

    const comment = requireRow(unwrapSupabaseResult(result), "MaterialityComment");

    await this.logActivity({
      materialityPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: MATERIALITY_ACTIVITY_ACTIONS.COMMENT_ADDED,
      summary: "Materiality comment added",
      metadata: { commentId: comment.id, commentType: comment.comment_type },
    });

    return comment;
  }

  async listActivity(materialityPackageId: string, limit = 100): Promise<MaterialityActivity[]> {
    const result = await this.client
      .from("materiality_activity")
      .select("*")
      .eq("materiality_package_id", materialityPackageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listVersions(materialityPackageId: string): Promise<MaterialityVersion[]> {
    const result = await this.client
      .from("materiality_versions")
      .select("*")
      .eq("materiality_package_id", materialityPackageId)
      .order("version_number", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async listBenchmarks(materialityPackageId: string): Promise<MaterialityBenchmark[]> {
    const result = await applyActiveFilter(
      this.client
        .from("materiality_benchmarks")
        .select("*")
        .eq("materiality_package_id", materialityPackageId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listCalculations(materialityPackageId: string, limit = 100): Promise<MaterialityCalculation[]> {
    const result = await this.client
      .from("materiality_calculations")
      .select("*")
      .eq("materiality_package_id", materialityPackageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listComments(materialityPackageId: string): Promise<MaterialityComment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("materiality_comments")
        .select("*")
        .eq("materiality_package_id", materialityPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogMaterialityActivityInput): Promise<MaterialityActivity> {
    const result = await this.client
      .from("materiality_activity")
      .insert({
        materiality_package_id: input.materialityPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        created_by: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["materiality_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "MaterialityActivity");
  }

  async recomputeProgress(materialityPackageId: string): Promise<MaterialityPackage> {
    const pkg = await this.findById(materialityPackageId);
    if (!pkg) {
      throw new NotFoundError("Materiality package not found", { id: materialityPackageId });
    }

    const benchmarks = await this.listBenchmarks(materialityPackageId);
    const progressPct = computeMaterialityProgress({
      totalBenchmarks: benchmarks.length,
      benchmarksWithAmount: benchmarks.filter((benchmark) => Number(benchmark.benchmark_amount) > 0)
        .length,
      hasSelectedBenchmark: Boolean(pkg.selected_benchmark_id),
      hasOverallMateriality: pkg.overall_materiality != null,
      hasPerformanceMateriality: pkg.performance_materiality != null,
      hasTrivialThreshold: pkg.trivial_threshold != null,
      hasBasisNotes: Boolean(pkg.basis_notes?.trim()),
    });

    const result = await applyActiveFilter(
      this.client
        .from("materiality_packages")
        .update({ progress_pct: progressPct })
        .eq("id", materialityPackageId)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "MaterialityPackage", materialityPackageId);
  }

  async validateWorkspaceOwnership(
    materialityPackageId: string,
    workspaceId: string,
  ): Promise<MaterialityPackage> {
    const pkg = await this.findByIdAnyState(materialityPackageId);
    if (!pkg) {
      throw new NotFoundError("Materiality package not found", { id: materialityPackageId });
    }

    if (pkg.workspace_id !== workspaceId) {
      throw new AuthorizationError("Materiality package does not belong to the active workspace", {
        materialityPackageId,
        workspaceId,
      });
    }

    return pkg;
  }

  parseSpecificMateriality(value: unknown): SpecificMaterialityItem[] {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is SpecificMaterialityItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as SpecificMaterialityItem).id === "string" &&
        typeof (item as SpecificMaterialityItem).label === "string" &&
        typeof (item as SpecificMaterialityItem).amount === "number",
    );
  }

  private async requirePackageForMutation(materialityPackageId: string): Promise<MaterialityPackage> {
    const pkg = await this.findById(materialityPackageId);
    if (!pkg) {
      throw new NotFoundError("Materiality package not found", { id: materialityPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    return pkg;
  }

  private ensurePackageIsEditable(pkg: MaterialityPackage): void {
    if (
      LOCKED_MATERIALITY_STATUSES.includes(
        pkg.package_status as (typeof LOCKED_MATERIALITY_STATUSES)[number],
      )
    ) {
      throw new ValidationError(
        `Materiality package is locked in status "${pkg.package_status}"`,
      );
    }
  }

  private async seedDefaultBenchmarks(pkg: MaterialityPackage): Promise<void> {
    const rows = DEFAULT_MATERIALITY_BENCHMARKS.map((benchmark) => ({
      materiality_package_id: pkg.id,
      engagement_id: pkg.engagement_id,
      organization_id: pkg.organization_id,
      workspace_id: pkg.workspace_id,
      benchmark_type: benchmark.type,
      benchmark_label: benchmark.label,
      benchmark_amount: 0,
      percentage: benchmark.percentage,
      calculated_materiality: 0,
      sort_order: benchmark.sortOrder,
    }));

    if (rows.length > 0) {
      await this.client.from("materiality_benchmarks").insert(rows);
    }
  }
}
