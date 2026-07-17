import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type LegalHoldAndRetentionRow = Tables<"legal_hold_and_retention_policies">;

export class LegalHoldAndRetentionRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<LegalHoldAndRetentionRow[]> {
    const result = await applyActiveFilter(
      this.client.from("legal_hold_and_retention_policies").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"legal_hold_and_retention_policies">): Promise<LegalHoldAndRetentionRow> {
    const result = await this.client.from("legal_hold_and_retention_policies").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
