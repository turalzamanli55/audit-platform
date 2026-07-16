/**
 * Repository resolution via AST class/factory/interface signals.
 */
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import type { ImportGraph } from "@/lib/platform-audit/evidence-engine/imports";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { filesUsingModule } from "@/lib/platform-audit/evidence-engine/imports";

export function resolveRepositories(input: {
  moduleId: string;
  roots: string[];
  ast: AstIndex;
  graph: ImportGraph;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const rootSet = input.roots;

  for (const symbol of input.ast.symbols) {
    const underRoot = rootSet.some(
      (root) => symbol.filePath === root || symbol.filePath.startsWith(`${root}/`),
    );
    if (!underRoot) continue;

    if (symbol.isRepository || symbol.kind === "repository") {
      items.push(
        scoreItem({
          kind: "repository",
          path: symbol.filePath,
          symbol: symbol.name,
          verified: symbol.exported && symbol.isRepository,
          strong: symbol.isRepository,
          reasons: [
            symbol.exported ? "exported repository symbol" : "repository symbol",
            `AST kind=${symbol.kind}`,
          ],
          moduleIds: [input.moduleId],
        }),
      );
    } else if (/repository/i.test(symbol.filePath) && symbol.exported) {
      items.push(
        scoreItem({
          kind: "repository",
          path: symbol.filePath,
          symbol: symbol.name,
          strong: true,
          reasons: ["file under repository root with exported symbol"],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  // Interfaces named *Repository
  for (const symbol of input.ast.symbols) {
    if (symbol.kind !== "interface") continue;
    if (!/Repository$/i.test(symbol.name)) continue;
    const underRoot = rootSet.some(
      (root) => symbol.filePath === root || symbol.filePath.startsWith(`${root}/`),
    );
    if (!underRoot) continue;
    items.push(
      scoreItem({
        kind: "repository",
        path: symbol.filePath,
        symbol: symbol.name,
        strong: true,
        reasons: ["repository interface"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  // Import-graph usage elevates to indirect if only consumers exist
  for (const root of rootSet) {
    const users = filesUsingModule(input.graph, root);
    if (users.length > 0 && items.length === 0) {
      items.push(
        scoreItem({
          kind: "repository",
          path: root,
          indirect: true,
          reasons: [`imported by ${users.length} files`],
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
