import { runAllValidationStages } from "@/lib/devops/validation";
import type {
  PipelineRunOptions,
  PipelineRunReport,
} from "@/lib/devops/types";

/**
 * EDRP Pipeline — ordered enterprise validation chain.
 */
export function runEnterprisePipeline(
  options: PipelineRunOptions = {},
): PipelineRunReport {
  const started = Date.now();
  const stages = runAllValidationStages(options);
  const blockers = stages.filter(
    (s) => !s.ok && !s.skipped && s.severity === "blocker",
  ).length;
  const errors = stages.filter(
    (s) => !s.ok && !s.skipped && s.severity === "error",
  ).length;
  const warnings = stages.filter(
    (s) => !s.ok && !s.skipped && s.severity === "warning",
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    ok: blockers === 0 && errors === 0,
    stages,
    blockers,
    errors,
    warnings,
    durationMs: Date.now() - started,
  };
}

export function formatPipelineReport(report: PipelineRunReport): string {
  const lines = [
    "Enterprise DevOps Pipeline Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.ok ? "PASS" : "FAIL"}`,
    `Duration: ${report.durationMs}ms`,
    `Blockers: ${report.blockers}`,
    `Errors: ${report.errors}`,
    `Warnings: ${report.warnings}`,
    "",
    "Stages:",
  ];
  for (const stage of report.stages) {
    const mark = stage.skipped ? "○" : stage.ok ? "✓" : "✗";
    const skip = stage.skipped ? " [skipped]" : "";
    lines.push(
      `  ${mark} ${stage.label}${skip} (${stage.durationMs}ms) — ${stage.message}`,
    );
  }
  return lines.join("\n");
}
