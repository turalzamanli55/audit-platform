import type { SyncDiffEntry, SyncRunReport, SyncSnapshot } from "@/lib/project-sync/types";
import { nowIso } from "@/lib/project-sync/utils";
import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export function historyDir(cwd = process.cwd()): string {
  return path.join(cwd, "src", "lib", "project-sync", "snapshots", "history");
}

export function appendSyncHistory(report: SyncRunReport, cwd = process.cwd()): string {
  const dir = historyDir(cwd);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${report.snapshotId}.report.json`);
  writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
  return filePath;
}

export function listSyncHistory(cwd = process.cwd()): SyncRunReport[] {
  const dir = historyDir(cwd);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".report.json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(path.join(dir, name), "utf8")) as SyncRunReport);
}

export function buildSyncRunReport(input: {
  snapshot: SyncSnapshot;
  previousSnapshotId: string | null;
  diff: SyncDiffEntry[];
  validation: SyncRunReport["validation"];
  technicalDebt: SyncRunReport["technicalDebt"];
  roadmap: SyncRunReport["roadmap"];
}): SyncRunReport {
  const meaningful = input.diff.filter((entry) => entry.change !== "unchanged");
  return {
    snapshotId: input.snapshot.id,
    timestamp: nowIso(),
    incremental: Boolean(input.previousSnapshotId),
    previousSnapshotId: input.previousSnapshotId,
    diff: meaningful,
    counts: {
      domains: input.snapshot.domains.length,
      modules: input.snapshot.modules.length,
      features: input.snapshot.features.length,
      capabilities: input.snapshot.capabilities.length,
      requirements: input.snapshot.requirements.length,
      added: meaningful.filter((entry) => entry.change === "added").length,
      removed: meaningful.filter((entry) => entry.change === "removed").length,
      modified: meaningful.filter((entry) => entry.change === "modified").length,
      renamed: meaningful.filter((entry) => entry.change === "renamed").length,
    },
    platformCompletionPct: input.snapshot.platformCompletionPct,
    validation: input.validation,
    technicalDebt: input.technicalDebt,
    roadmap: input.roadmap,
  };
}
