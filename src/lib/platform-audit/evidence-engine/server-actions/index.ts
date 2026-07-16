/**
 * Server action resolution — "use server", action exports, registries.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

export function resolveServerActions(input: {
  moduleId: string;
  aliases: string[];
  roots: string[];
  ast: AstIndex;
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase());

  for (const symbol of input.ast.symbols) {
    if (!symbol.isServerActionFile && symbol.kind !== "serverAction") continue;
    const matchesModule =
      input.roots.some((root) => symbol.filePath.startsWith(root)) ||
      aliasNorm.some((alias) => alias.length >= 3 && symbol.filePath.toLowerCase().includes(alias));

    // Also match actions under src/lib/actions/<alias>
    const inActionsTree =
      symbol.filePath.includes("src/lib/actions/") || symbol.filePath.includes("src/actions/");

    if (!matchesModule && !inActionsTree) continue;
    if (inActionsTree && !aliasNorm.some((alias) => alias.length >= 3 && symbol.filePath.toLowerCase().includes(alias)) && !matchesModule) {
      continue;
    }

    items.push(
      scoreItem({
        kind: "serverAction",
        path: symbol.filePath,
        symbol: symbol.name,
        verified: symbol.isServerActionFile && symbol.exported,
        strong: symbol.isServerActionFile,
        reasons: [
          symbol.isServerActionFile ? `"use server" file` : "serverAction symbol",
          symbol.exported ? "exported" : "local",
        ],
        moduleIds: [input.moduleId],
      }),
    );
  }

  // Action registry / host bindings
  const registryCandidates = [
    "src/lib/actions/index.ts",
    "src/lib/ai/host/registry/index.ts",
    "src/lib/ai/actions/index.ts",
  ];
  for (const relative of registryCandidates) {
    const absolute = join(input.cwd, relative);
    if (!existsSync(absolute)) continue;
    const source = readFileSync(absolute, "utf8");
    if (aliasNorm.some((alias) => alias.length >= 4 && source.toLowerCase().includes(alias))) {
      items.push(
        scoreItem({
          kind: "serverAction",
          path: relative,
          strong: true,
          reasons: ["action/host registry references module alias"],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  // Scan action files for use server even if AST missed
  for (const absolute of [
    ...walkFiles(join(input.cwd, "src", "lib", "actions"), [".ts"]),
    ...walkFiles(join(input.cwd, "src", "actions"), [".ts"]),
  ]) {
    const relative = toRepoPath(input.cwd, absolute);
    if (!aliasNorm.some((alias) => alias.length >= 3 && relative.toLowerCase().includes(alias))) {
      continue;
    }
    const head = readFileSync(absolute, "utf8").slice(0, 500);
    if (/["']use server["']/.test(head)) {
      items.push(
        scoreItem({
          kind: "serverAction",
          path: relative,
          verified: true,
          reasons: [`"use server" directive in action module`],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  return dedupe(items);
}

function dedupe(items: EvidenceItem[]): EvidenceItem[] {
  const map = new Map<string, EvidenceItem>();
  for (const item of items) {
    const key = `${item.path}::${item.symbol ?? ""}`;
    const prior = map.get(key);
    if (!prior || item.confidencePct > prior.confidencePct) map.set(key, item);
  }
  return [...map.values()];
}
