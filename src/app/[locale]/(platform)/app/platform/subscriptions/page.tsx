import {
  loadPlatformSubscriptions,
  loadOrganizationOptions,
  loadPlatformPlans,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { SubscriptionManager } from "@/components/platform-console/managers/subscription-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformSubscriptionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [subscriptions, organizations, plans] = await Promise.all([
    loadPlatformSubscriptions(),
    loadOrganizationOptions(),
    loadPlatformPlans(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.subscriptions.title}
        description={t.pages.subscriptions.description}
      />
      <SubscriptionManager subscriptions={subscriptions} organizations={organizations} plans={plans} />
    </div>
  );
}
