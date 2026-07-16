import { createHash } from "node:crypto";
import type {
  PipelineRunReport,
  ReleaseCandidate,
  ReleaseChecklistReport,
  VersionManifest,
} from "@/lib/devops/types";
import { loadMigrations } from "@/lib/database-governance/audit";

/**
 * Release Manager — generates release candidates from pipeline + checklist outcomes.
 */
export function createReleaseCandidate(input: {
  pipeline: PipelineRunReport;
  checklist: ReleaseChecklistReport;
  versions: VersionManifest;
  cwd?: string;
}): ReleaseCandidate {
  const cwd = input.cwd ?? process.cwd();
  const migrations = loadMigrations(cwd);
  const databaseChanges = migrations
    .slice(-8)
    .map((m) => m.filename);
  const breakingChanges = input.pipeline.stages
    .filter((s) => !s.ok && !s.skipped)
    .map((s) => `${s.id}: ${s.message}`);

  const passed = input.pipeline.stages.filter((s) => s.ok).length;
  const total = input.pipeline.stages.length;
  const readinessScore = Number(((passed / Math.max(1, total)) * 100).toFixed(2));

  const status: ReleaseCandidate["status"] =
    input.pipeline.ok && input.checklist.ok
      ? "validated"
      : input.pipeline.ok
        ? "draft"
        : "rejected";

  const hash = createHash("sha256")
    .update(`${input.versions.platformVersion}:${input.versions.migrationVersion}:${input.pipeline.generatedAt}`)
    .digest("hex")
    .slice(0, 12);

  return {
    id: `rc-${input.versions.platformVersion}-${hash}`,
    version: input.versions.platformVersion,
    createdAt: new Date().toISOString(),
    status,
    versions: input.versions,
    pipelineOk: input.pipeline.ok,
    checklistOk: input.checklist.ok,
    readinessScore,
    breakingChanges,
    databaseChanges,
    notes: [
      `Pipeline ${input.pipeline.ok ? "PASS" : "FAIL"} in ${input.pipeline.durationMs}ms`,
      `Checklist ${input.checklist.ok ? "PASS" : "FAIL"}`,
      `Migration count: ${input.versions.migrationCount}`,
      `Documentation version: ${input.versions.documentationVersion}`,
      `AI version: ${input.versions.aiVersion}`,
    ],
  };
}

export function formatReleaseNotes(candidate: ReleaseCandidate): string {
  return [
    "Release Notes",
    "",
    `Candidate: ${candidate.id}`,
    `Version: ${candidate.version}`,
    `Status: ${candidate.status}`,
    `Readiness Score: ${candidate.readinessScore}`,
    `Created: ${candidate.createdAt}`,
    "",
    "Version Summary:",
    `  Platform: ${candidate.versions.platformVersion}`,
    `  Schema: ${candidate.versions.schemaVersion}`,
    `  Migration: ${candidate.versions.migrationVersion}`,
    `  Capability: ${candidate.versions.capabilityVersion}`,
    `  Documentation: ${candidate.versions.documentationVersion}`,
    `  AI: ${candidate.versions.aiVersion}`,
    "",
    "Migration Summary:",
    ...candidate.databaseChanges.map((c) => `  - ${c}`),
    "",
    "Breaking Changes / Failures:",
    ...(candidate.breakingChanges.length > 0
      ? candidate.breakingChanges.map((c) => `  - ${c}`)
      : ["  (none)"]),
    "",
    "Notes:",
    ...candidate.notes.map((n) => `  - ${n}`),
  ].join("\n");
}
