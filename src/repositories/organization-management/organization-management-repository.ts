import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type OrganizationManagementRow = Tables<"organization_management_profiles">;

export class OrganizationManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<OrganizationManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("organization_management_profiles").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"organization_management_profiles">): Promise<OrganizationManagementRow> {
    const result = await this.client.from("organization_management_profiles").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
