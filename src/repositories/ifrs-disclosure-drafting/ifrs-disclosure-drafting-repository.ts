import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type IfrsDisclosureDraftingItem = Tables<"ifrs_disclosure_drafting_items">;

export class IfrsDisclosureDraftingRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByEngagement(engagementId: string): Promise<IfrsDisclosureDraftingItem[]> {
    const result = await applyActiveFilter(
      this.client
        .from("ifrs_disclosure_drafting_items")
        .select("*")
        .eq("engagement_id", engagementId),
    ).order("disclosure_code", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async createItem(
    input: TablesInsert<"ifrs_disclosure_drafting_items">,
  ): Promise<IfrsDisclosureDraftingItem> {
    const result = await this.client
      .from("ifrs_disclosure_drafting_items")
      .insert(input)
      .select("*")
      .single();
    return unwrapSupabaseResult(result);
  }
}
