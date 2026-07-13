import type { PlatformReadinessDashboardModel } from "@/lib/capability-registry/load-platform-readiness-dashboard";

function pct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function ReadinessCard(props: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{props.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{props.value}</p>
      {props.detail ? <p className="mt-1 text-xs text-muted-foreground">{props.detail}</p> : null}
    </div>
  );
}

export function PlatformReadinessDashboard(props: { model: PlatformReadinessDashboardModel }) {
  const { model } = props;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Capability Registry
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Platform Readiness</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Completion is calculated from capability evidence and rolled up through features, modules,
          and domains. No hardcoded platform percentages.
        </p>
        <p className="text-xs text-muted-foreground">
          Calculated at {new Date(model.calculatedAt).toLocaleString()} · source capability-registry
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <ReadinessCard label="Platform readiness" value={pct(model.platformCompletionPct)} />
        <ReadinessCard
          label="Domain readiness"
          value={String(model.domains.length)}
          detail={`avg ${pct(
            model.domains.reduce((sum, domain) => sum + domain.completionPct, 0) /
              Math.max(model.domains.length, 1),
          )}`}
        />
        <ReadinessCard
          label="Module readiness"
          value={String(model.modules.length)}
          detail={`${model.modules.filter((module) => module.completionPct >= 80).length} ≥ enterprise`}
        />
        <ReadinessCard
          label="Feature readiness"
          value={String(model.features.length)}
          detail={`${model.features.filter((feature) => feature.completedCapabilities === feature.capabilityCount).length} complete`}
        />
        <ReadinessCard
          label="Capability readiness"
          value={String(model.capabilities.length)}
          detail={`${model.capabilities.filter((capability) => capability.completed).length} completed`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Domains</h2>
        <div className="overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Completion</th>
                <th className="px-4 py-2 text-right">Modules</th>
                <th className="px-4 py-2 text-right">Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {model.domains.map((domain) => (
                <tr key={domain.id}>
                  <td className="px-4 py-2 font-medium">{domain.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{domain.status}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{pct(domain.completionPct)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{domain.moduleCount}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{domain.capabilityCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Modules</h2>
          <ul className="max-h-96 divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
            {model.modules.map((module) => (
              <li key={module.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{module.name}</p>
                  <p className="text-muted-foreground">
                    {module.domainId} · {module.status}
                  </p>
                </div>
                <span className="tabular-nums text-muted-foreground">{pct(module.completionPct)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="max-h-96 divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
            {model.features.map((feature) => (
              <li key={feature.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-muted-foreground">
                    {feature.moduleId} · {feature.capabilityCount} capabilities
                  </p>
                </div>
                <span className="tabular-nums text-muted-foreground">{pct(feature.completionPct)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Evidence coverage</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {model.evidence.map((entry) => (
            <div
              key={entry.dimension}
              className="rounded-lg border border-border/40 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{entry.dimension}</span>
                <span className="tabular-nums text-muted-foreground">{pct(entry.coveragePct)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {entry.satisfiedCapabilities}/{entry.totalCapabilities} capabilities
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Missing evidence</h2>
          <ul className="max-h-80 divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
            {model.missingCapabilities.slice(0, 40).map((entry) => (
              <li key={entry.id} className="px-4 py-2.5 text-sm">
                <p className="font-medium">{entry.name}</p>
                <p className="text-muted-foreground">
                  {entry.module} · {pct(entry.completionPct)} · missing{" "}
                  {entry.missingEvidence.join(", ")}
                </p>
              </li>
            ))}
            {model.missingCapabilities.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">No missing evidence.</li>
            ) : null}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Roadmap lanes</h2>
          <div className="space-y-3">
            {(
              [
                ["completed", model.roadmapLanes.completed],
                ["in_progress", model.roadmapLanes.in_progress],
                ["blocked", model.roadmapLanes.blocked],
                ["planned", model.roadmapLanes.planned],
                ["future", model.roadmapLanes.future],
              ] as const
            ).map(([lane, entries]) => (
              <div key={lane} className="rounded-xl border border-border/50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {lane.replaceAll("_", " ")} · {entries.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entries.slice(0, 3).map((entry) => entry.name).join(" · ") || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!model.validation.ok ? (
        <section className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
          <p className="font-medium">Registry validation errors</p>
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
