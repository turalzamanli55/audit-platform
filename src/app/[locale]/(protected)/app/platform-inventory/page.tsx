import { PlatformInventoryDashboard } from "@/components/platform-inventory";
import { loadPlatformInventoryDashboard } from "@/lib/platform-inventory/load-platform-inventory-dashboard";

export default function PlatformInventoryPage() {
  const model = loadPlatformInventoryDashboard();
  return <PlatformInventoryDashboard model={model} />;
}
