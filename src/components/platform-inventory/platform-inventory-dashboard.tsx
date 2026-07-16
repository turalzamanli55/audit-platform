"use client";

import type { PlatformInventoryDashboardModel } from "@/lib/platform-inventory/dashboard";

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

export function PlatformInventoryDashboard(props: {
  model: PlatformInventoryDashboardModel;
}) {
  const { report } = props.model;
  const m = report.metrics;
  const lowest = report.modules
    .slice()
    .sort((a, b) => a.completionPct - b.completionPct)
    .slice(0, 12);
  const critical = report.dependency.criticalPath.slice(0, 15);
  const caps = report.capabilities
    .slice()
    .sort((a, b) => a.completionPct - b.completionPct)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Platform Inventory & Readiness Engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Enterprise Platform Inventory
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Definitive inventory of what exists, what is partial, what is missing, and what is
          production-ready. Overall readiness is calculated only from verified implementation
          contracts (EIIE). Inputs: PROJECT_BIBLE → EPBSE · EPAC · ECIE · EIIE.
        </p>
        <p className="text-xs text-muted-foreground">
          Source {props.model.source} · {new Date(props.model.generatedAt).toLocaleString()} ·
          EPBSE={report.sources.epbse} EPAC={report.sources.epac} ECIE={report.sources.ecie}{" "}
          EIIE={report.sources.eiie}
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-medium">1. Platform Overview</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            label="Overall Readiness"
            value={pct(report.overallPlatformReadinessPct)}
            detail={report.overallReadiness}
            tone={report.overallPlatformReadinessPct >= 85 ? "ok" : "bad"}
          />
          <Card
            label="Certification"
            value={report.overallCertification}
            detail={report.enterpriseCertified ? "enterprise certified" : "not enterprise"}
          />
          <Card
            label="Capabilities Certified"
            value={`${m.capabilitiesCertified}/${m.capabilitiesRequired}`}
            detail="certified / required"
          />
          <Card
            label="Critical Path"
            value={String(m.criticalPathLength)}
            tone={m.criticalPathLength > 0 ? "bad" : "ok"}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">2. Inventory</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card label="Domains" value={String(report.inventory.domains)} />
          <Card label="Modules" value={String(report.inventory.modules)} />
          <Card label="Features" value={String(report.inventory.features)} />
          <Card label="Capabilities" value={String(report.inventory.capabilities)} />
          <Card label="Migrations" value={String(report.inventory.migrations)} />
          <Card label="Repositories" value={String(report.inventory.repositories)} />
          <Card label="Server Actions" value={String(report.inventory.serverActions)} />
          <Card label="Routes" value={String(report.inventory.routes)} />
          <Card label="Tests" value={String(report.inventory.tests)} />
          <Card label="Locales" value={String(report.inventory.locales)} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">3. Domain Dashboard</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.domains.map((d) => (
            <Card
              key={d.id}
              label={d.name}
              value={pct(d.completionPct)}
              detail={`${d.readiness} · ${d.moduleIds.length} modules`}
              tone={d.completionPct >= 70 ? "ok" : "neutral"}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">4. Health (EPAC)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card label="Architecture" value={pct(report.health.architecture)} />
          <Card label="Database" value={pct(report.health.database)} />
          <Card label="Backend" value={pct(report.health.backend)} />
          <Card label="Frontend" value={pct(report.health.frontend)} />
          <Card label="AI" value={pct(report.health.ai)} />
          <Card label="Security" value={pct(report.health.security)} />
          <Card label="Testing" value={pct(report.health.testing)} />
          <Card label="Localization" value={pct(report.health.localization)} />
          <Card label="DevOps" value={pct(report.health.devops)} />
          <Card label="Documentation" value={pct(report.health.documentation)} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-medium">5. Module Dashboard (lowest)</h2>
          <ul className="space-y-2 text-sm">
            {lowest.map((mod) => (
              <li
                key={mod.id}
                className="flex items-center justify-between border-b border-border/40 py-2"
              >
                <span className="truncate pr-3">{mod.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {pct(mod.completionPct)} · {mod.readiness}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-medium">6. Critical Path</h2>
          <ul className="space-y-2 text-sm">
            {critical.length === 0 ? (
              <li className="text-muted-foreground">No critical path items</li>
            ) : (
              critical.map((step) => (
                <li key={step} className="border-b border-border/40 py-2 font-mono text-xs">
                  {step}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">7. Capability Dashboard (lowest)</h2>
        <ul className="space-y-2 text-sm">
          {caps.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between border-b border-border/40 py-2"
            >
              <span className="truncate pr-3">
                {c.certified ? "[CERT]" : c.blocked ? "[BLOCK]" : "[ ]"} {c.name}
              </span>
              <span className="tabular-nums text-muted-foreground">{pct(c.completionPct)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">8. Feature Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card label="Implemented" value={String(m.featuresImplemented)} tone="ok" />
          <Card label="Partial" value={String(m.featuresPartial)} />
          <Card label="Missing" value={String(m.featuresMissing)} tone="bad" />
          <Card label="Blocked" value={String(m.featuresBlocked)} tone="bad" />
          <Card label="Future" value={String(m.featuresFuture)} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">9. Remaining Work</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {report.remainingWork.slice(0, 20).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
