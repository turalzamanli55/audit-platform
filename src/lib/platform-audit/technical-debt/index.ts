/**
 * EPAC Phase 14 — Technical Debt (v2 classified severities).
 */
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import type { AuditFinding, PhaseHealth, TechnicalDebtItem } from "@/lib/platform-audit/types";

export function auditTechnicalDebtFromEvidence(report: EvidenceEngineReport): {
  phase: PhaseHealth;
  items: TechnicalDebtItem[];
} {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const items: TechnicalDebtItem[] = report.debt.map((item) => ({
    code: item.code,
    kind: item.code.includes("unimplemented") ? "unused_module" : "marker",
    severity:
      item.severity === "critical" || item.severity === "high"
        ? "error"
        : item.severity === "medium"
          ? "warning"
          : "info",
    debtSeverity: item.severity,
    message: item.message,
    rootCause: item.rootCause,
    paths: item.paths,
    weight: item.weight,
  }));

  const critical = items.filter((i) => i.debtSeverity === "critical").length;
  const high = items.filter((i) => i.debtSeverity === "high").length;
  if (critical > 0) {
    findings.push({
      phase: "technical_debt",
      code: "critical_debt_present",
      severity: "error",
      message: `${critical} critical debt items`,
      rootCause: "Not-implemented stubs or equivalent critical markers",
    });
  }

  const scorePct = Math.max(
    0,
    Number(
      (
        100 -
        Math.min(
          70,
          items.reduce((sum, item) => sum + (item.weight ?? 0), 0),
        )
      ).toFixed(2),
    ),
  );

  return {
    items,
    phase: {
      phase: "technical_debt",
      label: "Technical Debt Audit",
      ok: critical === 0,
      scorePct,
      findings,
      metrics: {
        critical,
        high,
        medium: items.filter((i) => i.debtSeverity === "medium").length,
        low: items.filter((i) => i.debtSeverity === "low").length,
        informational: items.filter((i) => i.debtSeverity === "informational").length,
        debtItems: items.length,
      },
      durationMs: Date.now() - started,
    },
  };
}

export function auditTechnicalDebt(
  _modules: unknown,
  _capabilities: unknown,
  _cwd?: string,
): { phase: PhaseHealth; items: TechnicalDebtItem[] } {
  throw new Error("auditTechnicalDebt requires Evidence Engine v2");
}
