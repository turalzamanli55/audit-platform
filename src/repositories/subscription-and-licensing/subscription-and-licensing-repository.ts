import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type SubscriptionAndLicensingRow = Tables<"subscription_and_licensing_plans">;

export class SubscriptionAndLicensingRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<SubscriptionAndLicensingRow[]> {
    const result = await applyActiveFilter(
      this.client.from("subscription_and_licensing_plans").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"subscription_and_licensing_plans">): Promise<SubscriptionAndLicensingRow> {
    const result = await this.client.from("subscription_and_licensing_plans").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
