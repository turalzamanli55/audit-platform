import { StatCard, PlatformSection, PlatformPageHeader, StatusPill } from "./platform-primitives";
import type { PlatformMetrics } from "@/lib/platform-console/data";
import type { ValidationReport } from "@/lib/platform-bootstrap";

function numberOrDash(value: number | null): string {
  return value === null ? "—" : value.toLocaleString();
}

export function PlatformMetricsDashboard({
  metrics,
  validation,
}: {
  metrics: PlatformMetrics;
  validation: ValidationReport;
}) {
  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Platform Dashboard"
        description="Real-time business metrics for the entire SaaS platform. Metrics are read directly from the database — no estimates."
      />

      <PlatformSection title="Tenants">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total Tenants" value={metrics.totalTenants.toLocaleString()} />
          <StatCard label="Enterprise" value={metrics.enterpriseTenants.toLocaleString()} tone="ok" />
          <StatCard label="Business" value={metrics.businessTenants.toLocaleString()} tone="ok" />
          <StatCard label="Solo" value={metrics.soloTenants.toLocaleString()} tone="neutral" />
        </div>
      </PlatformSection>

      <PlatformSection title="Accounts & Usage">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Organizations" value={metrics.organizations.toLocaleString()} />
          <StatCard label="Users" value={metrics.users.toLocaleString()} />
          <StatCard label="Licenses (active)" value={metrics.activeLicenses.toLocaleString()} />
          <StatCard
            label="Active Sessions"
            value={numberOrDash(metrics.activeSessions)}
            detail="Not metered yet"
          />
        </div>
      </PlatformSection>

      <PlatformSection title="Commercial & Storage">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Revenue"
            value={metrics.revenue === null ? "—" : `$${metrics.revenue.toLocaleString()}`}
            detail="Billing not integrated"
          />
          <StatCard
            label="Storage"
            value={metrics.storageGb === null ? "—" : `${metrics.storageGb} GB`}
            detail="Not metered yet"
          />
          <StatCard label="Audit Events" value={metrics.auditEvents.toLocaleString()} />
          <StatCard label="Deployments" value={metrics.deployments} />
        </div>
      </PlatformSection>

      <PlatformSection title="Platform Health">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Database Health"
            value={metrics.databaseHealthy ? "Healthy" : "Down"}
            tone={metrics.databaseHealthy ? "ok" : "down"}
          />
          <StatCard
            label="Queue Health"
            value={metrics.queueHealthy === null ? "—" : metrics.queueHealthy ? "Healthy" : "Down"}
            detail="No queue configured"
          />
          <StatCard
            label="Background Jobs"
            value={numberOrDash(metrics.backgroundJobs)}
            detail="No job runner configured"
          />
          <StatCard label="Platform Version" value={`v${metrics.platformVersion}`} detail={metrics.environment} />
        </div>
      </PlatformSection>

      <PlatformSection title="Bootstrap Validation">
        <div className="space-y-2 rounded-xl border border-border/60 p-4">
          {validation.checks.map((check) => (
            <div key={check.key} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{check.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{check.detail}</span>
                <StatusPill label={check.passed ? "PASS" : "FAIL"} tone={check.passed ? "ok" : "down"} />
              </div>
            </div>
          ))}
        </div>
      </PlatformSection>
    </div>
  );
}
