/**
 * Component resolution via AST React symbols + roots.
 */
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";

export function resolveComponents(input: {
  moduleId: string;
  roots: string[];
  aliases: string[];
  ast: AstIndex;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);

  for (const symbol of input.ast.symbols) {
    if (!symbol.isReactComponent && symbol.kind !== "component") continue;
    const underRoot = input.roots.some(
      (root) => symbol.filePath === root || symbol.filePath.startsWith(`${root}/`),
    );
    const aliasHit = aliasNorm.some((alias) => symbol.filePath.toLowerCase().includes(alias));
    if (!underRoot && !aliasHit) continue;

    items.push(
      scoreItem({
        kind: "component",
        path: symbol.filePath,
        symbol: symbol.name,
        verified: symbol.exported && symbol.isReactComponent,
        strong: symbol.isReactComponent,
        reasons: ["React component symbol"],
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
