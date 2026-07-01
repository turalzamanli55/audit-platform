import type { Enums } from "@/types/supabase";
import type { ENGAGEMENT_REPORTING_FRAMEWORKS } from "@/constants/engagement";

export type EngagementType = Enums<"engagement_type">;
export type EngagementLifecycleStatus = Enums<"engagement_lifecycle_status">;
export type EngagementMemberRole = Enums<"engagement_member_role">;
export type EngagementReportingFramework = (typeof ENGAGEMENT_REPORTING_FRAMEWORKS)[number];
