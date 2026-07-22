import Link from "next/link";
import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { getPlatformOwnerIdentity } from "@/lib/auth/server";
import { PLATFORM_OWNER_EMAIL } from "@/lib/platform-bootstrap";
import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";
import { PLATFORM_SETTINGS_TOOLS } from "@/config/platform-navigation";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";
import { IconChevronRight } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const TOOL_BLURB: Record<string, "toolPlans" | "toolModules" | "toolFeatureFlags" | "toolOrganizations" | "toolSubscriptions" | "toolLicenses" | "toolActivity" | "toolLoginHistory" | "toolDatabase" | "toolDevops"> = {
  plans: "toolPlans",
  modules: "toolModules",
  featureFlags: "toolFeatureFlags",
  organizations: "toolOrganizations",
  subscriptions: "toolSubscriptions",
  licenses: "toolLicenses",
  activity: "toolActivity",
  loginHistory: "toolLoginHistory",
  database: "toolDatabase",
  devops: "toolDevops",
};

export default async function PlatformSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [{ health, validation }, owner] = await Promise.all([
    loadPlatformDashboard(),
    getPlatformOwnerIdentity(),
  ]);

  const rows: [string, string][] = [
    [t.pages.settings.owner, owner?.email ?? PLATFORM_OWNER_EMAIL],
    [t.pages.settings.environment, health.environment],
    [t.pages.settings.deployment, health.deploymentStatus],
    [t.pages.settings.bootstrapCompleted, health.bootstrapCompleted ? t.common.yes : t.common.no],
    [t.pages.settings.systemReady, validation.systemReady ? t.common.yes : t.common.no],
  ];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.ux.settingsHubTitle}
        description={t.ux.settingsHubDescription}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{t.ux.platformStatus}</h2>
          <StatusPill
            label={validation.systemReady ? t.common.systemReady : t.common.notReady}
            tone={validation.systemReady ? "ok" : "warn"}
          />
        </div>
        <DataTable
          columns={[t.common.setting, t.common.value]}
          rows={rows.map(([key, value]) => [
            <span key="k" className="font-medium text-foreground">
              {key}
            </span>,
            value,
          ])}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{t.ux.advancedTools}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {PLATFORM_SETTINGS_TOOLS.map((tool) => {
            const blurbKey = TOOL_BLURB[tool.key];
            const blurb = blurbKey ? t.ux[blurbKey] : "";
            return (
              <Link
                key={tool.href}
                href={`/${locale}${tool.href}`}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors hover:border-border hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.nav[tool.key] ?? tool.label}</p>
                  {typeof blurb === "string" && blurb ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{blurb}</p>
                  ) : null}
                </div>
                <IconChevronRight
                  width={16}
                  height={16}
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          <Link href={`/${locale}${PLATFORM_DASHBOARD_PATH}/search`} className="underline-offset-2 hover:underline">
            {t.ux.search}
          </Link>
        </p>
      </section>
    </div>
  );
}
