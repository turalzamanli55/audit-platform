/**
 * Permissions evidence — permission codes, role repos, auth guards.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

export function resolvePermissions(input: {
  moduleId: string;
  aliases: string[];
  roots: string[];
  ast: AstIndex;
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);
  const isAuthModule = aliasNorm.some((a) =>
    ["auth", "security", "permission", "role", "authentication"].includes(a),
  );

  for (const symbol of input.ast.symbols) {
    if (!/permission|authorize|can[A-Z]|requireRole|rbac/i.test(symbol.name) &&
        !/permission|auth|security|role/i.test(symbol.filePath)) {
      continue;
    }
    const relevant =
      isAuthModule ||
      input.roots.some((root) => symbol.filePath.startsWith(root)) ||
      aliasNorm.some((alias) => symbol.filePath.toLowerCase().includes(alias));
    if (!relevant) continue;
    items.push(
      scoreItem({
        kind: "permission",
        path: symbol.filePath,
        symbol: symbol.name,
        verified: symbol.exported,
        strong: true,
        reasons: ["permission/auth symbol"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  for (const dir of ["permission", "role", "auth", "security"]) {
    const repo = join(input.cwd, "src", "repositories", dir);
    if (!existsSync(repo)) continue;
    if (!isAuthModule && !aliasNorm.includes(dir)) continue;
    for (const file of walkFiles(repo, [".ts"])) {
      items.push(
        scoreItem({
          kind: "permission",
          path: toRepoPath(input.cwd, file),
          strong: true,
          reasons: [`${dir} repository`],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  // Permission string constants referencing module
  const permFiles = walkFiles(join(input.cwd, "src"), [".ts"]).filter((f) =>
    /permission/i.test(f),
  );
  for (const absolute of permFiles.slice(0, 80)) {
    const relative = toRepoPath(input.cwd, absolute);
    const source = readFileSync(absolute, "utf8");
    if (aliasNorm.some((alias) => alias.length >= 4 && source.toLowerCase().includes(alias))) {
      items.push(
        scoreItem({
          kind: "permission",
          path: relative,
          indirect: true,
          reasons: ["permission catalog references module alias"],
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
