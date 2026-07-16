/**
 * Test evidence resolution via AST imports of module symbols + co-located tests.
 */
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import type { ImportGraph } from "@/lib/platform-audit/evidence-engine/imports";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";

export function resolveTests(input: {
  moduleId: string;
  roots: string[];
  aliases: string[];
  ast: AstIndex;
  graph: ImportGraph;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);

  for (const symbol of input.ast.symbols) {
    if (!/\.test\.(ts|tsx)$|\.spec\.(ts|tsx)$/.test(symbol.filePath)) continue;
    const underRoot = input.roots.some((root) => symbol.filePath.startsWith(root));
    const aliasHit = aliasNorm.some((alias) => symbol.filePath.toLowerCase().includes(alias));
    if (!underRoot && !aliasHit) continue;
    items.push(
      scoreItem({
        kind: "test",
        path: symbol.filePath,
        symbol: symbol.name,
        verified: true,
        reasons: ["test file with parsed symbols"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  // Tests that import module roots
  for (const edge of input.graph.edges) {
    if (!/\.test\.(ts|tsx)$|\.spec\.(ts|tsx)$/.test(edge.fromFile)) continue;
    if (!edge.resolvedPath) continue;
    const hitsRoot = input.roots.some(
      (root) => edge.resolvedPath === root || edge.resolvedPath!.startsWith(`${root}/`),
    );
    if (!hitsRoot) continue;
    items.push(
      scoreItem({
        kind: "test",
        path: edge.fromFile,
        verified: true,
        reasons: [`imports implementation ${edge.resolvedPath}`],
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
