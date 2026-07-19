import { loadPlatformDashboard, loadPlatformMetrics } from "@/lib/platform-console/data";
import { PlatformMetricsDashboard } from "@/components/platform-console/platform-metrics-dashboard";

export const dynamic = "force-dynamic";

export default async function PlatformDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [{ validation }, metrics] = await Promise.all([
    loadPlatformDashboard(),
    loadPlatformMetrics(),
  ]);
  return <PlatformMetricsDashboard metrics={metrics} validation={validation} locale={locale} />;
}
