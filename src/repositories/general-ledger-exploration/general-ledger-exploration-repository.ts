import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type GeneralLedgerExplorationView = Tables<"general_ledger_exploration_views">;

export class GeneralLedgerExplorationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByEngagement(engagementId: string): Promise<GeneralLedgerExplorationView[]> {
    const result = await applyActiveFilter(
      this.client
        .from("general_ledger_exploration_views")
        .select("*")
        .eq("engagement_id", engagementId),
    ).order("account_code", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async importRows(
    rows: TablesInsert<"general_ledger_exploration_views">[],
  ): Promise<GeneralLedgerExplorationView[]> {
    if (rows.length === 0) return [];
    const result = await this.client
      .from("general_ledger_exploration_views")
      .insert(rows)
      .select("*");
    return unwrapSupabaseList(result);
  }
}
