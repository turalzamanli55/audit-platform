"use client";

import { useState } from "react";
import Link from "next/link";
import { StatCard, PlatformSection, PlatformPageHeader, StatusPill } from "./platform-primitives";
import type { PlatformMetrics } from "@/lib/platform-console/data";
import type { ValidationReport } from "@/lib/platform-bootstrap";
import { getPlatformLabels, fillPlatform } from "@/i18n/platform-labels";
import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";
import { cn } from "@/lib/ui/cn";

const linkBtn =
  "inline-flex h-11 min-h-11 items-center justify-center rounded-lg border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PlatformMetricsDashboard({
  metrics,
  validation,
  locale,
}: {
  metrics: PlatformMetrics;
  validation: ValidationReport;
  locale: string;
}) {
  const t = getPlatformLabels(locale);
  const d = t.dashboard;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeCompanies =
    metrics.enterpriseTenants + metrics.businessTenants + metrics.soloTenants;

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.dashboard.title}
        description={t.pages.dashboard.description}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={d.totalCompanies} value={metrics.totalTenants.toLocaleString()} />
        <StatCard label={t.ux.activeCompanies} value={activeCompanies.toLocaleString()} tone="ok" />
        <StatCard
          label={d.seatsUsed}
          value={metrics.seatsUsed.toLocaleString()}
          detail={fillPlatform(d.ofPurchased, { count: metrics.seatsPurchased.toLocaleString() })}
        />
        <StatCard
          label={d.seatsAvailable}
          value={metrics.seatsAvailable.toLocaleString()}
          tone={metrics.seatsAvailable === 0 ? "warn" : "ok"}
        />
        <StatCard
          label={d.expiring30}
          value={metrics.expiringLicenses.toLocaleString()}
          tone={metrics.expiringLicenses > 0 ? "warn" : "neutral"}
        />
        <StatCard label={d.sessions24h} value={metrics.recentLogins.toLocaleString()} detail={d.loginEvents} />
        <StatCard
          label={d.securityEvents}
          value={metrics.securityEvents.toLocaleString()}
          detail={fillPlatform(d.criticalDetail, { count: metrics.criticalEvents.toLocaleString() })}
          tone={metrics.criticalEvents > 0 ? "warn" : "neutral"}
        />
        <StatCard
          label={d.databaseHealth}
          value={metrics.databaseHealthy ? d.healthy : d.down}
          tone={metrics.databaseHealthy ? "ok" : "down"}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/${locale}${PLATFORM_DASHBOARD_PATH}/tenants`} className={linkBtn}>
          {t.nav.companies}
        </Link>
        <Link href={`/${locale}${PLATFORM_DASHBOARD_PATH}/monitoring`} className={linkBtn}>
          {t.nav.security}
        </Link>
        <Link href={`/${locale}${PLATFORM_DASHBOARD_PATH}/audit-logs`} className={linkBtn}>
          {t.ux.viewActivity}
        </Link>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(linkBtn, "border-transparent hover:border-border")}
        >
          {showAdvanced ? t.ux.hideAdvanced : t.ux.showAdvanced}
        </button>
      </div>

      {showAdvanced ? (
        <div className="space-y-8">
          <PlatformSection title={d.sections.tenants}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label={d.enterprise} value={metrics.enterpriseTenants.toLocaleString()} tone="ok" />
              <StatCard label={d.business} value={metrics.businessTenants.toLocaleString()} tone="ok" />
              <StatCard label={d.solo} value={metrics.soloTenants.toLocaleString()} tone="neutral" />
              <StatCard label={d.users} value={metrics.users.toLocaleString()} />
            </div>
          </PlatformSection>

          <PlatformSection title={d.sections.licenses}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label={d.activeLicenses} value={metrics.activeLicenses.toLocaleString()} tone="ok" />
              <StatCard
                label={d.expiredLicenses}
                value={metrics.expiredLicenses.toLocaleString()}
                tone={metrics.expiredLicenses > 0 ? "down" : "neutral"}
              />
              <StatCard label={d.storageBuckets} value={metrics.storageBuckets.toLocaleString()} />
              <StatCard label={d.auditEvents} value={metrics.auditEvents.toLocaleString()} />
            </div>
          </PlatformSection>

          <PlatformSection title={d.sections.bootstrapValidation}>
            <div className="space-y-2 rounded-xl border border-border/60 p-4">
              {validation.checks.map((check) => (
                <div key={check.key} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{check.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{check.detail}</span>
                    <StatusPill
                      label={check.passed ? t.common.pass : t.common.fail}
                      tone={check.passed ? "ok" : "down"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PlatformSection>

          <p className="text-xs text-muted-foreground">
            {d.platformVersion} v{metrics.platformVersion} · {metrics.environment}
          </p>
        </div>
      ) : null}
    </div>
  );
}
