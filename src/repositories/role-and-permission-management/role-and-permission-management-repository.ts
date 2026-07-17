import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type RoleAndPermissionManagementRow = Tables<"role_and_permission_management_bundles">;

export class RoleAndPermissionManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<RoleAndPermissionManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("role_and_permission_management_bundles").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"role_and_permission_management_bundles">): Promise<RoleAndPermissionManagementRow> {
    const result = await this.client.from("role_and_permission_management_bundles").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
