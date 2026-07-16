import { PlatformAuditDashboard } from "@/components/platform-audit";
import { loadPlatformAuditDashboard } from "@/lib/platform-audit/load-platform-audit-dashboard";

export default function PlatformAuditPage() {
  const model = loadPlatformAuditDashboard();
  return <PlatformAuditDashboard model={model} />;
}
