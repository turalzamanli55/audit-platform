import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type MethodologyConfigurationRow = Tables<"methodology_configuration_profiles">;

export class MethodologyConfigurationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<MethodologyConfigurationRow[]> {
    const result = await applyActiveFilter(
      this.client.from("methodology_configuration_profiles").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"methodology_configuration_profiles">): Promise<MethodologyConfigurationRow> {
    const result = await this.client.from("methodology_configuration_profiles").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
