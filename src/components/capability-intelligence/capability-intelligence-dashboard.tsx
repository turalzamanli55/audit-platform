import type { CapabilityIntelligenceDashboardModel } from "@/lib/capability-intelligence/dashboard";

function pct(value: number): string {
  return `${Number(value).toFixed(2)}%`;
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

export function CapabilityIntelligenceDashboard(props: {
  model: CapabilityIntelligenceDashboardModel;
}) {
  const { report } = props.model;
  const m = report.metrics;
  const blocked = report.capabilities.filter((c) => c.lifecycle === "blocked").slice(0, 10);
  const future = report.capabilities.filter((c) => c.phase === "future").slice(0, 10);
  const optional = report.capabilities.filter((c) => c.classes.includes("optional")).slice(0, 10);
  const requiredLow = report.capabilities
    .filter((c) => c.countsTowardCompletion)
    .sort((a, b) => a.requiredCompletionPct - b.requiredCompletionPct)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Capability Intelligence Engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Enterprise Capability Dashboard</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          PROJECT_BIBLE.md is the executable specification. Completion uses required verified
          evidence only. Future, optional, experimental, and blocked capabilities do not penalize
          the platform.
        </p>
        <p className="text-xs text-muted-foreground">
          Source {props.model.source} · {new Date(props.model.generatedAt).toLocaleString()} ·
          certification {report.certification.level}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Capability Health"
          value={pct(report.platformCompletionPct)}
          tone={report.platformCompletionPct >= 85 ? "ok" : "bad"}
        />
        <Card label="Required" value={String(m.required)} />
        <Card label="Optional" value={String(m.optional)} tone="neutral" />
        <Card label="Future" value={String(m.future)} tone="neutral" />
        <Card label="Blocked" value={String(m.blocked)} tone={m.blocked > 0 ? "bad" : "ok"} />
        <Card label="Verified" value={String(m.verified)} />
        <Card label="Certified Caps" value={String(m.certified)} />
        <Card
          label="Certification Readiness"
          value={report.certification.level}
          detail={pct(report.certification.requiredCompletionPct)}
          tone={report.certification.enterpriseCertified ? "ok" : "bad"}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Required Capabilities (lowest)</h2>
          <ul className="space-y-2 text-sm">
            {requiredLow.map((c) => (
              <li key={c.id} className="rounded-lg border px-3 py-2">
                <div className="flex justify-between gap-3">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {pct(c.requiredCompletionPct)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.lifecycle} · {c.weight} · {c.primaryClass}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recommended Sprint</h2>
          <ul className="space-y-2 text-sm">
            {report.roadmap.recommendedSprint.map((item) => (
              <li key={item.id} className="rounded-lg border px-3 py-2">
                <p className="font-medium">
                  [{item.weight}] {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Blocked</h2>
          <ul className="space-y-2 text-sm">
            {blocked.map((c) => (
              <li key={c.id} className="rounded-lg border px-3 py-2">
                {c.name}
                <p className="text-xs text-muted-foreground">{c.blockedBy.join("; ")}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Future</h2>
          <ul className="space-y-2 text-sm">
            {future.map((c) => (
              <li key={c.id} className="rounded-lg border px-3 py-2">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Optional</h2>
          <ul className="space-y-2 text-sm">
            {optional.map((c) => (
              <li key={c.id} className="rounded-lg border px-3 py-2">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Critical Path</h2>
        <ul className="space-y-1 text-sm">
          {report.roadmap.criticalPath.slice(0, 20).map((id) => (
            <li key={id} className="rounded border px-3 py-1">
              {id}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Dependency / Graph Summary</h2>
        <p className="text-sm text-muted-foreground">
          Graph nodes={report.graph.nodes.length} · edges={report.graph.edges.length} · dependency
          edges={report.dependencies.edges.length}
        </p>
      </section>
    </div>
  );
}
