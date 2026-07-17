import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type UserProvisioningRow = Tables<"user_provisioning_invitations">;

export class UserProvisioningRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<UserProvisioningRow[]> {
    const result = await applyActiveFilter(
      this.client.from("user_provisioning_invitations").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"user_provisioning_invitations">): Promise<UserProvisioningRow> {
    const result = await this.client.from("user_provisioning_invitations").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
