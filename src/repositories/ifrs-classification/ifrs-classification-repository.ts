import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type IfrsClassificationRule = Tables<"ifrs_classification_rules">;

export class IfrsClassificationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listRules(workspaceId: string): Promise<IfrsClassificationRule[]> {
    const result = await applyActiveFilter(
      this.client.from("ifrs_classification_rules").select("*").eq("workspace_id", workspaceId),
    ).order("priority", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async createRule(
    input: TablesInsert<"ifrs_classification_rules">,
  ): Promise<IfrsClassificationRule> {
    const result = await this.client
      .from("ifrs_classification_rules")
      .insert(input)
      .select("*")
      .single();
    return unwrapSupabaseResult(result);
  }
}
