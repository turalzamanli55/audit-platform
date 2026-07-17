import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type RoleBasedAccessControlRow = Tables<"role_based_access_control_assignments">;

export class RoleBasedAccessControlRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<RoleBasedAccessControlRow[]> {
    const result = await applyActiveFilter(
      this.client.from("role_based_access_control_assignments").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"role_based_access_control_assignments">): Promise<RoleBasedAccessControlRow> {
    const result = await this.client.from("role_based_access_control_assignments").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
