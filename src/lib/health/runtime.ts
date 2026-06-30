import { getRuntimeEnv } from "@/lib/env";
import type { HealthCheckResult } from "./types";

export function checkRuntime(): HealthCheckResult {
  const checkedAt = new Date().toISOString();
  const runtime = getRuntimeEnv();

  return {
    name: "runtime",
    status: "healthy",
    message: `node=${runtime.NODE_ENV}${runtime.VERCEL_ENV ? `;vercel=${runtime.VERCEL_ENV}` : ""}`,
    checkedAt,
  };
}
