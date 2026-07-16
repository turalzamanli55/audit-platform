import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { EngagementLifecycleStatus } from "@/types/engagement";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type EngagementLifecycleEvent = Tables<"engagement_lifecycle_events">;

export type RecordEngagementLifecycleEventInput = {
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  fromStatus: EngagementLifecycleStatus | null;
  toStatus: EngagementLifecycleStatus;
  reason?: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * Engagement lifecycle history — immutable transition events
 * (PROJECT_BIBLE §13.2 Audit).
 */
export class EngagementLifecycleManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async recordEvent(
    input: RecordEngagementLifecycleEventInput,
  ): Promise<EngagementLifecycleEvent> {
    const payload: TablesInsert<"engagement_lifecycle_events"> = {
      engagement_id: input.engagementId,
      organization_id: input.organizationId,
      workspace_id: input.workspaceId,
      from_status: input.fromStatus,
      to_status: input.toStatus,
      actor_id: this.userId,
      reason: input.reason ?? null,
      metadata: (input.metadata ?? {}) as TablesInsert<"engagement_lifecycle_events">["metadata"],
    };

    const result = await this.client
      .from("engagement_lifecycle_events")
      .insert(payload)
      .select("*")
      .single();

    return unwrapSupabaseResult(result);
  }

  async listByEngagement(engagementId: string): Promise<EngagementLifecycleEvent[]> {
    const result = await applyActiveFilter(
      this.client
        .from("engagement_lifecycle_events")
        .select("*")
        .eq("engagement_id", engagementId),
    ).order("created_at", { ascending: false });

    return unwrapSupabaseList(result);
  }

  async latestForEngagement(
    engagementId: string,
  ): Promise<EngagementLifecycleEvent | null> {
    const result = await applyActiveFilter(
      this.client
        .from("engagement_lifecycle_events")
        .select("*")
        .eq("engagement_id", engagementId),
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }
}
