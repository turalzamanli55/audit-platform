import { loadPlatformPlans } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformPlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const plans = await loadPlatformPlans();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.plans.title}
        description={t.pages.plans.description}
      />
      <DataTable
        columns={[t.pages.plans.colCode, t.pages.plans.colName, t.pages.plans.colModel, t.pages.plans.colSeatLimit, t.pages.plans.colDefault]}
        empty={t.pages.plans.empty}
        rows={plans.map((plan) => [
          <span key="c" className="font-medium text-foreground">
            {plan.planCode}
          </span>,
          plan.planName,
          <StatusPill key="t" label={plan.tenantType} tone="neutral" />,
          String(plan.seatLimit),
          plan.isDefault ? t.common.yes : t.common.no,
        ])}
      />
    </div>
  );
}
