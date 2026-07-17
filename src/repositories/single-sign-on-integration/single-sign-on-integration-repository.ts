import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type SingleSignOnIntegrationRow = Tables<"single_sign_on_integration_providers">;

export class SingleSignOnIntegrationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<SingleSignOnIntegrationRow[]> {
    const result = await applyActiveFilter(
      this.client.from("single_sign_on_integration_providers").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"single_sign_on_integration_providers">): Promise<SingleSignOnIntegrationRow> {
    const result = await this.client.from("single_sign_on_integration_providers").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
