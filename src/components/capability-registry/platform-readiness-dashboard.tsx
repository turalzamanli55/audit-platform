import type { PlatformGovernanceDashboardModel } from "@/lib/project-sync/dashboard";

function pct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function Card(props: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{props.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{props.value}</p>
      {props.detail ? <p className="mt-1 text-xs text-muted-foreground">{props.detail}</p> : null}
    </div>
  );
}

export function PlatformReadinessDashboard(props: {
  model: PlatformGovernanceDashboardModel;
}) {
  const { model } = props;
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Project Bible Synchronization
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Platform Readiness</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Synchronized from PROJECT_BIBLE (primary source of truth). Registries are downstream only.
          Completion is derived exclusively from discovered evidence.
        </p>
        <p className="text-xs text-muted-foreground">
          Calculated at {new Date(model.calculatedAt).toLocaleString()} · authority {model.authority} ·
          source {model.source}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Platform readiness" value={pct(model.platformReadiness)} />
        <Card label="Architecture readiness" value={pct(model.architectureReadiness)} />
        <Card label="Implementation readiness" value={pct(model.implementationReadiness)} />
        <Card label="Technical debt" value={pct(model.technicalDebt)} />
        <Card label="Documentation coverage" value={pct(model.documentationCoverage)} />
        <Card label="Testing coverage" value={pct(model.testingCoverage)} />
        <Card label="Localization coverage" value={pct(model.localizationCoverage)} />
        <Card label="Security coverage" value={pct(model.securityCoverage)} />
        <Card label="Performance coverage" value={pct(model.performanceCoverage)} />
        <Card label="Integration coverage" value={pct(model.integrationCoverage)} />
        <Card
          label="Domains / Modules"
          value={`${model.counts.domains}/${model.counts.modules}`}
        />
        <Card
          label="Features / Capabilities"
          value={`${model.counts.features}/${model.counts.capabilities}`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Domains</h2>
        <div className="overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2 text-right">Completion</th>
                <th className="px-4 py-2 text-right">Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {model.domains.map((domain) => (
                <tr key={domain.id}>
                  <td className="px-4 py-2 font-medium">{domain.name}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{pct(domain.completionPct)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{domain.capabilityCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Missing capabilities / evidence</h2>
          <ul className="max-h-96 divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
            {model.missingCapabilities.slice(0, 40).map((entry) => (
              <li key={entry.id} className="px-4 py-2.5 text-sm">
                <p className="font-medium">{entry.name}</p>
                <p className="text-muted-foreground">
                  {entry.moduleId} · {pct(entry.completionPct)} · missing{" "}
                  {entry.missingEvidence.slice(0, 6).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Roadmap progress</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(model.roadmapProgress).map(([lane, count]) => (
              <div key={lane} className="rounded-xl border border-border/50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{lane}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{count}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/50 px-4 py-3 text-sm">
            <p className="font-medium">Critical path</p>
            <p className="mt-1 text-muted-foreground">
              {model.criticalPath.slice(0, 8).join(" · ") || "—"}
            </p>
            <p className="mt-3 font-medium">Next sprint</p>
            <p className="mt-1 text-muted-foreground">
              {model.nextSprint.slice(0, 8).join(" · ") || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 px-4 py-3 text-sm">
            <p className="font-medium">Last sync diff</p>
            <p className="mt-1 text-muted-foreground">
              +{model.diffCounts.added} / -{model.diffCounts.removed} / ~{model.diffCounts.modified} /
              renamed {model.diffCounts.renamed}
            </p>
          </div>
        </div>
      </section>

      {!model.validation.ok ? (
        <section className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
          <p className="font-medium">Synchronization validation errors</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            {model.validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
