import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type ControlDeficiencyEvaluationRow = Tables<"control_deficiency_evaluations">;

export class ControlDeficiencyEvaluationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByEngagement(engagementId: string): Promise<ControlDeficiencyEvaluationRow[]> {
    const result = await applyActiveFilter(
      this.client
        .from("control_deficiency_evaluations")
        .select("*")
        .eq("engagement_id", engagementId),
    );
    return unwrapSupabaseList(result);
  }

  async createEvaluation(
    input: TablesInsert<"control_deficiency_evaluations">,
  ): Promise<ControlDeficiencyEvaluationRow> {
    const result = await this.client
      .from("control_deficiency_evaluations")
      .insert(input)
      .select("*")
      .single();
    return unwrapSupabaseResult(result);
  }
}
