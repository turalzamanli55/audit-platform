import { loadPlatformPlans } from "@/lib/platform-console/data";
import {
  DataTable,
  FoundationNotice,
  PlatformPageHeader,
  PlatformSection,
  StatCard,
} from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformStoragePage() {
  const plans = await loadPlatformPlans();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Storage"
        description="Platform-wide storage usage and per-plan storage limits."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Used Storage" value="0 GB" detail="metering pending" />
        <StatCard label="Plan Tiers" value={String(plans.length)} />
        <StatCard label="Status" value="Foundation" tone="warn" />
      </div>
      <FoundationNotice>
        Storage metering is a foundation — per-tenant usage collection is not yet enabled. Plan
        limits below are enforced at provisioning time.
      </FoundationNotice>
      <PlatformSection title="Per-Plan Storage Limits">
        <DataTable
          columns={["Plan", "Model", "Seat Limit"]}
          rows={plans.map((plan) => [plan.planCode, plan.tenantType, String(plan.seatLimit)])}
        />
      </PlatformSection>
    </div>
  );
}
