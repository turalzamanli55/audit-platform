import "server-only";

import type { Database } from "@/types/supabase";

export type EngagementListItem = {
  id: string;
  slug: string;
  name: string;
  engagementCode: string | null;
  companyId: string;
  companyName: string;
  engagementType: Database["public"]["Enums"]["engagement_type"];
  lifecycleStatus: Database["public"]["Enums"]["engagement_lifecycle_status"];
  reportingFramework: string;
  periodStart: string | null;
  periodEnd: string | null;
  status: Database["public"]["Enums"]["record_status"];
  updatedAt: string;
  version: number;
  isArchived: boolean;
};

export type EngagementListLoadResult =
  | { ok: true; items: EngagementListItem[] }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "error" };

export type EngagementListLoadReason = Extract<EngagementListLoadResult, { ok: false }>["reason"];
