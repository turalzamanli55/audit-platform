/**
 * Import / export graph from TypeScript sources.
 */
import { readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import ts from "typescript";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";
import type { ExportRecord, ImportEdge, SymbolKind } from "@/lib/platform-audit/evidence-engine/types";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";

export type ImportGraph = {
  edges: ImportEdge[];
  exports: ExportRecord[];
  /** file -> files it imports (resolved relative/alias when possible) */
  dependents: Map<string, Set<string>>;
  dependencies: Map<string, Set<string>>;
};

function resolveImport(cwd: string, fromFile: string, specifier: string): string | null {
  if (specifier.startsWith("@/")) {
    return `src/${specifier.slice(2)}`.replace(/\\/g, "/");
  }
  if (specifier.startsWith(".")) {
    const fromAbs = join(cwd, fromFile);
    const resolved = normalize(join(dirname(fromAbs), specifier)).replace(/\\/g, "/");
    const root = cwd.replace(/\\/g, "/");
    if (resolved.startsWith(root)) {
      return resolved.slice(root.length + 1);
    }
  }
  return null;
}

export function buildImportGraph(cwd: string, ast: AstIndex): ImportGraph {
  const edges: ImportEdge[] = [];
  const exports: ExportRecord[] = [];
  const dependents = new Map<string, Set<string>>();
  const dependencies = new Map<string, Set<string>>();

  for (const symbol of ast.symbols) {
    if (!symbol.exported) continue;
    exports.push({
      filePath: symbol.filePath,
      name: symbol.name,
      kind: symbol.kind as SymbolKind,
    });
  }

  const files = walkFiles(join(cwd, "src"), [".ts", ".tsx"]);
  for (const absolute of files) {
    const fromFile = toRepoPath(cwd, absolute);
    let sourceText: string;
    try {
      sourceText = readFileSync(absolute, "utf8");
    } catch {
      continue;
    }
    const scriptKind = absolute.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(absolute, sourceText, ts.ScriptTarget.Latest, true, scriptKind);

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const toModule = node.moduleSpecifier.text;
        const names: string[] = [];
        const clause = node.importClause;
        if (clause?.name) names.push(clause.name.text);
        if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const el of clause.namedBindings.elements) {
            names.push(el.name.text);
          }
        }
        const resolvedPath = resolveImport(cwd, fromFile, toModule);
        edges.push({ fromFile, toModule, resolvedPath, names });
        if (resolvedPath) {
          if (!dependencies.has(fromFile)) dependencies.set(fromFile, new Set());
          dependencies.get(fromFile)!.add(resolvedPath);
          if (!dependents.has(resolvedPath)) dependents.set(resolvedPath, new Set());
          dependents.get(resolvedPath)!.add(fromFile);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  return { edges, exports, dependents, dependencies };
}

export function filesUsingModule(graph: ImportGraph, moduleRoot: string): string[] {
  const prefix = moduleRoot.replace(/\\/g, "/");
  const users = new Set<string>();
  for (const edge of graph.edges) {
    if (!edge.resolvedPath) continue;
    if (
      edge.resolvedPath === prefix ||
      edge.resolvedPath.startsWith(`${prefix}/`) ||
      edge.resolvedPath.startsWith(`${prefix}.`)
    ) {
      users.add(edge.fromFile);
    }
  }
  return [...users];
}
