import {
  loadPlatformSubscriptions,
  loadOrganizationOptions,
  loadPlatformPlans,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { SubscriptionManager } from "@/components/platform-console/managers/subscription-manager";

export const dynamic = "force-dynamic";

export default async function PlatformSubscriptionsPage() {
  const [subscriptions, organizations, plans] = await Promise.all([
    loadPlatformSubscriptions(),
    loadOrganizationOptions(),
    loadPlatformPlans(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Subscriptions"
        description="Create subscriptions, upgrade or downgrade plans and seats, and pause, resume, expire, or cancel."
      />
      <SubscriptionManager subscriptions={subscriptions} organizations={organizations} plans={plans} />
    </div>
  );
}
