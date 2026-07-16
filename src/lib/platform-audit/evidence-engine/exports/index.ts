/**
 * Export index helpers.
 */
import type { ExportRecord } from "@/lib/platform-audit/evidence-engine/types";
import type { ImportGraph } from "@/lib/platform-audit/evidence-engine/imports";

export function exportsUnder(graph: ImportGraph, roots: string[]): ExportRecord[] {
  return graph.exports.filter((record) =>
    roots.some((root) => record.filePath === root || record.filePath.startsWith(`${root}/`)),
  );
}
