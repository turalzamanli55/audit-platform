import { loadPlatformPlans } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformPlansPage() {
  const plans = await loadPlatformPlans();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Plans"
        description="Default subscription plan templates for solo, business, and enterprise tenant models."
      />
      <DataTable
        columns={["Code", "Name", "Model", "Seat Limit", "Default"]}
        empty="No plan templates seeded."
        rows={plans.map((plan) => [
          <span key="c" className="font-medium text-foreground">
            {plan.planCode}
          </span>,
          plan.planName,
          <StatusPill key="t" label={plan.tenantType} tone="neutral" />,
          String(plan.seatLimit),
          plan.isDefault ? "Yes" : "No",
        ])}
      />
    </div>
  );
}
