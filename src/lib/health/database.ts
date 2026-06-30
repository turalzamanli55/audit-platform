import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/types/supabase";
import type { HealthCheckResult } from "./types";

const FOUNDATION_TABLES = [
  "organizations",
  "workspaces",
  "companies",
  "memberships",
  "roles",
  "permissions",
  "role_permissions",
  "organization_settings",
  "workspace_settings",
  "company_settings",
  "audit_logs",
] as const satisfies ReadonlyArray<keyof Database["public"]["Tables"]>;

const EXPECTED_PLATFORM_ROLE_COUNT = 7;
const EXPECTED_PERMISSION_COUNT = 17;

export async function checkDatabaseConnection(): Promise<HealthCheckResult> {
  const checkedAt = new Date().toISOString();
  const start = Date.now();

  try {
    const client = createServiceClient();
    const { error } = await client.from("organizations").select("id", { head: true, count: "exact" });
    const latencyMs = Date.now() - start;

    if (error) {
      return {
        name: "database_connection",
        status: "unhealthy",
        latencyMs,
        message: error.message,
        checkedAt,
      };
    }

    return {
      name: "database_connection",
      status: "healthy",
      latencyMs,
      checkedAt,
    };
  } catch (error) {
    return {
      name: "database_connection",
      status: "unhealthy",
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : "Database connection failed",
      checkedAt,
    };
  }
}

export async function checkMigrationHealth(): Promise<HealthCheckResult> {
  const checkedAt = new Date().toISOString();
  const start = Date.now();

  try {
    const client = createServiceClient();
    const failures: string[] = [];

    for (const table of FOUNDATION_TABLES) {
      const { error } = await client.from(table).select("id", { head: true, count: "exact" });
      if (error) {
        failures.push(`${table}: ${error.message}`);
      }
    }

    const { count: roleCount, error: roleError } = await client
      .from("roles")
      .select("id", { count: "exact", head: true })
      .eq("scope", "platform")
      .is("organization_id", null)
      .is("deleted_at", null);

    if (roleError) {
      failures.push(`roles seed: ${roleError.message}`);
    } else if ((roleCount ?? 0) < EXPECTED_PLATFORM_ROLE_COUNT) {
      failures.push(`roles seed: expected ${EXPECTED_PLATFORM_ROLE_COUNT}, found ${roleCount ?? 0}`);
    }

    const { count: permissionCount, error: permissionError } = await client
      .from("permissions")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null);

    if (permissionError) {
      failures.push(`permissions seed: ${permissionError.message}`);
    } else if ((permissionCount ?? 0) < EXPECTED_PERMISSION_COUNT) {
      failures.push(`permissions seed: expected ${EXPECTED_PERMISSION_COUNT}, found ${permissionCount ?? 0}`);
    }

    const latencyMs = Date.now() - start;

    if (failures.length > 0) {
      return {
        name: "database_migrations",
        status: failures.some((message) => message.includes("does not exist")) ? "unhealthy" : "degraded",
        latencyMs,
        message: failures.join("; "),
        checkedAt,
      };
    }

    return {
      name: "database_migrations",
      status: "healthy",
      latencyMs,
      message: `${FOUNDATION_TABLES.length} foundation tables verified`,
      checkedAt,
    };
  } catch (error) {
    return {
      name: "database_migrations",
      status: "unhealthy",
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : "Migration health check failed",
      checkedAt,
    };
  }
}
