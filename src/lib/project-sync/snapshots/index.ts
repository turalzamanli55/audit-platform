import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { SyncSnapshot } from "@/lib/project-sync/types";

export function snapshotsDir(cwd = process.cwd()): string {
  return path.join(cwd, "src", "lib", "project-sync", "snapshots", "data");
}

export function ensureSnapshotsDir(cwd = process.cwd()): string {
  const dir = snapshotsDir(cwd);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function listSnapshotFiles(cwd = process.cwd()): string[] {
  const dir = snapshotsDir(cwd);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join(dir, name));
}

export function loadLatestSnapshot(cwd = process.cwd()): SyncSnapshot | null {
  const files = listSnapshotFiles(cwd);
  if (files.length === 0) return null;
  const latest = files[files.length - 1]!;
  return JSON.parse(readFileSync(latest, "utf8")) as SyncSnapshot;
}

export function writeSnapshot(snapshot: SyncSnapshot, cwd = process.cwd()): string {
  const dir = ensureSnapshotsDir(cwd);
  const filePath = path.join(dir, `${snapshot.id}.json`);
  writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf8");
  // Maintain pointer to latest for consumers
  writeFileSync(path.join(dir, "latest.json"), JSON.stringify(snapshot, null, 2), "utf8");
  return filePath;
}

export function loadSnapshotById(id: string, cwd = process.cwd()): SyncSnapshot | null {
  const filePath = path.join(snapshotsDir(cwd), `${id}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8")) as SyncSnapshot;
}
