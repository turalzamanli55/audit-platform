import { loadPlatformFeatureFlags } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function flagTone(state: string): "ok" | "warn" | "down" | "neutral" {
  if (state === "enabled") return "ok";
  if (state === "preview" || state === "experimental") return "warn";
  if (state === "deprecated") return "down";
  return "neutral";
}

export default async function PlatformFeatureFlagsPage() {
  const flags = await loadPlatformFeatureFlags();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Feature Flags"
        description="Platform, tenant, workspace, and user scoped feature flags with lifecycle states."
      />
      <DataTable
        columns={["Flag", "Scope", "State"]}
        empty="No feature flags configured."
        rows={flags.map((flag) => [
          <span key="f" className="font-medium text-foreground">
            {flag.flagCode}
          </span>,
          <StatusPill key="sc" label={flag.scope} tone="neutral" />,
          <StatusPill key="st" label={flag.flagState} tone={flagTone(flag.flagState)} />,
        ])}
      />
    </div>
  );
}
