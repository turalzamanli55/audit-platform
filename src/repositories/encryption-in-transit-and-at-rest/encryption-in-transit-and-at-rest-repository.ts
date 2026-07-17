import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type EncryptionInTransitAndAtRestRow = Tables<"encryption_in_transit_and_at_rest_controls">;

export class EncryptionInTransitAndAtRestRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<EncryptionInTransitAndAtRestRow[]> {
    const result = await applyActiveFilter(
      this.client.from("encryption_in_transit_and_at_rest_controls").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"encryption_in_transit_and_at_rest_controls">): Promise<EncryptionInTransitAndAtRestRow> {
    const result = await this.client.from("encryption_in_transit_and_at_rest_controls").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
