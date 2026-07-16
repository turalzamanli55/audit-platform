import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { IsaPhase } from "@/constants/audit-engine";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseMaybeSingle } from "@/utils/supabase-result";
import { assertIsaPhaseOrder, nextIsaPhase } from "@/lib/audit-engine/isa-aligned-methodology";

export type AuditProgram = Tables<"audit_programs">;

/**
 * ISA-aligned methodology repository — reads engagement audit programs
 * and derives the next ISA phase (PROJECT_BIBLE §13.2 Audit).
 */
export class IsaAlignedMethodologyRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findAuditProgramByEngagement(engagementId: string): Promise<AuditProgram | null> {
    const result = await applyActiveFilter(
      this.client.from("audit_programs").select("*").eq("engagement_id", engagementId),
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listAuditProgramsForWorkspace(workspaceId: string): Promise<AuditProgram[]> {
    const result = await applyActiveFilter(
      this.client.from("audit_programs").select("*").eq("workspace_id", workspaceId),
    ).order("created_at", { ascending: false });

    return unwrapSupabaseList(result);
  }

  resolveNextIsaPhase(completedPhases: IsaPhase[]): IsaPhase | null {
    return nextIsaPhase(completedPhases);
  }

  assertPhaseAdvance(completedPhases: IsaPhase[], next: IsaPhase): void {
    assertIsaPhaseOrder(completedPhases, next);
  }
}
