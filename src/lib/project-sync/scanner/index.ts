import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import type { CodebaseEvidenceIndex } from "@/lib/project-sync/types";
import { nowIso } from "@/lib/project-sync/utils";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  ".turbo",
]);

/**
 * Implementation Discovery Scanner — filesystem evidence only.
 */
export function scanCodebase(cwd = process.cwd()): CodebaseEvidenceIndex {
  const src = path.join(cwd, "src");
  const supabase = path.join(cwd, "supabase", "migrations");
  const i18n = path.join(cwd, "src", "i18n");

  const repositories = listFiles(path.join(src, "repositories"), /\.ts$/).map(rel(cwd));
  const serverActions = listFiles(path.join(src, "lib", "actions"), /\.ts$/).map(rel(cwd));
  const components = listFiles(path.join(src, "components"), /\.(tsx|ts)$/).map(rel(cwd));
  const pages = listFiles(path.join(src, "app"), /page\.(tsx|ts)$/).map(rel(cwd));
  const tests = [
    ...listFiles(src, /\.test\.(ts|tsx)$/),
    ...listFiles(path.join(cwd, "tests"), /\.test\.(ts|tsx)$/),
  ].map(rel(cwd));
  const migrations = existsSync(supabase)
    ? listFiles(supabase, /\.sql$/).map(rel(cwd))
    : [];
  const locales = existsSync(path.join(i18n, "messages"))
    ? listFiles(path.join(i18n, "messages"), /\.json$/).map(rel(cwd))
    : [];
  const libModules = existsSync(path.join(src, "lib"))
    ? readdirSync(path.join(src, "lib"), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

  const permissionFiles = [
    ...listFiles(path.join(src, "constants"), /\.ts$/),
    ...migrations,
  ];
  const permissions = collectMatches(permissionFiles, /['"`]([a-z0-9_.]+\.[a-z0-9_.]+)['"`]/gi)
    .filter((code) => code.includes("."))
    .slice(0, 500);

  const tables = collectMatches(migrations, /CREATE TABLE(?: IF NOT EXISTS)?\s+(?:public\.)?([a-z0-9_]+)/gi);

  const todoMarkers = collectLineMarkers(
    [...repositories, ...serverActions].map((file) => path.join(cwd, file)),
    /\b(TODO|FIXME)\b/g,
  );
  const placeholderMarkers = collectLineMarkers(
    [...repositories, ...serverActions].map((file) => path.join(cwd, file)),
    /\b(PLACEHOLDER|mock data|lorem ipsum)\b/gi,
  );

  return {
    scannedAt: nowIso(),
    tables,
    repositories,
    serverActions,
    components,
    pages,
    routes: pages,
    permissions: [...new Set(permissions)],
    tests,
    migrations,
    locales,
    libModules,
    todoMarkers,
    placeholderMarkers,
  };
}

function rel(cwd: string) {
  return (absolute: string) => path.relative(cwd, absolute).replaceAll("\\", "/");
}

function listFiles(root: string, pattern: RegExp, maxFiles = 5000): string[] {
  if (!existsSync(root)) return [];
  const results: string[] = [];
  const stack = [root];
  while (stack.length > 0 && results.length < maxFiles) {
    const current = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      const normalized = full.replaceAll("\\", "/");
      if (pattern.test(entry.name) || pattern.test(normalized)) {
        results.push(full);
        if (results.length >= maxFiles) break;
      }
    }
  }
  return results;
}

function collectMatches(files: string[], pattern: RegExp): string[] {
  const found = new Set<string>();
  for (const file of files) {
    if (!existsSync(file)) continue;
    let content = "";
    try {
      if (statSync(file).size > 2_000_000) continue;
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content))) {
      if (match[1]) found.add(match[1]);
    }
  }
  return [...found];
}

function collectLineMarkers(
  files: string[],
  pattern: RegExp,
): Array<{ file: string; marker: string; line: number }> {
  const results: Array<{ file: string; marker: string; line: number }> = [];
  for (const file of files) {
    if (!existsSync(file)) continue;
    let content = "";
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      const match = line.match(pattern);
      if (match) {
        results.push({
          file: file.replaceAll("\\", "/"),
          marker: match[1] ?? match[0]!,
          line: index + 1,
        });
      }
    });
  }
  return results.slice(0, 500);
}
