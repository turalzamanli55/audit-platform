import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type AccountMappingGovernanceEntry = Tables<"account_mapping_governance_entries">;

export class AccountMappingGovernanceRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByEngagement(engagementId: string): Promise<AccountMappingGovernanceEntry[]> {
    const result = await applyActiveFilter(
      this.client
        .from("account_mapping_governance_entries")
        .select("*")
        .eq("engagement_id", engagementId),
    );
    return unwrapSupabaseList(result);
  }

  async upsertEntry(
    input: TablesInsert<"account_mapping_governance_entries">,
  ): Promise<AccountMappingGovernanceEntry> {
    const result = await this.client
      .from("account_mapping_governance_entries")
      .insert(input)
      .select("*")
      .single();
    return unwrapSupabaseResult(result);
  }
}
