import type { PlatformDashboardData } from "@/lib/platform-console/data";
import type { PlatformStatusLevel } from "@/lib/platform-bootstrap";
import {
  DataTable,
  PlatformPageHeader,
  PlatformSection,
  StatCard,
  StatusPill,
  type StatusTone,
} from "./platform-primitives";

function statusTone(level: PlatformStatusLevel): StatusTone {
  return level;
}

function statusLabel(level: PlatformStatusLevel): string {
  switch (level) {
    case "ok":
      return "Operational";
    case "warn":
      return "Attention";
    default:
      return "Down";
  }
}

export function PlatformDashboard({ data }: { data: PlatformDashboardData }) {
  const { health, validation } = data;

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Platform Dashboard"
        description="Operational overview of the entire SaaS platform. The Platform Owner controls tenants, licensing, provisioning, and platform health from here."
      />

      <PlatformSection title="Platform Health">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Platform Health"
            value={statusLabel(health.platformHealth)}
            tone={statusTone(health.platformHealth)}
          />
          <StatCard
            label="System Health"
            value={statusLabel(health.systemHealth)}
            tone={statusTone(health.systemHealth)}
            detail={health.bootstrapCompleted ? "Bootstrap complete" : "Bootstrap pending"}
          />
          <StatCard
            label="Database Status"
            value={statusLabel(health.databaseStatus)}
            tone={statusTone(health.databaseStatus)}
          />
          <StatCard
            label="Migration Status"
            value={statusLabel(health.migrationStatus)}
            tone={statusTone(health.migrationStatus)}
          />
          <StatCard label="Deployment" value={health.deploymentStatus} tone="neutral" />
          <StatCard
            label="Bootstrap"
            value={validation.systemReady ? "System Ready" : "Not Ready"}
            tone={validation.systemReady ? "ok" : "warn"}
          />
          <StatCard label="Storage Usage" value={`${health.storage.usedGb} GB`} detail="metering pending" tone="neutral" />
          <StatCard label="Generated" value={new Date(health.generatedAt).toLocaleTimeString()} tone="neutral" />
        </div>
      </PlatformSection>

      <PlatformSection title="Platform Summary">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tenant Summary" value={String(health.summary.tenants)} detail="organizations" />
          <StatCard label="User Summary" value={String(health.summary.users)} detail="memberships" />
          <StatCard label="Subscriptions" value={String(health.summary.subscriptions)} />
          <StatCard label="Invitations" value={String(health.summary.invitations)} />
          <StatCard label="Plan Templates" value={String(health.summary.plans)} />
          <StatCard label="License Templates" value={String(health.summary.licenseTemplates)} />
          <StatCard label="Feature Flags" value={String(health.summary.featureFlags)} />
          <StatCard
            label="License Summary"
            value={`${health.summary.subscriptions}`}
            detail={`${health.summary.plans} plans available`}
          />
        </div>
      </PlatformSection>

      <PlatformSection
        title="Bootstrap Validation"
        description="Every check must pass for the platform to be System Ready."
      >
        <DataTable
          columns={["Check", "Status", "Detail"]}
          rows={validation.checks.map((check) => [
            check.label,
            <StatusPill key="s" label={check.passed ? "PASS" : "FAIL"} tone={check.passed ? "ok" : "down"} />,
            <span key="d" className="text-muted-foreground">
              {check.detail}
            </span>,
          ])}
        />
      </PlatformSection>

      <PlatformSection title="Recent Events">
        <DataTable
          columns={["Event", "Severity", "When"]}
          empty="No security events recorded."
          rows={health.recentEvents.map((event) => [
            event.code,
            <StatusPill
              key="sev"
              label={event.severity}
              tone={event.severity === "critical" ? "down" : event.severity === "warning" ? "warn" : "neutral"}
            />,
            new Date(event.createdAt).toLocaleString(),
          ])}
        />
      </PlatformSection>
    </div>
  );
}
