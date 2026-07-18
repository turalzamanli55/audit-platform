import { DEFAULT_PLAN_TEMPLATES } from "@/lib/platform-bootstrap";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

function collectModules(): { code: string; plans: string[] }[] {
  const map = new Map<string, string[]>();
  for (const plan of DEFAULT_PLAN_TEMPLATES) {
    for (const [code, enabled] of Object.entries(plan.moduleEntitlements)) {
      if (!enabled) continue;
      const list = map.get(code) ?? [];
      list.push(plan.planCode);
      map.set(code, list);
    }
  }
  return Array.from(map.entries())
    .map(([code, plans]) => ({ code, plans }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export default function PlatformModulesPage() {
  const modules = collectModules();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Modules"
        description="Module licensing catalog. Each module can be independently enabled per plan and per tenant."
      />
      <DataTable
        columns={["Module", "Available In Plans"]}
        rows={modules.map((module) => [
          <span key="m" className="font-medium text-foreground">
            {module.code}
          </span>,
          <span key="p" className="flex flex-wrap gap-1">
            {module.plans.map((plan) => (
              <StatusPill key={plan} label={plan} tone="neutral" />
            ))}
          </span>,
        ])}
      />
    </div>
  );
}
