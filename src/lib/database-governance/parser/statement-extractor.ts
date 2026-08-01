import type { ExtractedStatement, OperationSource } from "@/lib/database-governance/parser/types";

export type StatementSegment =
  | { kind: "static"; sql: string; start: number; end: number }
  | { kind: "do_block"; sql: string; body: string; start: number; end: number };

/**
 * Extract top-level SQL segments, isolating DO $$ … $$ blocks for dynamic resolution
 * while preserving their inner static DDL for normalization.
 */
export function extractStatementSegments(cleanedSql: string): StatementSegment[] {
  const segments: StatementSegment[] = [];
  const doRe = /\bDO\s+(\$[a-zA-Z_]*\$)([\s\S]*?)\1/gi;
  let cursor = 0;

  for (const match of cleanedSql.matchAll(doRe)) {
    const start = match.index ?? 0;
    const end = start + match[0]!.length;
    if (start > cursor) {
      segments.push({
        kind: "static",
        sql: cleanedSql.slice(cursor, start),
        start: cursor,
        end: start,
      });
    }
    const body = match[2] ?? "";
    segments.push({
      kind: "do_block",
      sql: match[0]!,
      body,
      start,
      end,
    });
    cursor = end;
  }

  if (cursor < cleanedSql.length) {
    segments.push({
      kind: "static",
      sql: cleanedSql.slice(cursor),
      start: cursor,
      end: cleanedSql.length,
    });
  }

  return segments;
}

/**
 * Build a static analysis view: DO bodies keep non-EXECUTE DDL, but EXECUTE format
 * templates are blanked so string literals cannot falsely match CREATE TRIGGER etc.
 */
export function buildStaticView(cleanedSql: string): string {
  const segments = extractStatementSegments(cleanedSql);
  let out = "";
  for (const segment of segments) {
    if (segment.kind === "static") {
      out += blankExecuteTemplates(segment.sql);
      continue;
    }
    out += blankExecuteTemplates(segment.body);
  }
  return out;
}

/**
 * Collect concrete statement units from static SQL (semicolon-separated, best-effort).
 */
export function extractStaticStatements(
  sql: string,
  source: OperationSource,
): ExtractedStatement[] {
  const blanked = blankExecuteTemplates(sql);
  const parts = blanked
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !/^(BEGIN|END|DECLARE|IF|THEN|ELSE|ELSIF|LOOP|NULL)$/i.test(part));

  return parts.map((part) => ({
    sql: part,
    source,
  }));
}

/**
 * Replace EXECUTE format(...) / EXECUTE '...' argument strings with spaces
 * so nested DDL templates are not parsed as static statements.
 */
export function blankExecuteTemplates(sql: string): string {
  let result = sql;
  result = replaceExecuteFormatCalls(result, () => " EXECUTE format('') ");
  result = result.replace(
    /EXECUTE\s+(?:STRICT\s+)?'(?:''|[^'])*'/gi,
    " EXECUTE '' ",
  );
  result = result.replace(
    /EXECUTE\s+(?:STRICT\s+)?\$([a-zA-Z_]*)\$[\s\S]*?\$\1\$/gi,
    " EXECUTE '' ",
  );
  return result;
}

function replaceExecuteFormatCalls(
  sql: string,
  replacer: (full: string, template: string, argsSql: string) => string,
): string {
  const re = /\bEXECUTE\s+(?:STRICT\s+)?format\s*\(/gi;
  let out = "";
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(sql)) !== null) {
    const openParen = (match.index ?? 0) + match[0]!.length - 1;
    const closed = findMatchingParen(sql, openParen);
    if (closed < 0) continue;
    const inner = sql.slice(openParen + 1, closed);
    const parsed = splitFormatCall(inner);
    if (!parsed) continue;
    out += sql.slice(last, match.index);
    out += replacer(sql.slice(match.index, closed + 1), parsed.template, parsed.argsSql);
    last = closed + 1;
    re.lastIndex = closed + 1;
  }
  out += sql.slice(last);
  return out;
}

export function findMatchingParen(sql: string, openIndex: number): number {
  let depth = 0;
  let inSingle = false;
  let dollarTag: string | null = null;
  for (let i = openIndex; i < sql.length; i += 1) {
    const ch = sql[i]!;
    if (dollarTag) {
      if (sql.startsWith(dollarTag, i)) {
        i += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }
    if (inSingle) {
      if (ch === "'" && sql[i + 1] === "'") {
        i += 1;
        continue;
      }
      if (ch === "'") inSingle = false;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === "$") {
      const tag = sql.slice(i).match(/^\$([a-zA-Z_]*)\$/);
      if (tag) {
        dollarTag = `$${tag[1]}$`;
        i += dollarTag.length - 1;
        continue;
      }
    }
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export function splitFormatCall(
  inner: string,
): { template: string; argsSql: string } | null {
  const trimmed = inner.trim();
  if (trimmed.startsWith("'")) {
    const end = readSingleQuoted(trimmed, 0);
    if (end < 0) return null;
    const template = trimmed
      .slice(1, end)
      .replace(/''/g, "'");
    const rest = trimmed.slice(end + 1).replace(/^\s*,\s*/, "");
    return { template, argsSql: rest };
  }
  const dollar = trimmed.match(/^\$([a-zA-Z_]*)\$([\s\S]*?)\$\1\$/);
  if (dollar) {
    const template = dollar[2] ?? "";
    const rest = trimmed.slice(dollar[0]!.length).replace(/^\s*,\s*/, "");
    return { template, argsSql: rest };
  }
  return null;
}

function readSingleQuoted(sql: string, start: number): number {
  if (sql[start] !== "'") return -1;
  for (let i = start + 1; i < sql.length; i += 1) {
    if (sql[i] === "'" && sql[i + 1] === "'") {
      i += 1;
      continue;
    }
    if (sql[i] === "'") return i;
  }
  return -1;
}

export { replaceExecuteFormatCalls };
