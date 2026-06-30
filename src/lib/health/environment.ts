import { getPublicEnv, getServerEnv, getRuntimeEnv } from "@/lib/env";
import type { HealthCheckResult } from "./types";

export function checkEnvironment(): HealthCheckResult {
  const checkedAt = new Date().toISOString();

  try {
    getPublicEnv();
    getServerEnv();
    const runtime = getRuntimeEnv();

    return {
      name: "environment",
      status: "healthy",
      message: `runtime=${runtime.NODE_ENV}`,
      checkedAt,
    };
  } catch (error) {
    return {
      name: "environment",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Environment validation failed",
      checkedAt,
    };
  }
}
