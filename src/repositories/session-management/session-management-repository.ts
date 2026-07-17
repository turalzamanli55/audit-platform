import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type SessionManagementRow = Tables<"session_management_policies">;

export class SessionManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<SessionManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("session_management_policies").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"session_management_policies">): Promise<SessionManagementRow> {
    const result = await this.client.from("session_management_policies").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
