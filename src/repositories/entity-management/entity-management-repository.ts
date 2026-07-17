import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type EntityManagementRow = Tables<"entity_management_units">;

export class EntityManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<EntityManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("entity_management_units").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"entity_management_units">): Promise<EntityManagementRow> {
    const result = await this.client.from("entity_management_units").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
