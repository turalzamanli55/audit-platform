import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type Severity = "info" | "warning" | "critical";

/**
 * Records a platform-level audit / security event. Best-effort: a failure to
 * write the audit trail must never break the underlying admin operation.
 */
export async function recordPlatformEvent(
  service: SupabaseClient<Database>,
  input: {
    eventCode: string;
    severity?: Severity;
    actorUserId?: string | null;
    organizationId?: string | null;
    details?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    await service.from("security_event_monitoring_events").insert({
      event_code: input.eventCode,
      severity: input.severity ?? "info",
      actor_user_id: input.actorUserId ?? null,
      organization_id: input.organizationId ?? null,
      details: (input.details ?? {}) as unknown as Database["public"]["Tables"]["security_event_monitoring_events"]["Insert"]["details"],
    });
  } catch {
    // Audit logging is best-effort.
  }
}
