import type { ImplementationIntelligenceDashboardModel } from "@/lib/implementation-intelligence/dashboard";

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

export function ImplementationIntelligenceDashboard(props: {
  model: ImplementationIntelligenceDashboardModel;
}) {
  const { report } = props.model;
  const m = report.metrics;
  const lowest = report.contracts
    .slice()
    .sort((a, b) => a.coveragePct - b.coveragePct)
    .slice(0, 12);
  const repairQueue = report.repairPlan.items.slice(0, 15);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Implementation Intelligence Engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Enterprise Implementation Dashboard
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          PROJECT_BIBLE.md is the executable implementation specification. Completion is calculated
          only from verified Implementation Contracts. Partial contracts are never certified.
        </p>
        <p className="text-xs text-muted-foreground">
          Source {props.model.source} · {new Date(props.model.generatedAt).toLocaleString()} ·
          certification {report.certification.level}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Implementation Coverage"
          value={pct(report.platformCompletionPct)}
          tone={report.platformCompletionPct >= 85 ? "ok" : "bad"}
        />
        <Card
          label="Contracts"
          value={`${m.certified}/${m.contracts}`}
          detail="certified / total"
        />
        <Card label="Implementation Gaps" value={String(m.gaps)} tone={m.gaps > 0 ? "bad" : "ok"} />
        <Card label="Repair Queue" value={String(m.repairItems)} />
        <Card
          label="Missing Repositories"
          value={String(report.repository.missingMethods.length)}
        />
        <Card
          label="Missing Server Actions"
          value={String(report.serverActions.missingActions.length)}
        />
        <Card label="Missing Workflows" value={String(report.workflow.missing.length)} />
        <Card label="Missing Tests" value={String(report.testing.missing.length)} />
        <Card label="Missing Permissions" value={String(report.permissions.missing.length)} />
        <Card
          label="Certification Progress"
          value={pct(report.certification.coveragePct)}
          detail={report.certification.level}
          tone={report.certification.enterpriseCertified ? "ok" : "bad"}
        />
        <Card label="Critical Path" value={String(report.repairPlan.criticalPath.length)} />
        <Card
          label="AI Readiness Contracts"
          value={String(report.aiReadiness.contracts.length)}
          detail="machine-readable"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Lowest Contract Coverage</h2>
          <ul className="space-y-2 text-sm">
            {lowest.map((c) => (
              <li key={c.contractId} className="rounded-lg border px-3 py-2">
                <div className="flex justify-between gap-3">
                  <span>{c.capabilityName}</span>
                  <span className="tabular-nums text-muted-foreground">{pct(c.coveragePct)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  certified={String(c.certified)} ·{" "}
                  {c.clauses
                    .filter((cl) => cl.required && !cl.verified)
                    .map((cl) => cl.id)
                    .join(", ") || "complete"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Repair Queue</h2>
          <ul className="space-y-2 text-sm">
            {repairQueue.map((item) => (
              <li key={`${item.order}-${item.capabilityId}-${item.clause}`} className="rounded-lg border px-3 py-2">
                <p className="font-medium">
                  {item.order}. [{item.businessValue}] {item.capabilityId}.{item.clause}
                </p>
                <p className="text-xs text-muted-foreground">{item.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Critical Path</h2>
        <ul className="space-y-1 text-sm">
          {report.repairPlan.criticalPath.slice(0, 25).map((id) => (
            <li key={id} className="rounded border px-3 py-1">
              {id}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
