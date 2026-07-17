import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type TemplateManagementRow = Tables<"template_management_items">;

export class TemplateManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<TemplateManagementRow[]> {
    const result = await applyActiveFilter(
      this.client.from("template_management_items").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"template_management_items">): Promise<TemplateManagementRow> {
    const result = await this.client.from("template_management_items").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
