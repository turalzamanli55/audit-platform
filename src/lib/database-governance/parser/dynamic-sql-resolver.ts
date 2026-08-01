import {
  applySqlFormat,
  resolveFormatArg,
} from "@/lib/database-governance/parser/sql-format";
import {
  blankExecuteTemplates,
  extractStatementSegments,
  findMatchingParen,
  replaceExecuteFormatCalls,
  splitFormatCall,
} from "@/lib/database-governance/parser/statement-extractor";
import type { ResolvedSqlUnit } from "@/lib/database-governance/parser/types";

/**
 * Resolve dynamic SQL (DO blocks, FOREACH/FOR loops, EXECUTE format/USING)
 * into concrete SQL units equivalent to static DDL.
 */
export function resolveDynamicSql(cleanedSql: string): ResolvedSqlUnit[] {
  const units: ResolvedSqlUnit[] = [];
  const segments = extractStatementSegments(cleanedSql);

  for (const segment of segments) {
    if (segment.kind === "static") {
      units.push({
        sql: blankExecuteTemplates(segment.sql),
        source: { mode: "static", location: `static:${segment.start}` },
      });
      continue;
    }

    units.push(
      ...resolvePlpgsqlBody(segment.body, {
        mode: "dynamic",
        location: `do_block:${segment.start}`,
      }),
    );
  }

  return units;
}

function resolvePlpgsqlBody(
  body: string,
  baseSource: ResolvedSqlUnit["source"],
): ResolvedSqlUnit[] {
  const units: ResolvedSqlUnit[] = [];
  let remaining = body;

  // Expand FOREACH / FOR … ARRAY loops first (produces concrete EXECUTE bodies).
  const loopExpanded = expandArrayLoops(remaining, baseSource);
  if (loopExpanded.expanded) {
    units.push(...loopExpanded.units);
    remaining = loopExpanded.residual;
  }

  // Resolve EXECUTE statements with available bindings (none at top level).
  units.push(...resolveExecuteStatements(remaining, {}, baseSource));

  // Keep non-EXECUTE DDL inside DO blocks (IF/ALTER etc.) as static-in-dynamic.
  const withoutExecute = blankExecuteTemplates(remaining);
  units.push({
    sql: withoutExecute,
    source: { ...baseSource, location: `${baseSource.location}/body` },
  });

  return units;
}

type LoopExpandResult = {
  expanded: boolean;
  units: ResolvedSqlUnit[];
  residual: string;
};

function expandArrayLoops(
  body: string,
  baseSource: ResolvedSqlUnit["source"],
): LoopExpandResult {
  const units: ResolvedSqlUnit[] = [];
  let residual = body;
  let expanded = false;

  const patterns: RegExp[] = [
    /FOREACH\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+IN\s+ARRAY\s+ARRAY\s*\[([\s\S]*?)\]\s*LOOP\s*([\s\S]*?)\s*END\s+LOOP/gi,
    /FOR\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+IN\s+ARRAY\s*\[([\s\S]*?)\]\s*LOOP\s*([\s\S]*?)\s*END\s+LOOP/gi,
  ];

  for (const pattern of patterns) {
    residual = residual.replace(pattern, (_full, varName, arrayBody, loopBody) => {
      expanded = true;
      const values = [...String(arrayBody).matchAll(/'((?:''|[^'])*)'/g)].map((m) =>
        m[1]!.replace(/''/g, "'"),
      );
      for (const value of values) {
        const bindings = { [String(varName)]: value };
        const location = `${baseSource.location}/foreach:${varName}=${value}`;
        units.push(
          ...resolveExecuteStatements(String(loopBody), bindings, {
            mode: "dynamic",
            location,
          }),
        );
        // Also expose any non-EXECUTE SQL in the loop body with substitutions.
        const nonExec = blankExecuteTemplates(String(loopBody));
        const substituted = substituteIdentifiers(nonExec, bindings);
        if (substituted.trim()) {
          units.push({
            sql: substituted,
            source: { mode: "dynamic", location: `${location}/body` },
          });
        }
      }
      return " ";
    });
  }

  // FOR record IN SELECT … LOOP — expand only when SELECT is a VALUES list of literals.
  residual = residual.replace(
    /FOR\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+IN\s+SELECT\s+([\s\S]*?)\s+LOOP\s*([\s\S]*?)\s*END\s+LOOP/gi,
    (full, varName, selectBody, loopBody) => {
      const values = extractSelectLiteralColumn(String(selectBody));
      if (values.length === 0) return full;
      expanded = true;
      for (const value of values) {
        const bindings = { [String(varName)]: value };
        const location = `${baseSource.location}/for_select:${varName}=${value}`;
        units.push(
          ...resolveExecuteStatements(String(loopBody), bindings, {
            mode: "dynamic",
            location,
          }),
        );
      }
      return " ";
    },
  );

  return { expanded, units, residual };
}

function extractSelectLiteralColumn(selectBody: string): string[] {
  // VALUES ('a'), ('b') or UNION ALL SELECT 'a'
  const values = [...selectBody.matchAll(/\(\s*'((?:''|[^'])*)'\s*\)/g)].map((m) =>
    m[1]!.replace(/''/g, "'"),
  );
  if (values.length > 0) return values;
  return [...selectBody.matchAll(/'\s*((?:''|[^'])*)'\s*/g)].map((m) =>
    m[1]!.replace(/''/g, "'"),
  );
}

