/**
 * EPAC Phase 13 — Certification (v2: confidence + domain health).
 */
import type {
  AuditFinding,
  CertificationLevel,
  PhaseHealth,
  PlatformAuditReport,
} from "@/lib/platform-audit/types";
import { deriveCertificationLevel } from "@/lib/platform-audit/types";

export function certifyPlatform(input: {
  overallCompletionPct: number;
  verifiedCompletionPct: number;
  evidenceConfidencePct: number;
  phases: PhaseHealth[];
  blockerCount: number;
}): {
  phase: PhaseHealth;
  certification: CertificationLevel;
  enterpriseCertified: boolean;
  findings: AuditFinding[];
} {
  const started = Date.now();

  const architecture = input.phases.find((p) => p.phase === "architecture")?.scorePct ?? 0;
  const database = input.phases.find((p) => p.phase === "database")?.scorePct ?? 0;
  const testing = input.phases.find((p) => p.phase === "testing")?.scorePct ?? 0;
  const security = input.phases.find((p) => p.phase === "security")?.scorePct ?? 0;
  const localization = input.phases.find((p) => p.phase === "localization")?.scorePct ?? 0;
  const ai = input.phases.find((p) => p.phase === "ai")?.scorePct ?? 0;
  const devops = input.phases.find((p) => p.phase === "devops")?.scorePct ?? 0;

  // Certification score weights verified evidence heavily
  const certificationScore = Number(
    (
      input.verifiedCompletionPct * 0.45 +
      input.evidenceConfidencePct * 0.2 +
      architecture * 0.05 +
      database * 0.08 +
      testing * 0.07 +
      security * 0.05 +
      localization * 0.04 +
      ai * 0.03 +
      devops * 0.03
    ).toFixed(2),
  );

  const certification = deriveCertificationLevel(certificationScore);
  const enterpriseCertified =
    certification === "enterprise_certified" &&
    input.blockerCount === 0 &&
    input.verifiedCompletionPct >= 95 &&
    input.evidenceConfidencePct >= 90;

  const findings: AuditFinding[] = [];
  if (input.blockerCount > 0) {
    findings.push({
      phase: "production_readiness",
      code: "blockers_prevent_certification",
      severity: "blocker",
      message: `${input.blockerCount} blocker findings prevent enterprise certification`,
      rootCause: "Unresolved blocker-severity audit findings",
    });
  }
  if (!enterpriseCertified) {
    findings.push({
      phase: "production_readiness",
      code: "not_enterprise_certified",
      severity: "info",
      message: `Certification level=${certification} (score ${certificationScore}%, verified ${input.verifiedCompletionPct}%)`,
      rootCause:
        input.verifiedCompletionPct < 95
          ? "Verified evidence completion below 95%"
          : input.evidenceConfidencePct < 90
            ? "Evidence confidence below 90%"
            : "Blockers or composite certification score below enterprise threshold",
    });
  }

  return {
    certification,
    enterpriseCertified,
    findings,
    phase: {
      phase: "production_readiness",
      label: "Production Readiness",
      ok: input.blockerCount === 0,
      scorePct: certificationScore,
      findings,
      metrics: {
        certification,
        enterpriseCertified,
        certificationScore,
        verifiedCompletionPct: input.verifiedCompletionPct,
        evidenceConfidencePct: input.evidenceConfidencePct,
        overallCompletionPct: input.overallCompletionPct,
        blockerCount: input.blockerCount,
      },
      durationMs: Date.now() - started,
    },
  };
}

export function summarizeRemainingWork(
  report: Pick<PlatformAuditReport, "modules" | "capabilities" | "findings">,
): string[] {
  const work: string[] = [];
  for (const module of report.modules) {
    work.push(...module.remainingWork.slice(0, 8));
  }
  for (const capability of report.capabilities) {
    if (capability.verifiedCompletionPct < 100) {
      work.push(
        `capability:${capability.id} missing trusted [${capability.missingEvidence.join(", ")}]`,
      );
    }
  }
  for (const finding of report.findings) {
    if (finding.severity === "blocker" || finding.severity === "error") {
      work.push(`${finding.code}: ${finding.rootCause}`);
    }
  }
  return [...new Set(work)].slice(0, 200);
}
