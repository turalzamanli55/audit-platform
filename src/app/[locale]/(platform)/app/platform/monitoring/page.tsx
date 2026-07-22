import Link from "next/link";
import { loadPlatformSecurityEvents } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";
import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";
import { IconChevronRight } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

function severityTone(severity: string): "ok" | "warn" | "down" | "neutral" {
  if (severity === "critical") return "down";
  if (severity === "warning") return "warn";
  return "neutral";
}

export default async function PlatformMonitoringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const events = await loadPlatformSecurityEvents();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.nav.security}
        description={t.pages.monitoring.description}
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href={`/${locale}${PLATFORM_DASHBOARD_PATH}/audit-logs`}
          className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div>
            <p className="text-sm font-medium">{t.ux.viewActivity}</p>
            <p className="text-xs text-muted-foreground">{t.ux.toolActivity}</p>
          </div>
          <IconChevronRight width={16} height={16} className="text-muted-foreground" />
        </Link>
        <Link
          href={`/${locale}${PLATFORM_DASHBOARD_PATH}/login-history`}
          className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div>
            <p className="text-sm font-medium">{t.ux.viewLoginHistory}</p>
            <p className="text-xs text-muted-foreground">{t.ux.toolLoginHistory}</p>
          </div>
          <IconChevronRight width={16} height={16} className="text-muted-foreground" />
        </Link>
      </div>

      <DataTable
        columns={[t.common.event, t.common.severity, t.common.timestamp]}
        empty={t.pages.monitoring.empty}
        rows={events.map((event) => [
          <span key="e" className="font-medium text-foreground">
            {event.eventCode}
          </span>,
          <StatusPill key="s" label={event.severity} tone={severityTone(event.severity)} />,
          new Date(event.createdAt).toLocaleString(),
        ])}
      />
    </div>
  );
}
