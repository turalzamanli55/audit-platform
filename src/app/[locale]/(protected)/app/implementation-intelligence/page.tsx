import { ImplementationIntelligenceDashboard } from "@/components/implementation-intelligence";
import { loadImplementationIntelligenceDashboard } from "@/lib/implementation-intelligence/load-implementation-dashboard";

export default function ImplementationIntelligencePage() {
  const model = loadImplementationIntelligenceDashboard();
  return <ImplementationIntelligenceDashboard model={model} />;
}
