import { loadPlatformDashboard } from "@/lib/platform-console/data";
import {
  DataTable,
  PlatformPageHeader,
  PlatformSection,
  StatCard,
} from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformDevOpsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const { health } = await loadPlatformDashboard();

  const profiles = [
    { name: t.pages.devops.cloudSaas, detail: t.pages.devops.cloudSaasDesc },
    { name: t.pages.devops.dedicatedCloud, detail: t.pages.devops.dedicatedCloudDesc },
    { name: t.pages.devops.onPremise, detail: t.pages.devops.onPremiseDesc },
  ];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.devops.title}
        description={t.pages.devops.description}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t.pages.devops.environment} value={health.environment} tone="neutral" />
        <StatCard label={t.pages.devops.deployment} value={health.deploymentStatus} tone="neutral" />
        <StatCard label={t.pages.devops.bootstrap} value={health.bootstrapCompleted ? t.pages.devops.complete : t.pages.devops.pending} tone={health.bootstrapCompleted ? "ok" : "warn"} />
      </div>
      <PlatformSection title={t.pages.devops.profilesTitle}>
        <DataTable
          columns={[t.pages.devops.colProfile, t.pages.devops.colDescription]}
          rows={profiles.map((profile) => [
            <span key="n" className="font-medium text-foreground">
              {profile.name}
            </span>,
            <span key="d" className="text-muted-foreground">
              {profile.detail}
            </span>,
          ])}
        />
      </PlatformSection>
    </div>
  );
}
