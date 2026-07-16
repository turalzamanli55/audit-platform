/**
 * AI resolution — semantic aliases + exports/imports, not folder-name equality.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { AI_AREA_ALIASES } from "@/lib/platform-audit/evidence-engine/aliases";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import type { ImportGraph } from "@/lib/platform-audit/evidence-engine/imports";
import { exportsUnder } from "@/lib/platform-audit/evidence-engine/exports";
import type { AiAreaResolution } from "@/lib/platform-audit/evidence-engine/types";
import { CONFIDENCE_WEIGHT } from "@/lib/platform-audit/evidence-engine/types";
import { listImmediateChildren, walkFiles, toRepoPath, directoryHasFiles } from "@/lib/platform-audit/utils";

export const AI_AREAS = [
  "foundation",
  "context_engine",
  "knowledge_engine",
  "memory_engine",
  "planner",
  "prompt_builder",
  "providers",
  "skills",
  "knowledge_graph",
  "tools",
  "orchestrator",
  "pipeline",
  "host",
  "workspace",
] as const;

export function resolveAiAreas(input: {
  cwd: string;
  ast: AstIndex;
  graph: ImportGraph;
}): AiAreaResolution[] {
  const aiRoot = join(input.cwd, "src", "lib", "ai");
  if (!existsSync(aiRoot)) {
    return AI_AREAS.map((areaId) => ({
      areaId,
      aliases: AI_AREA_ALIASES[areaId] ?? [areaId],
      present: false,
      confidence: "missing" as const,
      confidencePct: 0,
      evidencePaths: [],
      exportNames: [],
      reason: "src/lib/ai missing",
    }));
  }

  const children = listImmediateChildren(aiRoot);
  const results: AiAreaResolution[] = [];

  for (const areaId of AI_AREAS) {
    const aliases = AI_AREA_ALIASES[areaId] ?? [areaId];
    const matchedDirs = children.filter((child) =>
      aliases.some(
        (alias) =>
          child === alias ||
          child.replace(/-/g, "") === alias.replace(/-/g, "") ||
          child.includes(alias) ||
          alias.includes(child),
      ),
    );

    const evidencePaths: string[] = [];
    const exportNames: string[] = [];

    for (const dir of matchedDirs) {
      const absolute = join(aiRoot, dir);
      if (!directoryHasFiles(absolute, [".ts", ".tsx"])) continue;
      evidencePaths.push(`src/lib/ai/${dir}`);
      const records = exportsUnder(input.graph, [`src/lib/ai/${dir}`]);
      for (const record of records.slice(0, 20)) {
        exportNames.push(record.name);
        evidencePaths.push(record.filePath);
      }
    }

    // Import dependents of matched AI dirs
    let importUsers = 0;
    for (const path of evidencePaths) {
      for (const edge of input.graph.edges) {
        if (edge.resolvedPath && (edge.resolvedPath === path || edge.resolvedPath.startsWith(`${path}/`))) {
          importUsers += 1;
        }
      }
    }

    // Symbol-level: exported engines/planners etc.
    const areaTokens = aliases.flatMap((a) => a.split(/[-_]/));
    for (const symbol of input.ast.symbols) {
      if (!symbol.filePath.startsWith("src/lib/ai/")) continue;
      if (!symbol.exported) continue;
      if (
        areaTokens.some((token) => token.length >= 4 && symbol.name.toLowerCase().includes(token)) ||
        matchedDirs.some((dir) => symbol.filePath.startsWith(`src/lib/ai/${dir}`))
      ) {
        exportNames.push(symbol.name);
        evidencePaths.push(symbol.filePath);
      }
    }

    const uniquePaths = [...new Set(evidencePaths)];
    const uniqueExports = [...new Set(exportNames)];

    let confidence: AiAreaResolution["confidence"] = "missing";
    let reason = "no AI implementation evidence";
    if (uniqueExports.length > 0 && importUsers > 0) {
      confidence = "verified";
      reason = `exported symbols + ${importUsers} import edges`;
    } else if (uniqueExports.length > 0) {
      confidence = "strong";
      reason = "exported AI symbols under aliased directories";
    } else if (matchedDirs.length > 0 && uniquePaths.length > 0) {
      confidence = "strong";
      reason = `aliased directories present: ${matchedDirs.join(", ")}`;
    } else if (matchedDirs.length > 0) {
      confidence = "weak";
      reason = "alias directory matched but empty";
    }

    results.push({
      areaId,
      aliases,
      present: confidence !== "missing",
      confidence,
      confidencePct: CONFIDENCE_WEIGHT[confidence],
      evidencePaths: uniquePaths.slice(0, 30),
      exportNames: uniqueExports.slice(0, 30),
      reason,
    });
  }

  return results;
}

/** Scan AI host bindings / everywhere surfaces. */
export function resolveAiHostBindings(cwd: string): string[] {
  const paths: string[] = [];
  for (const relative of [
    "src/lib/ai/host",
    "src/lib/ai/pipeline",
    "src/lib/ai/orchestrator",
    "src/lib/ai/ui",
  ]) {
    const absolute = join(cwd, relative);
    if (existsSync(absolute)) paths.push(relative);
  }
  for (const file of walkFiles(join(cwd, "src", "lib", "ai"), [".ts"]).slice(0, 200)) {
    const source = readFileSync(file, "utf8");
    if (/everywhere|host\.execute|runPipeline|orchestrat/i.test(source)) {
      paths.push(toRepoPath(cwd, file));
    }
  }
  return [...new Set(paths)].slice(0, 40);
}
