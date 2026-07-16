import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadMigrations } from "@/lib/database-governance/audit";
import { LLM_PLATFORM_VERSION } from "@/lib/ai/constants";
import type { VersionManifest } from "@/lib/devops/types";

function readPackageVersion(cwd: string): string {
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      version?: string;
    };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function readDocumentationVersion(cwd: string): string {
  const bible = join(cwd, "docs", "PROJECT_BIBLE.md");
  if (!existsSync(bible)) return "0.0.0";
  const source = readFileSync(bible, "utf8");
  const part16 = source.match(/\| 0\.16\.0 \|/);
  if (part16) return "0.16.0";
  const version = source.match(/\|\s*Version\s*\|\s*([0-9.]+)\s*\|/);
  return version?.[1] ?? "0.0.0";
}

/**
 * Versioning — tracks platform, schema, migration, capability, docs, AI versions.
 */
export function buildVersionManifest(cwd = process.cwd()): VersionManifest {
  const migrations = loadMigrations(cwd);
  const last = migrations.at(-1);
  return {
    platformVersion: readPackageVersion(cwd),
    schemaVersion: last?.timestamp ?? "0",
    migrationVersion: last?.id ?? "none",
    migrationCount: migrations.length,
    capabilityVersion: "epbse-sync",
    documentationVersion: readDocumentationVersion(cwd),
    aiVersion: LLM_PLATFORM_VERSION ?? "unknown",
    generatedAt: new Date().toISOString(),
  };
}

export function formatVersionManifest(manifest: VersionManifest): string {
  return [
    "Version Manifest",
    "",
    `Platform: ${manifest.platformVersion}`,
    `Schema: ${manifest.schemaVersion}`,
    `Migration: ${manifest.migrationVersion} (${manifest.migrationCount})`,
    `Capability: ${manifest.capabilityVersion}`,
    `Documentation: ${manifest.documentationVersion}`,
    `AI: ${manifest.aiVersion}`,
    `Generated: ${manifest.generatedAt}`,
  ].join("\n");
}
