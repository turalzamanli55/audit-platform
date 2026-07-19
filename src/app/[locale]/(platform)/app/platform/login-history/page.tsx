import { loadPlatformLoginHistory } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

function resultTone(result: string): "ok" | "warn" | "down" | "neutral" {
  if (result === "Success") return "ok";
  if (result === "Sign-out") return "neutral";
  if (result === "Registered") return "warn";
  return "down";
}

export default async function PlatformLoginHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const events = await loadPlatformLoginHistory();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.loginHistory.title}
        description={t.pages.loginHistory.description}
      />
      <DataTable
        columns={[t.common.date, t.common.user, t.common.ip, t.common.device, t.common.browser, t.common.result]}
        empty={t.pages.loginHistory.empty}
        rows={events.map((event) => [
          new Date(event.createdAt).toLocaleString(),
          <span key="u" className="font-medium text-foreground">
            {event.email}
          </span>,
          <span key="ip" className="text-muted-foreground">
            {event.ip}
          </span>,
          event.device,
          event.browser,
          <StatusPill key="r" label={event.result} tone={resultTone(event.result)} />,
        ])}
      />
    </div>
  );
}
