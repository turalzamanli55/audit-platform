import { loadPlatformSubscriptions } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function statusTone(status: string): "ok" | "warn" | "down" | "neutral" {
  if (status === "active") return "ok";
  if (status === "trial") return "warn";
  if (status === "expired" || status === "suspended" || status === "cancelled") return "down";
  return "neutral";
}

export default async function PlatformSubscriptionsPage() {
  const subscriptions = await loadPlatformSubscriptions();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Subscriptions"
        description="Tenant subscription instances with seat usage and lifecycle status."
      />
      <DataTable
        columns={["Plan", "Model", "Status", "Seats"]}
        empty="No tenant subscriptions yet."
        rows={subscriptions.map((sub) => [
          <span key="p" className="font-medium text-foreground">
            {sub.planCode}
          </span>,
          sub.tenantType,
          <StatusPill key="s" label={sub.subscriptionStatus} tone={statusTone(sub.subscriptionStatus)} />,
          `${sub.seatsUsed} / ${sub.seatLimit}`,
        ])}
      />
    </div>
  );
}
