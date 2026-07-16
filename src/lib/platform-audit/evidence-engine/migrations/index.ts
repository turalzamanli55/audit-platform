/**
 * Migration evidence — SQL object names matching module aliases.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

export function resolveMigrations(input: {
  moduleId: string;
  aliases: string[];
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const dir = join(input.cwd, "supabase", "migrations");
  if (!existsSync(dir)) return items;

  const aliasNorm = input.aliases
    .map((a) => a.toLowerCase().replace(/-/g, "_"))
    .filter((a) => a.length >= 3);

  for (const absolute of walkFiles(dir, [".sql"])) {
    const relative = toRepoPath(input.cwd, absolute);
    const source = readFileSync(absolute, "utf8");
    const lower = `${relative}\n${source}`.toLowerCase();
    const hit = aliasNorm.find((alias) => lower.includes(alias) || lower.includes(alias.replace(/_/g, "-")));
    if (!hit) continue;

    const hasTable = /create\s+table/i.test(source);
    const hasPolicy = /create\s+policy|enable\s+row\s+level\s+security/i.test(source);

    items.push(
      scoreItem({
        kind: "migration",
        path: relative,
        verified: hasTable,
        strong: hasTable || hasPolicy,
        indirect: !hasTable && !hasPolicy,
        reasons: [
          `alias hit=${hit}`,
          hasTable ? "CREATE TABLE" : "no table",
          hasPolicy ? "RLS/policy" : "no policy",
        ],
        moduleIds: [input.moduleId],
      }),
    );
  }

  return dedupe(items);
}

function dedupe(items: EvidenceItem[]): EvidenceItem[] {
  const map = new Map<string, EvidenceItem>();
  for (const item of items) {
    const prior = map.get(item.path);
    if (!prior || item.confidencePct > prior.confidencePct) map.set(item.path, item);
  }
  return [...map.values()];
}

export function resolveDatabase(input: {
  moduleId: string;
  aliases: string[];
  cwd: string;
  migrationItems: EvidenceItem[];
}): EvidenceItem[] {
  // Database evidence mirrors migration when tables/policies exist; also supabase types.
  const items: EvidenceItem[] = [...input.migrationItems.map((item) => ({
    ...item,
    kind: "database" as const,
  }))];

  const typesPath = join(input.cwd, "src", "types", "supabase.ts");
  if (existsSync(typesPath)) {
    const source = readFileSync(typesPath, "utf8").toLowerCase();
    const aliasNorm = input.aliases
      .map((a) => a.toLowerCase().replace(/-/g, "_"))
      .filter((a) => a.length >= 3);
    if (aliasNorm.some((alias) => source.includes(alias))) {
      items.push(
        scoreItem({
          kind: "database",
          path: "src/types/supabase.ts",
          strong: true,
          reasons: ["generated supabase types reference module alias"],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  return dedupe(items);
}
