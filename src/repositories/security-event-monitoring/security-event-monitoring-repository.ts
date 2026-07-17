import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type SecurityEventMonitoringRow = Tables<"security_event_monitoring_events">;

export class SecurityEventMonitoringRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByOrganization(organizationId: string): Promise<SecurityEventMonitoringRow[]> {
    const result = await applyActiveFilter(
      this.client.from("security_event_monitoring_events").select("*").eq("organization_id", organizationId),
    );
    return unwrapSupabaseList(result);
  }

  async create(input: TablesInsert<"security_event_monitoring_events">): Promise<SecurityEventMonitoringRow> {
    const result = await this.client.from("security_event_monitoring_events").insert(input).select("*").single();
    return unwrapSupabaseResult(result);
  }
}
