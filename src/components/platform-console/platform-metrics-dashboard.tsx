import { StatCard, PlatformSection, PlatformPageHeader, StatusPill } from "./platform-primitives";
import type { PlatformMetrics } from "@/lib/platform-console/data";
import type { ValidationReport } from "@/lib/platform-bootstrap";

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
        description="Live business metrics for the entire SaaS platform. Every value is read directly from the database."
      />

      <PlatformSection title="Tenants">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total Companies" value={metrics.totalTenants.toLocaleString()} />
          <StatCard label="Enterprise" value={metrics.enterpriseTenants.toLocaleString()} tone="ok" />
          <StatCard label="Business" value={metrics.businessTenants.toLocaleString()} tone="ok" />
          <StatCard label="Solo" value={metrics.soloTenants.toLocaleString()} tone="neutral" />
        </div>
      </PlatformSection>

      <PlatformSection title="Accounts & Seats">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Users" value={metrics.users.toLocaleString()} />
          <StatCard label="Seats Used" value={metrics.seatsUsed.toLocaleString()} detail={`of ${metrics.seatsPurchased.toLocaleString()} purchased`} />
          <StatCard
            label="Seats Available"
            value={metrics.seatsAvailable.toLocaleString()}
            tone={metrics.seatsAvailable === 0 ? "warn" : "ok"}
          />
          <StatCard label="Sessions (24h)" value={metrics.recentLogins.toLocaleString()} detail="Login events" />
        </div>
      </PlatformSection>

      <PlatformSection title="Licenses">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Active Licenses" value={metrics.activeLicenses.toLocaleString()} tone="ok" />
          <StatCard
            label="Expiring (30 days)"
            value={metrics.expiringLicenses.toLocaleString()}
            tone={metrics.expiringLicenses > 0 ? "warn" : "neutral"}
          />
          <StatCard
            label="Expired Licenses"
            value={metrics.expiredLicenses.toLocaleString()}
            tone={metrics.expiredLicenses > 0 ? "down" : "neutral"}
          />
          <StatCard label="Storage Buckets" value={metrics.storageBuckets.toLocaleString()} />
        </div>
      </PlatformSection>

      <PlatformSection title="Security & Health">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Audit Events" value={metrics.auditEvents.toLocaleString()} />
          <StatCard
            label="Security Events"
            value={metrics.securityEvents.toLocaleString()}
            detail={`${metrics.criticalEvents.toLocaleString()} critical`}
            tone={metrics.criticalEvents > 0 ? "warn" : "neutral"}
          />
          <StatCard
            label="Database Health"
            value={metrics.databaseHealthy ? "Healthy" : "Down"}
            tone={metrics.databaseHealthy ? "ok" : "down"}
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
