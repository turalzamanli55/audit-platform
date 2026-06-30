export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type HealthCheckResult = {
  name: string;
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
  checkedAt: string;
};

export type HealthReport = {
  status: HealthStatus;
  checks: HealthCheckResult[];
  checkedAt: string;
};

function aggregateStatus(checks: HealthCheckResult[]): HealthStatus {
  if (checks.some((check) => check.status === "unhealthy")) return "unhealthy";
  if (checks.some((check) => check.status === "degraded")) return "degraded";
  return "healthy";
}

export function createHealthReport(checks: HealthCheckResult[]): HealthReport {
  return {
    status: aggregateStatus(checks),
    checks,
    checkedAt: new Date().toISOString(),
  };
}
