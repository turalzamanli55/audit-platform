import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { PlatformDashboard } from "@/components/platform-console/platform-dashboard";

export const dynamic = "force-dynamic";

export default async function PlatformDashboardPage() {
  const data = await loadPlatformDashboard();
  return <PlatformDashboard data={data} />;
}
