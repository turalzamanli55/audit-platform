import { DevOpsDashboard } from "@/components/devops";
import { loadDevOpsDashboard } from "@/lib/devops/load-devops-dashboard";

export default function DevOpsPage() {
  const model = loadDevOpsDashboard();
  return <DevOpsDashboard model={model} />;
}