function resolveExecuteStatements(
  sql: string,
  bindings: Record<string, string>,
  baseSource: ResolvedSqlUnit["source"],
): ResolvedSqlUnit[] {
  const units: ResolvedSqlUnit[] = [];
  const localBindings: Record<string, string> = { ...bindings };

  // Capture: var := format('template', args...)
  for (const match of sql.matchAll(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:=\s*format\s*\(/gi,
  )) {
    const varName = match[1]!;
    const openParen = (match.index ?? 0) + match[0]!.length - 1;
    const closed = findMatchingParen(sql, openParen);
    if (closed < 0) continue;
    const inner = sql.slice(openParen + 1, closed);
    const parsed = splitFormatCall(inner);
    if (!parsed) continue;
    const args = splitArgs(parsed.argsSql)
      .map((arg) => resolveFormatArg(arg, localBindings))
      .filter((arg): arg is string => arg !== null);
    if (args.length < countFormatSlots(parsed.template)) continue;
    localBindings[varName] = applySqlFormat(parsed.template, args);
  }

  // Capture: var := 'literal'
  for (const match of sql.matchAll(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:=\s*'((?:''|[^'])*)'/gi,
  )) {
    localBindings[match[1]!] = match[2]!.replace(/''/g, "'");
  }

  // EXECUTE format(...)
  replaceExecuteFormatCalls(sql, (_full, template, argsSql) => {
    const args = splitArgs(argsSql)
      .map((arg) => resolveFormatArg(arg, localBindings))
      .filter((arg): arg is string => arg !== null);

    const expectedSlots = countFormatSlots(template);
    if (args.length < expectedSlots) return " ";

    const concrete = applySqlFormat(template, args);
    units.push({
      sql: concrete,
      source: {
        mode: "dynamic",
        location: `${baseSource.location}/execute_format`,
        template,
      },
    });
    return " ";
  });

  // EXECUTE 'literal' [USING ...]
  for (const match of sql.matchAll(
    /\bEXECUTE\s+(?:STRICT\s+)?'((?:''|[^'])*)'(?:\s+USING\s+([^;]+))?/gi,
  )) {
    const template = match[1]!.replace(/''/g, "'");
    void match[2];
    units.push({
      sql: template,
      source: {
        mode: "dynamic",
        location: `${baseSource.location}/execute_literal`,
        template,
      },
    });
  }

  // EXECUTE $tag$…$tag$ [USING ...]
  for (const match of sql.matchAll(
    /\bEXECUTE\s+(?:STRICT\s+)?\$([a-zA-Z_]*)\$([\s\S]*?)\$\1\$(?:\s+USING\s+([^;]+))?/gi,
  )) {
    units.push({
      sql: match[2] ?? "",
      source: {
        mode: "dynamic",
        location: `${baseSource.location}/execute_dollar`,
        template: match[2],
      },
    });
  }

  // EXECUTE var [USING ...] where var holds resolved SQL
  for (const match of sql.matchAll(
    /\bEXECUTE\s+(?:STRICT\s+)?([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+USING\s+([^;]+))?/gi,
  )) {
    const varName = match[1]!;
    if (!(varName in localBindings)) continue;
    // Skip if this was actually EXECUTE format — format is not a binding key usually
    if (varName.toLowerCase() === "format") continue;
    units.push({
      sql: localBindings[varName]!,
      source: {
        mode: "dynamic",
        location: `${baseSource.location}/execute_using:${varName}`,
      },
    });
  }

  return units;
}

function splitArgs(argsSql: string): string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let inSingle = false;
  for (let i = 0; i < argsSql.length; i += 1) {
    const ch = argsSql[i]!;
    if (inSingle) {
      current += ch;
      if (ch === "'" && argsSql[i + 1] === "'") {
        current += argsSql[i + 1];
        i += 1;
        continue;
      }
      if (ch === "'") inSingle = false;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      current += ch;
      continue;
    }
    if (ch === "(") {
      depth += 1;
      current += ch;
      continue;
    }
    if (ch === ")") {
      depth -= 1;
      current += ch;
      continue;
    }
    if (ch === "," && depth === 0) {
      if (current.trim()) args.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function countFormatSlots(template: string): number {
  let count = 0;
  for (let i = 0; i < template.length; i += 1) {
    if (template[i] !== "%") continue;
    const next = template[i + 1];
    if (next === "%") {
      i += 1;
      continue;
    }
    if (next === "s" || next === "I" || next === "L") {
      count += 1;
      i += 1;
    }
  }
  return count;
}

function substituteIdentifiers(
  sql: string,
  bindings: Record<string, string>,
): string {
  let out = sql;
  for (const [name, value] of Object.entries(bindings)) {
    out = out.replace(new RegExp(`\\b${name}\\b`, "g"), value);
  }
  return out;
}

/** Exported for tests — resolve a single PL/pgSQL fragment. */
export function resolveDynamicFragment(
  plpgsqlBody: string,
  location = "fragment",
): ResolvedSqlUnit[] {
  return resolvePlpgsqlBody(plpgsqlBody, { mode: "dynamic", location });
}

// Re-export helpers used by tests / callers
export { findMatchingParen, splitFormatCall };
