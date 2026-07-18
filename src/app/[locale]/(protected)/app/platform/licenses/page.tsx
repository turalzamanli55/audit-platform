import { loadPlatformLicenses } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformLicensesPage() {
  const licenses = await loadPlatformLicenses();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Licenses"
        description="Reusable license templates the Platform Owner assigns when provisioning tenants."
      />
      <DataTable
        columns={["Code", "Name", "Duration", "Type", "Default Plan"]}
        empty="No license templates seeded."
        rows={licenses.map((license) => [
          <span key="c" className="font-medium text-foreground">
            {license.licenseCode}
          </span>,
          license.licenseName,
          license.durationDays === null ? "Perpetual" : `${license.durationDays} days`,
          <StatusPill key="t" label={license.isTrial ? "Trial" : "Paid"} tone={license.isTrial ? "warn" : "ok"} />,
          license.defaultPlanCode ?? "—",
        ])}
      />
    </div>
  );
}
