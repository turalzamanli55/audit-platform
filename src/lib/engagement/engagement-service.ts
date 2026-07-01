import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { CreateEngagementInput, UpdateEngagementInput } from "@/lib/engagement/validation";
import {
  EngagementRepository,
  type CreateEngagementRecordInput,
  type Engagement,
} from "@/repositories/engagement/engagement-repository";
import type { EngagementLifecycleStatus } from "@/types/engagement";

/**
 * Application service for engagement mutations — coordinates repository operations.
 */
export class EngagementService {
  private readonly repository: EngagementRepository;

  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    this.repository = new EngagementRepository(client, context);
  }

  create(input: CreateEngagementRecordInput): Promise<Engagement> {
    return this.repository.create(input);
  }

  update(id: string, version: number, patch: UpdateEngagementInput): Promise<Engagement> {
    return this.repository.update(id, version, {
      name: patch.name,
      engagement_code: patch.engagementCode,
      engagement_type: patch.engagementType,
      lifecycle_status: patch.lifecycleStatus,
      reporting_framework: patch.reportingFramework,
      period_start: patch.periodStart,
      period_end: patch.periodEnd,
      planned_start: patch.plannedStart,
      planned_end: patch.plannedEnd,
      description: patch.description,
      notes: patch.notes,
    });
  }

  updateLifecycleStatus(
    id: string,
    version: number,
    lifecycleStatus: EngagementLifecycleStatus,
  ): Promise<Engagement> {
    return this.repository.updateLifecycleStatus(id, version, lifecycleStatus);
  }

  archive(id: string, version: number): Promise<Engagement> {
    return this.repository.archive(id, version);
  }

  restore(id: string, version: number): Promise<Engagement> {
    return this.repository.restore(id, version);
  }

  resolveUniqueSlug(workspaceId: string, baseSlug: string, excludeId?: string): Promise<string> {
    return this.repository.resolveUniqueSlug(workspaceId, baseSlug, excludeId);
  }

  validateCreate(input: CreateEngagementInput) {
    return input;
  }
}
