import "server-only";

import type { Database } from "@/types/supabase";
import type { EngagementMemberView } from "@/lib/engagement/engagement-member-view";

export type EngagementWorkspaceView = {
  id: string;
  slug: string;
  name: string;
  engagementCode: string | null;
  companyId: string;
  companyName: string;
  companySlug: string;
  engagementType: Database["public"]["Enums"]["engagement_type"];
  lifecycleStatus: Database["public"]["Enums"]["engagement_lifecycle_status"];
  reportingFramework: string;
  periodStart: string | null;
  periodEnd: string | null;
  plannedStart: string | null;
  plannedEnd: string | null;
  description: string | null;
  notes: string | null;
  status: Database["public"]["Enums"]["record_status"];
  createdAt: string;
  updatedAt: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  members: EngagementMemberView[];
  memberCount: number;
};

export type EngagementWorkspaceLoadResult =
  | { ok: true; engagement: EngagementWorkspaceView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };
