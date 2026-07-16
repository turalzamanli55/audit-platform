import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseMaybeSingle } from "@/utils/supabase-result";
import {
  assertAuditReportReady,
  isAuditReportReady,
  type AuditReportPackage,
} from "@/lib/audit-engine/audit-report-generation";

export type ReportingPackage = Tables<"reporting_packages">;
export type OpinionPackage = Tables<"opinion_packages">;

/**
 * Audit report generation repository — assembles readiness signals from
 * reporting and opinion packages (PROJECT_BIBLE §13.5 Reporting).
 */
export class AuditReportGenerationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findReportingPackageByEngagement(
    engagementId: string,
  ): Promise<ReportingPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("reporting_packages").select("*").eq("engagement_id", engagementId),
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findOpinionPackageByEngagement(engagementId: string): Promise<OpinionPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("opinion_packages").select("*").eq("engagement_id", engagementId),
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listReportingPackagesForWorkspace(workspaceId: string): Promise<ReportingPackage[]> {
    const result = await applyActiveFilter(
      this.client.from("reporting_packages").select("*").eq("workspace_id", workspaceId),
    ).order("created_at", { ascending: false });

    return unwrapSupabaseList(result);
  }

  buildReadiness(input: {
    opinionApproved: boolean;
    findingsClosedOrAccepted: boolean;
    financialStatementsApproved: boolean;
    representationLetterReceived: boolean;
  }): AuditReportPackage & { ready: boolean } {
    const pkg: AuditReportPackage = input;
    return { ...pkg, ready: isAuditReportReady(pkg) };
  }

  assertReady(pkg: AuditReportPackage): void {
    assertAuditReportReady(pkg);
  }
}
