import { PlatformReadinessDashboard } from "@/components/capability-registry";
import { loadPlatformReadinessDashboard } from "@/lib/capability-registry/load-platform-readiness-dashboard";

export default function PlatformReadinessPage() {
  const model = loadPlatformReadinessDashboard();
  return <PlatformReadinessDashboard model={model} />;
}
