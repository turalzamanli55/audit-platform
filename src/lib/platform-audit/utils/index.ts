/**
 * Shared filesystem scanning utilities for EPAC evidence discovery.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  ".git",
  "coverage",
  "data",
]);

export function walkFiles(
  dir: string,
  extensions: string[],
  files: string[] = [],
): string[] {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkFiles(absolute, extensions, files);
      continue;
    }
    if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(absolute);
    }
  }
  return files;
}

export function toRepoPath(cwd: string, absolute: string): string {
  return relative(cwd, absolute).replace(/\\/g, "/");
}

export function listImmediateChildren(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function fileExists(cwd: string, relativePath: string): boolean {
  return existsSync(join(cwd, relativePath));
}

export function readText(cwd: string, relativePath: string): string | null {
  const path = join(cwd, relativePath);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

export function countFiles(dir: string, extensions: string[]): number {
  return walkFiles(dir, extensions).length;
}

export function directoryHasFiles(dir: string, extensions: string[]): boolean {
  return countFiles(dir, extensions) > 0;
}

export function matchToken(haystack: string, tokens: string[]): boolean {
  const lower = haystack.toLowerCase();
  return tokens.some((token) => token.length >= 3 && lower.includes(token.toLowerCase()));
}

export function tokenize(...parts: Array<string | undefined | null>): string[] {
  const tokens = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const token of part
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((value) => value.length >= 3)) {
      tokens.add(token);
    }
  }
  return [...tokens];
}

export function safeStatMtime(path: string): string | null {
  if (!existsSync(path)) return null;
  return statSync(path).mtime.toISOString();
}
