import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type WorkspaceManagementRow = Tables<"workspace_management_settings">;

export class WorkspaceManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<WorkspaceManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("workspace_management_settings").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"workspace_management_settings">): Promise<WorkspaceManagementRow> {
    const result = await this.client.from("workspace_management_settings").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
