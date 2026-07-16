import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type {
  DevOpsHistoryEntry,
  HealthMonitoringReport,
  HealthTrendPoint,
  PersistedDevOpsSnapshot,
} from "@/lib/devops/history/types";
import type { DevOpsArtifact } from "@/lib/devops/types";

export function devopsDataDir(cwd = process.cwd()): string {
  return join(cwd, "src", "lib", "devops", "data");
}

export function historyDir(cwd = process.cwd()): string {
  return join(devopsDataDir(cwd), "history");
}

export function artifactsDir(cwd = process.cwd()): string {
  return join(devopsDataDir(cwd), "artifacts");
}

export function snapshotsDir(cwd = process.cwd()): string {
  return join(devopsDataDir(cwd), "snapshots");
}

function ensureDir(path: string): string {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
  return path;
}

export function persistHistoryEntry(
  entry: DevOpsHistoryEntry,
  cwd = process.cwd(),
): string {
  const dir = ensureDir(historyDir(cwd));
  const path = join(dir, `${entry.id}.json`);
  writeFileSync(path, JSON.stringify(entry, null, 2), "utf8");
  return path;
}

export function listHistoryEntries(cwd = process.cwd()): DevOpsHistoryEntry[] {
  const dir = historyDir(cwd);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) =>
      JSON.parse(readFileSync(join(dir, name), "utf8")) as DevOpsHistoryEntry,
    );
}

export function persistArtifactFiles(
  artifacts: DevOpsArtifact[],
  runId: string,
  cwd = process.cwd(),
): string[] {
  const dir = ensureDir(join(artifactsDir(cwd), runId));
  const paths: string[] = [];
  for (const artifact of artifacts) {
    const path = join(dir, `${artifact.kind}.md`);
    writeFileSync(path, `# ${artifact.title}\n\n${artifact.body}\n`, "utf8");
    paths.push(path);
  }
  return paths;
}

export function persistSnapshot(
  snapshot: PersistedDevOpsSnapshot,
  cwd = process.cwd(),
): string {
  const dir = ensureDir(snapshotsDir(cwd));
  const path = join(dir, `${snapshot.id}.json`);
  writeFileSync(path, JSON.stringify(snapshot, null, 2), "utf8");
  writeFileSync(join(dir, "latest.json"), JSON.stringify(snapshot, null, 2), "utf8");
  return path;
}

export function loadLatestSnapshot(
  cwd = process.cwd(),
): PersistedDevOpsSnapshot | null {
  const path = join(snapshotsDir(cwd), "latest.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as PersistedDevOpsSnapshot;
}

export function buildHealthMonitoringReport(
  cwd = process.cwd(),
): HealthMonitoringReport {
  const history = listHistoryEntries(cwd);
  const validations = history.filter((entry) =>
    ["validation", "operation", "release"].includes(entry.kind),
  );
  const successCount = validations.filter((entry) => entry.ok).length;
  const failureCount = validations.filter((entry) => !entry.ok).length;
  const total = Math.max(1, validations.length);

  const builds = history.filter((entry) => entry.kind === "build");
  const migrations = history.filter((entry) => entry.kind === "migration");
  const avg = (entries: DevOpsHistoryEntry[]) =>
    entries.length === 0
      ? 0
      : Number(
          (
            entries.reduce((sum, entry) => sum + entry.durationMs, 0) /
            entries.length
          ).toFixed(0),
        );

  const trend: HealthTrendPoint[] = validations.slice(-30).map((entry) => ({
    generatedAt: entry.generatedAt,
    platformHealth: Number(entry.details?.platformHealth ?? 0),
    migrationHealth: Number(entry.details?.migrationHealth ?? 0),
    dependencyHealth: Number(entry.details?.dependencyHealth ?? 0),
    releaseReadiness: Number(entry.details?.releaseReadiness ?? 0),
    ok: entry.ok,
    durationMs: entry.durationMs,
  }));

  return {
    generatedAt: new Date().toISOString(),
    successRate: Number(((successCount / total) * 100).toFixed(2)),
    failureCount,
    successCount,
    averageBuildDurationMs: avg(builds),
    averageMigrationDurationMs: avg(migrations),
    averageValidationDurationMs: avg(validations),
    recentFailures: validations.filter((entry) => !entry.ok).slice(-10),
    trend,
  };
}
