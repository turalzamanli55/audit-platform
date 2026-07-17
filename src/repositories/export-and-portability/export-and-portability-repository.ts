import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type ExportAndPortabilityRow = Tables<"export_and_portability_requests">;

export class ExportAndPortabilityRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<ExportAndPortabilityRow[]> {
    const result = await applyActiveFilter(
      this.client.from("export_and_portability_requests").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"export_and_portability_requests">): Promise<ExportAndPortabilityRow> {
    const result = await this.client.from("export_and_portability_requests").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
