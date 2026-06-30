import "server-only";

import { checkEnvironment } from "./environment";
import { checkRuntime } from "./runtime";
import { checkSupabaseConnectivity } from "./supabase";
import { checkDatabaseConnection, checkMigrationHealth } from "./database";
import { createHealthReport, type HealthReport } from "./types";

export async function getInfrastructureHealth(): Promise<HealthReport> {
  const [environment, runtime, supabase, databaseConnection, databaseMigrations] = await Promise.all([
    Promise.resolve(checkEnvironment()),
    Promise.resolve(checkRuntime()),
    checkSupabaseConnectivity(),
    checkDatabaseConnection(),
    checkMigrationHealth(),
  ]);

  return createHealthReport([environment, runtime, supabase, databaseConnection, databaseMigrations]);
}

export { checkEnvironment } from "./environment";
export { checkRuntime } from "./runtime";
export { checkSupabaseConnectivity } from "./supabase";
export { checkDatabaseConnection, checkMigrationHealth } from "./database";
export type { HealthReport, HealthCheckResult, HealthStatus } from "./types";
export { createHealthReport } from "./types";
