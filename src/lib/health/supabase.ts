import "server-only";

import { createAnonymousClient } from "@/lib/supabase/anonymous";
import type { HealthCheckResult } from "./types";

export async function checkSupabaseConnectivity(): Promise<HealthCheckResult> {
  const checkedAt = new Date().toISOString();
  const start = Date.now();

  try {
    const client = createAnonymousClient();
    const { error } = await client.auth.getSession();
    const latencyMs = Date.now() - start;

    if (error) {
      return {
        name: "supabase",
        status: "degraded",
        latencyMs,
        message: error.message,
        checkedAt,
      };
    }

    return {
      name: "supabase",
      status: "healthy",
      latencyMs,
      checkedAt,
    };
  } catch (error) {
    return {
      name: "supabase",
      status: "unhealthy",
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : "Supabase connectivity failed",
      checkedAt,
    };
  }
}
