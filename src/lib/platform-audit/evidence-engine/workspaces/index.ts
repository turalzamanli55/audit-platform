/**
 * Workspace shell / provider / layout resolution.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

export function resolveWorkspaces(input: {
  moduleId: string;
  aliases: string[];
  roots: string[];
  ast: AstIndex;
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);

  for (const symbol of input.ast.symbols) {
    const workspaceSignal =
      /workspace/i.test(symbol.name) ||
      /workspace/i.test(symbol.filePath) ||
      symbol.isProvider && /workspace/i.test(symbol.filePath);

    if (!workspaceSignal) continue;
    const relevant =
      input.roots.some((root) => symbol.filePath.startsWith(root)) ||
      aliasNorm.some((alias) => symbol.filePath.toLowerCase().includes(alias)) ||
      /workspace/i.test(symbol.filePath);

    if (!relevant) continue;

    items.push(
      scoreItem({
        kind: "workspace",
        path: symbol.filePath,
        symbol: symbol.name,
        verified: symbol.exported && (/Workspace/.test(symbol.name) || symbol.isProvider),
        strong: true,
        reasons: [
          symbol.isProvider ? "workspace provider" : "workspace symbol",
          symbol.exported ? "exported" : "local",
        ],
        moduleIds: [input.moduleId],
      }),
    );
  }

  // Layouts / shells on disk
  for (const absolute of walkFiles(join(input.cwd, "src"), [".tsx", ".ts"])) {
    const relative = toRepoPath(input.cwd, absolute);
    if (!/workspace/i.test(relative)) continue;
    if (
      !aliasNorm.some((alias) => relative.toLowerCase().includes(alias)) &&
      !/workspace/i.test(input.moduleId) &&
      input.moduleId !== "mod_workspace" &&
      input.moduleId !== "workspace"
    ) {
      // still count shared workspace shell as indirect for tenant modules
      if (!["mod_companies", "mod_company", "mod_engagements", "mod_engagement", "company", "engagement"].includes(input.moduleId)) {
        continue;
      }
      items.push(
        scoreItem({
          kind: "workspace",
          path: relative,
          indirect: true,
          reasons: ["shared workspace shell usable by module"],
          moduleIds: [input.moduleId],
        }),
      );
      continue;
    }
    items.push(
      scoreItem({
        kind: "workspace",
        path: relative,
        strong: true,
        reasons: ["workspace path artifact"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  const aiUi = join(input.cwd, "src", "lib", "ai", "ui");
  if (existsSync(aiUi) && (/ai/i.test(input.moduleId) || input.aliases.some((a) => a === "ai"))) {
    items.push(
      scoreItem({
        kind: "workspace",
        path: "src/lib/ai/ui",
        strong: true,
        reasons: ["AI workspace UI surface"],
        moduleIds: [input.moduleId],
      }),
    );
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
