import type { DevOpsUiDashboardModel } from "@/lib/devops/load-devops-dashboard";

function pct(value: number): string {
  return `${Number(value).toFixed(2)}%`;
}

function statusLabel(ok: boolean | null | undefined, deferredLabel = "deferred"): string {
  if (ok === null || ok === undefined) return deferredLabel;
  return ok ? "PASS" : "FAIL";
}

function Card(props: {
  label: string;
  value: string;
  detail?: string;
  tone?: "ok" | "bad" | "neutral";
}) {
  const tone =
    props.tone === "ok"
      ? "border-emerald-500/30"
      : props.tone === "bad"
        ? "border-destructive/40"
        : "border-border/50";
  return (
    <div className={`rounded-xl border bg-card px-4 py-3 ${tone}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{props.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{props.value}</p>
      {props.detail ? (
        <p className="mt-1 text-xs text-muted-foreground">{props.detail}</p>
      ) : null}
    </div>
  );
}

export function DevOpsDashboard(props: { model: DevOpsUiDashboardModel }) {
  const { model } = props;
  const { dashboard, monitoring } = model;
  const health = dashboard.health;
  const stage = (id: string) => dashboard.pipeline.stages.find((s) => s.id === id);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise DevOps & Release Platform
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">DevOps Dashboard</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Operational release governance orchestrating Database Governance, SQL Foundation, EPBSE,
          Capability Registry, and Platform Registry. Completion is synchronized from PROJECT_BIBLE.
        </p>
        <p className="text-xs text-muted-foreground">
          Source {model.source} · calculated {new Date(model.generatedAt).toLocaleString()} · release{" "}
          {dashboard.release.id} ({dashboard.release.status})
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Platform Health"
          value={String(health.platformHealth)}
          tone={health.platformHealth >= 95 ? "ok" : "bad"}
        />
        <Card
          label="Migration Health"
          value={String(health.migrationHealth)}
          tone={health.migrationHealth >= 95 ? "ok" : "bad"}
        />
        <Card
          label="Dependency Health"
          value={String(health.dependencyHealth)}
          tone={health.dependencyHealth === 100 ? "ok" : "bad"}
        />
        <Card
          label="Schema Drift"
          value={health.schemaDriftOk ? "OK" : "DRIFT"}
          tone={health.schemaDriftOk ? "ok" : "bad"}
        />
        <Card
          label="SQL Foundation"
          value={pct(model.sqlFoundationCoveragePct)}
          detail={model.sqlFoundationOk ? "dry-run OK" : "incomplete"}
          tone={model.sqlFoundationOk ? "ok" : "bad"}
        />
        <Card
          label="Build Status"
          value={statusLabel(health.buildOk)}
          tone={health.buildOk === false ? "bad" : "neutral"}
        />
        <Card
          label="Test Status"
          value={statusLabel(health.testOk)}
          tone={health.testOk === false ? "bad" : "neutral"}
        />
        <Card
          label="Localization"
          value={health.localizationOk ? "PASS" : "FAIL"}
          tone={health.localizationOk ? "ok" : "bad"}
        />
        <Card
          label="Capability Registry"
          value={stage("capability_validation")?.ok ? "PASS" : "FAIL"}
          detail={stage("capability_validation")?.message}
          tone={stage("capability_validation")?.ok ? "ok" : "bad"}
        />
        <Card
          label="Project Sync"
          value={stage("project_bible_sync")?.ok ? "PASS" : "FAIL"}
          detail={stage("project_bible_sync")?.message}
          tone={stage("project_bible_sync")?.ok ? "ok" : "bad"}
        />
        <Card
          label="Platform Readiness"
          value={pct(health.platformCompletionPct)}
          detail={stage("platform_readiness_sync")?.message}
          tone={stage("platform_readiness_sync")?.ok ? "ok" : "bad"}
        />
        <Card
          label="Release Readiness"
          value={String(health.releaseReadiness)}
          detail={dashboard.release.status}
          tone={dashboard.release.status === "validated" ? "ok" : "bad"}
        />
        <Card
          label="CI Status"
          value={`${model.ciStatus.filter((c) => c.present).length}/${model.ciStatus.length}`}
          detail={model.ciStatus.map((c) => c.provider).join(", ")}
          tone={model.cdReady ? "ok" : "bad"}
        />
        <Card
          label="CD Status"
          value={model.cdReady ? "READY" : "INCOMPLETE"}
          detail="Blueprints present for all providers"
          tone={model.cdReady ? "ok" : "bad"}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pipeline stages</h2>
          <ul className="max-h-[28rem] divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
            {dashboard.pipeline.stages.map((entry) => (
              <li key={entry.id} className="px-4 py-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {entry.ok ? "✓" : "✗"} {entry.label}
                    {entry.skipped ? " (skipped)" : ""}
                  </p>
                  <p className="tabular-nums text-xs text-muted-foreground">
                    {entry.durationMs}ms
                  </p>
                </div>
                <p className="text-muted-foreground">{entry.message}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Release checklist</h2>
          <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
            {dashboard.checklist.items.map((item) => (
              <li key={item.id} className="px-4 py-2.5 text-sm">
                <p className="font-medium">
                  {item.ok ? "✓" : "✗"} {item.label}
                </p>
                <p className="text-muted-foreground">{item.message}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-border/50 px-4 py-3 text-sm">
            <p className="font-medium">Health monitoring</p>
            <p className="mt-1 text-muted-foreground">
              Success rate {pct(monitoring.successRate)} · failures {monitoring.failureCount} · avg
              validation {monitoring.averageValidationDurationMs}ms · avg migration{" "}
              {monitoring.averageMigrationDurationMs}ms · avg build{" "}
              {monitoring.averageBuildDurationMs}ms
            </p>
          </div>

          <div className="rounded-xl border border-border/50 px-4 py-3 text-sm">
            <p className="font-medium">Versions</p>
            <p className="mt-1 text-muted-foreground">
              Platform {dashboard.versions.platformVersion} · Schema{" "}
              {dashboard.versions.schemaVersion} · Migrations {dashboard.versions.migrationCount} ·
              Docs {dashboard.versions.documentationVersion} · AI {dashboard.versions.aiVersion}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Historical trend</h2>
        <div className="overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">When</th>
                <th className="px-4 py-2 text-right">Status</th>
                <th className="px-4 py-2 text-right">Platform</th>
                <th className="px-4 py-2 text-right">Migration</th>
                <th className="px-4 py-2 text-right">Readiness</th>
                <th className="px-4 py-2 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {monitoring.trend.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-muted-foreground" colSpan={6}>
                    No history yet — run <code>npm run edrp:operate</code>
                  </td>
                </tr>
              ) : (
                monitoring.trend
                  .slice()
                  .reverse()
                  .slice(0, 20)
                  .map((point) => (
                    <tr key={point.generatedAt + String(point.durationMs)}>
                      <td className="px-4 py-2">
                        {new Date(point.generatedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">{point.ok ? "PASS" : "FAIL"}</td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {point.platformHealth}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {point.migrationHealth}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {point.releaseReadiness}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {point.durationMs}ms
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!model.ok ? (
        <section className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
          <p className="font-medium">Release blocked</p>
          <p className="mt-1 text-muted-foreground">
            Run <code>npm run edrp:operate</code> and resolve failing checklist items before
            promotion.
          </p>
        </section>
      ) : null}
    </div>
  );
}
