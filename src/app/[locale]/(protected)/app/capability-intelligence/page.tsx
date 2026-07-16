import { CapabilityIntelligenceDashboard } from "@/components/capability-intelligence";
import { loadCapabilityIntelligenceDashboard } from "@/lib/capability-intelligence/load-capability-intelligence-dashboard";

export default function CapabilityIntelligencePage() {
  const model = loadCapabilityIntelligenceDashboard();
  return <CapabilityIntelligenceDashboard model={model} />;
}
