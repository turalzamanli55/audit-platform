import { createHash } from "node:crypto";
import { runEnterprisePipeline } from "@/lib/devops/pipeline";
import { evaluateReleaseChecklist } from "@/lib/devops/checklists";
import { buildVersionManifest } from "@/lib/devops/versioning";
import { createReleaseCandidate } from "@/lib/devops/release";
import { generateArtifacts } from "@/lib/devops/artifacts";
import { calculateDevOpsHealth } from "@/lib/devops/health";
import { buildMonitoringSnapshot } from "@/lib/devops/monitoring";
import { buildDashboardModel } from "@/lib/devops/dashboard";
import { runDatabaseLifecycleAutomation } from "@/lib/devops/lifecycle";
import {
  buildHealthMonitoringReport,
  persistArtifactFiles,
  persistHistoryEntry,
  persistSnapshot,
} from "@/lib/devops/history";
import type {
  DevOpsHistoryEntry,
  OperationalReleaseReport,
  OperationalRunOptions,
  PersistedDevOpsSnapshot,
} from "@/lib/devops/history/types";

/**
 * Single-command operational release:
 * Reset → Migration Replay → Types → Build → Tests → Validation → Platform Readiness → Release Candidate
 */
export function runOperationalRelease(
  options: OperationalRunOptions = {},
): OperationalReleaseReport {
  const cwd = options.cwd ?? process.cwd();
  const started = Date.now();
  const persist = options.persist !== false;

  let lifecycle = runDatabaseLifecycleAutomation({
    ...options,
    cwd,
    runDatabaseLifecycle: options.runDatabaseLifecycle !== false,
    skipReset: options.skipReset,
  });

  if (!lifecycle.ok) {
    const resetFailed = lifecycle.steps.some(
      (step) => step.id === "db_reset" && !step.ok && !step.skipped,
    );
    if (resetFailed && !options.skipReset) {
      lifecycle = runDatabaseLifecycleAutomation({
        ...options,
        cwd,
        skipReset: true,
        runDatabaseLifecycle: true,
      });
    }
  }

  const pipeline = runEnterprisePipeline({
    cwd,
    runBuild: options.runBuild !== false,
    runUnitTests: options.runUnitTests !== false,
    runIntegrationTests: options.runIntegrationTests !== false,
  });
  const checklist = evaluateReleaseChecklist(pipeline);
  const versions = buildVersionManifest(cwd);
  const release = createReleaseCandidate({
    pipeline,
    checklist,
    versions,
    cwd,
  });
  const artifacts = generateArtifacts({
    cwd,
    pipeline,
    checklist,
    versions,
    release,
  });
  const health = calculateDevOpsHealth(pipeline, cwd);
  const monitoring = buildMonitoringSnapshot(pipeline, cwd);
  const dashboard = buildDashboardModel({
    pipeline,
    checklist,
    versions,
    release,
    artifacts,
    health,
    monitoring,
  });

  const ok =
    pipeline.ok &&
    checklist.ok &&
    release.status === "validated" &&
    lifecycle.ok;

  const runId = `edrp_${Date.now()}_${createHash("sha256")
    .update(release.id)
    .digest("hex")
    .slice(0, 8)}`;

  const persistedPaths: string[] = [];

  if (persist) {
    const snapshot: PersistedDevOpsSnapshot = {
      id: runId,
      generatedAt: new Date().toISOString(),
      ok,
      dashboard,
      monitoring,
      versions,
      release,
      pipeline,
      health,
      artifacts,
      lifecycle,
    };
    persistedPaths.push(persistSnapshot(snapshot, cwd));
    persistedPaths.push(...persistArtifactFiles(artifacts, runId, cwd));

    const historyEntries: DevOpsHistoryEntry[] = [
      {
        id: `${runId}_operation`,
        kind: "operation",
        ok,
        generatedAt: snapshot.generatedAt,
        durationMs: Date.now() - started,
        summary: `Operational release ${ok ? "PASS" : "FAIL"}`,
        details: {
          platformHealth: health.platformHealth,
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          releaseReadiness: health.releaseReadiness,
          releaseId: release.id,
        },
      },
      {
        id: `${runId}_validation`,
        kind: "validation",
        ok: pipeline.ok,
        generatedAt: snapshot.generatedAt,
        durationMs: pipeline.durationMs,
        summary: `Pipeline ${pipeline.ok ? "PASS" : "FAIL"}`,
        details: {
          platformHealth: health.platformHealth,
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          releaseReadiness: health.releaseReadiness,
        },
      },
      {
        id: `${runId}_release`,
        kind: "release",
        ok: release.status === "validated",
        generatedAt: snapshot.generatedAt,
        durationMs: 0,
        summary: `${release.id} — ${release.status}`,
        details: {
          readinessScore: release.readinessScore,
          platformHealth: health.platformHealth,
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          releaseReadiness: health.releaseReadiness,
        },
      },
      {
        id: `${runId}_migration`,
        kind: "migration",
        ok: lifecycle.ok,
        generatedAt: snapshot.generatedAt,
        durationMs: lifecycle.durationMs,
        summary: `Lifecycle ${lifecycle.ok ? "PASS" : "FAIL"}`,
        details: {
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          platformHealth: health.platformHealth,
          releaseReadiness: health.releaseReadiness,
        },
      },
      {
        id: `${runId}_build`,
        kind: "build",
        ok: health.buildOk !== false,
        generatedAt: snapshot.generatedAt,
        durationMs:
          pipeline.stages.find((s) => s.id === "build_validation")?.durationMs ??
          0,
        summary: `Build ${health.buildOk === null ? "deferred" : health.buildOk ? "PASS" : "FAIL"}`,
        details: {
          platformHealth: health.platformHealth,
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          releaseReadiness: health.releaseReadiness,
        },
      },
      {
        id: `${runId}_platform`,
        kind: "platform",
        ok: true,
        generatedAt: snapshot.generatedAt,
        durationMs: 0,
        summary: `Platform completion ${health.platformCompletionPct}%`,
        details: {
          platformCompletionPct: health.platformCompletionPct,
          platformHealth: health.platformHealth,
          migrationHealth: health.migrationHealth,
          dependencyHealth: health.dependencyHealth,
          releaseReadiness: health.releaseReadiness,
        },
      },
    ];

    for (const entry of historyEntries) {
      persistedPaths.push(persistHistoryEntry(entry, cwd));
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    ok,
    durationMs: Date.now() - started,
    lifecycle,
    dashboard,
    monitoring,
    healthTrends: buildHealthMonitoringReport(cwd),
    persistedPaths,
  };
}

export function formatOperationalReport(report: OperationalReleaseReport): string {
  return [
    "EDRP Operational Release Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.ok ? "PASS" : "FAIL"}`,
    `Duration: ${report.durationMs}ms`,
    "",
    "Database Lifecycle:",
    ...report.lifecycle.steps.map(
      (step) =>
        `  ${step.ok ? "✓" : "✗"}${step.skipped ? " [skipped]" : ""} ${step.label} — ${step.message}`,
    ),
    "",
    `Release: ${report.dashboard.release.id} (${report.dashboard.release.status})`,
    `Pipeline: ${report.dashboard.pipeline.ok ? "PASS" : "FAIL"}`,
    `Checklist: ${report.dashboard.checklist.ok ? "PASS" : "FAIL"}`,
    `Platform Completion: ${report.dashboard.health.platformCompletionPct}%`,
    "",
    "Health Monitoring:",
    `  Success Rate: ${report.healthTrends.successRate}%`,
    `  Failures: ${report.healthTrends.failureCount}`,
    `  Avg Validation: ${report.healthTrends.averageValidationDurationMs}ms`,
    `  Avg Migration: ${report.healthTrends.averageMigrationDurationMs}ms`,
    `  Avg Build: ${report.healthTrends.averageBuildDurationMs}ms`,
    "",
    `Persisted: ${report.persistedPaths.length} files`,
  ].join("\n");
}
