/**
 * EPAC Performance probe — evidence of performance/telemetry modules only.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { directoryHasFiles, walkFiles } from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

export function auditPerformance(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const telemetry = directoryHasFiles(join(cwd, "src", "lib", "ai", "host", "telemetry"), [".ts"])
    || directoryHasFiles(join(cwd, "src", "lib", "ai", "pipeline", "telemetry"), [".ts"])
    || directoryHasFiles(join(cwd, "src", "lib", "ai", "tools", "telemetry"), [".ts"]);
  const health = directoryHasFiles(join(cwd, "src", "lib", "health"), [".ts"]);
  const logger = directoryHasFiles(join(cwd, "src", "lib", "logger"), [".ts"]);

  const perfMentions = walkFiles(join(cwd, "src", "lib"), [".ts"])
    .filter((file) => /performance|telemetry|metrics/i.test(file))
    .length;

  if (!telemetry && !health) {
    findings.push({
      phase: "technical_debt",
      code: "performance_evidence_weak",
      severity: "warning",
      message: "Limited performance/telemetry evidence",
      rootCause: "No dedicated performance audit surfaces beyond health/logger",
    });
  }

  const flags = [telemetry, health, logger, perfMentions > 0];
  const scorePct = Number(((flags.filter(Boolean).length / flags.length) * 100).toFixed(2));

  return {
    phase: "technical_debt",
    label: "Performance Probe",
    ok: true,
    scorePct,
    findings,
    metrics: {
      telemetryPresent: telemetry,
      healthPresent: health,
      loggerPresent: logger,
      performancePathMentions: perfMentions,
      aiHostExists: existsSync(join(cwd, "src", "lib", "ai", "host")),
    },
    durationMs: Date.now() - started,
  };
}
