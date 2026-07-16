import type { PlatformAuditDashboardModel } from "@/lib/platform-audit/types";

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

export function PlatformAuditDashboard(props: { model: PlatformAuditDashboardModel }) {
  const { model } = props;
  const { report } = model;
  const health = report.health;
  const er = report.evidenceResolution;
  const majorGaps = report.findings
    .filter((finding) => finding.severity === "blocker" || finding.severity === "error")
    .slice(0, 12);
  const topModules = report.modules
    .slice()
    .sort((a, b) => a.verifiedCompletionPct - b.verifiedCompletionPct)
    .slice(0, 12);
  const topCapabilities = report.capabilities
    .slice()
    .sort((a, b) => a.verifiedCompletionPct - b.verifiedCompletionPct)
    .slice(0, 12);
  const falsePositives = (report.falsePositives ?? []).slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise Platform Audit & Certification Engine v2
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Platform Audit v2 Dashboard</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Intelligent Evidence Engine — AST, imports, aliases, and confidence-weighted resolution.
          Completion uses verified/strong evidence only. PROJECT_BIBLE.md is the only source of truth.
        </p>
        <p className="text-xs text-muted-foreground">
          Source {model.source} · calculated {new Date(model.generatedAt).toLocaleString()} ·
          certification {report.certification}
          {report.enterpriseCertified ? " · ENTERPRISE CERTIFIED" : ""} · scanned{" "}
          {er?.filesScanned ?? 0} files / {er?.symbolsScanned ?? 0} symbols
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Overall Readiness"
          value={pct(health.overall)}
          tone={health.overall >= 85 ? "ok" : "bad"}
          detail={report.certification}
        />
        <Card
          label="Evidence Coverage"
          value={pct(er?.evidenceCoveragePct ?? 0)}
          tone={(er?.evidenceCoveragePct ?? 0) >= 70 ? "ok" : "bad"}
        />
        <Card
          label="Evidence Confidence"
          value={pct(report.evidenceConfidencePct ?? health.evidenceConfidence ?? 0)}
          tone={(report.evidenceConfidencePct ?? 0) >= 80 ? "ok" : "bad"}
        />
        <Card
          label="Verified Completion"
          value={pct(report.verifiedCompletionPct ?? health.verifiedCompletion ?? 0)}
          tone={(report.verifiedCompletionPct ?? 0) >= 85 ? "ok" : "bad"}
        />
        <Card
          label="False Positives"
          value={String(er?.falsePositiveCount ?? report.falsePositives?.length ?? 0)}
          tone="neutral"
          detail="corrected mismatches"
        />
        <Card
          label="Module Confidence"
          value={pct(er?.moduleConfidencePct ?? 0)}
          tone={(er?.moduleConfidencePct ?? 0) >= 70 ? "ok" : "bad"}
        />
        <Card
          label="Capability Confidence"
          value={pct(er?.capabilityConfidencePct ?? 0)}
          tone={(er?.capabilityConfidencePct ?? 0) >= 70 ? "ok" : "bad"}
        />
        <Card
          label="Certification Status"
          value={report.enterpriseCertified ? "CERTIFIED" : report.certification}
          tone={report.enterpriseCertified ? "ok" : "bad"}
        />
        <Card label="Architecture Health" value={pct(health.architecture)} />
        <Card label="Database Health" value={pct(health.database)} />
        <Card label="AI Health" value={pct(health.ai)} detail={`${er?.aiAreasPresent ?? 0}/${er?.aiAreasExpected ?? 0} areas`} />
        <Card label="DevOps Health" value={pct(health.devops)} />
        <Card label="Security Health" value={pct(health.security)} />
        <Card label="Testing Health" value={pct(health.testing)} />
        <Card label="Localization Health" value={pct(health.localization)} />
        <Card
          label="Implementation Graph"
          value={`${er?.graphNodes ?? 0}`}
          detail={`${er?.graphEdges ?? 0} edges`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Audit Phases</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Phase</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Findings</th>
              </tr>
            </thead>
            <tbody>
              {report.phases.map((phase) => (
                <tr key={phase.phase} className="border-t">
                  <td className="px-3 py-2">{phase.label}</td>
                  <td className="px-3 py-2">{phase.ok ? "PASS" : "FAIL"}</td>
                  <td className="px-3 py-2 tabular-nums">{pct(phase.scorePct)}</td>
                  <td className="px-3 py-2 tabular-nums">{phase.findings.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Lowest Module Confidence</h2>
          <ul className="space-y-2 text-sm">
            {topModules.map((module) => (
              <li key={module.id} className="rounded-lg border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span>{module.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {pct(module.verifiedCompletionPct)} / {pct(module.confidencePct)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  roots: {module.matchedRoots.join(", ") || "none"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Lowest Capability Verified Evidence</h2>
          <ul className="space-y-2 text-sm">
            {topCapabilities.map((capability) => (
              <li key={capability.id} className="rounded-lg border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span>{capability.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {pct(capability.verifiedCompletionPct)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {capability.rootCause ?? capability.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">False Positives / Corrected Mismatches</h2>
        <ul className="space-y-2 text-sm">
          {falsePositives.map((item, index) => (
            <li key={`${item.code}-${index}`} className="rounded-lg border px-3 py-2">
              <p className="font-medium">
                [{item.severity}] {item.code}
              </p>
              <p className="text-muted-foreground">{item.rootCause}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Missing Evidence / Major Gaps</h2>
        <ul className="space-y-2 text-sm">
          {majorGaps.map((finding, index) => (
            <li key={`${finding.code}-${index}`} className="rounded-lg border px-3 py-2">
              <p className="font-medium">
                [{finding.severity}] {finding.code}
              </p>
              <p className="text-muted-foreground">{finding.rootCause}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
