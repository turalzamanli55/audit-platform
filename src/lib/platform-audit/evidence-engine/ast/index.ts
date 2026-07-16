/**
 * TypeScript AST analysis — detect symbols without relying on filenames.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";
import type { AstSymbol, SymbolKind } from "@/lib/platform-audit/evidence-engine/types";

function isPascalCase(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function classifyName(name: string, flags: {
  isServerActionFile: boolean;
  hasJsx: boolean;
}): SymbolKind {
  if (flags.isServerActionFile) return "serverAction";
  if (name.endsWith("Repository") || name.includes("Repository")) return "repository";
  if (name.startsWith("use") && isPascalCase(name.slice(3))) return "hook";
  if (name.endsWith("Provider")) return "provider";
  if (name.endsWith("Context")) return "context";
  if (flags.hasJsx && isPascalCase(name)) return "component";
  return "unknown";
}

function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

export function parseFileSymbols(cwd: string, absolutePath: string): AstSymbol[] {
  const sourceText = readFileSync(absolutePath, "utf8");
  const filePath = toRepoPath(cwd, absolutePath);
  const isServerActionFile = /["']use server["']/.test(sourceText.slice(0, 400));
  const hasJsx = absolutePath.endsWith(".tsx") || /<[A-Z][A-Za-z0-9]*/.test(sourceText);
  const scriptKind = absolutePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(absolutePath, sourceText, ts.ScriptTarget.Latest, true, scriptKind);
  const symbols: AstSymbol[] = [];

  const push = (name: string, kindHint: SymbolKind, node: ts.Node, exported: boolean) => {
    const classified = kindHint !== "unknown" ? kindHint : classifyName(name, { isServerActionFile, hasJsx });
    symbols.push({
      name,
      kind: classified,
      filePath,
      exported,
      line: lineOf(sourceFile, node),
      isServerActionFile,
      isReactComponent: classified === "component" || (hasJsx && isPascalCase(name) && exported),
      isRepository: classified === "repository" || /Repository/.test(name),
      isHook: classified === "hook",
      isProvider: classified === "provider",
      isContext: classified === "context",
    });
  };

  const visit = (node: ts.Node) => {
    if (ts.isClassDeclaration(node) && node.name) {
      const exported = hasExportModifier(node);
      push(node.name.text, /Repository/.test(node.name.text) ? "repository" : "class", node, exported);
    } else if (ts.isFunctionDeclaration(node) && node.name) {
      const exported = hasExportModifier(node);
      const kind = isServerActionFile ? "serverAction" : "function";
      push(node.name.text, kind, node, exported);
    } else if (ts.isVariableStatement(node)) {
      const exported = hasExportModifier(node);
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) continue;
        const name = decl.name.text;
        let kind: SymbolKind = "const";
        if (isServerActionFile && exported) kind = "serverAction";
        else if (name.startsWith("use")) kind = "hook";
        else if (name.endsWith("Provider")) kind = "provider";
        else if (name.endsWith("Context")) kind = "context";
        else if (hasJsx && isPascalCase(name)) kind = "component";
        else if (/Repository/.test(name)) kind = "repository";
        push(name, kind, decl, exported);
      }
    } else if (ts.isInterfaceDeclaration(node) && node.name) {
      push(node.name.text, "interface", node, hasExportModifier(node));
    } else if (ts.isTypeAliasDeclaration(node) && node.name) {
      push(node.name.text, "type", node, hasExportModifier(node));
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return symbols;
}

function hasExportModifier(node: ts.Node): boolean {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return Boolean(mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
}

export type AstIndex = {
  symbols: AstSymbol[];
  byFile: Map<string, AstSymbol[]>;
  filesScanned: number;
};

export function buildAstIndex(cwd: string): AstIndex {
  const files = [
    ...walkFiles(join(cwd, "src"), [".ts", ".tsx"]),
  ].filter((file) => !file.includes(`${join("src", "lib", "platform-audit", "data")}`));

  const symbols: AstSymbol[] = [];
  const byFile = new Map<string, AstSymbol[]>();

  for (const absolute of files) {
    try {
      const fileSymbols = parseFileSymbols(cwd, absolute);
      symbols.push(...fileSymbols);
      if (fileSymbols.length > 0) {
        byFile.set(fileSymbols[0]!.filePath, fileSymbols);
      }
    } catch {
      // Skip unparsable files — do not invent evidence.
    }
  }

  return { symbols, byFile, filesScanned: files.length };
}
