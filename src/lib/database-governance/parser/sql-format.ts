/**
 * Minimal PostgreSQL format() simulator for %s / %I / %L / %%.
 * Used to resolve EXECUTE format(...) templates into concrete SQL.
 */

export function applySqlFormat(template: string, args: string[]): string {
  let argIndex = 0;
  let out = "";
  for (let i = 0; i < template.length; i += 1) {
    const ch = template[i]!;
    if (ch !== "%") {
      out += ch;
      continue;
    }
    const next = template[i + 1];
    if (next === "%") {
      out += "%";
      i += 1;
      continue;
    }
    if (next === "s" || next === "I" || next === "L") {
      const value = args[argIndex] ?? "";
      argIndex += 1;
      if (next === "I") {
        out += quoteIdent(value);
      } else if (next === "L") {
        out += quoteLiteral(value);
      } else {
        out += value;
      }
      i += 1;
      continue;
    }
    out += ch;
  }
  return out;
}

function quoteIdent(value: string): string {
  if (/^[a-z_][a-z0-9_]*$/i.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function quoteLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Resolve argument expressions against a binding map.
 * Supports string literals and simple identifiers bound by FOREACH/FOR loops.
 */
export function resolveFormatArg(
  rawArg: string,
  bindings: Record<string, string>,
): string | null {
  const trimmed = rawArg.trim();
  const str = trimmed.match(/^'((?:\\'|[^'])*)'$/);
  if (str) return str[1]!.replace(/''/g, "'");
  const dollar = trimmed.match(/^\$([a-zA-Z_]*)\$([\s\S]*)\$\1\$$/);
  if (dollar) return dollar[2]!;
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed) && trimmed in bindings) {
    return bindings[trimmed]!;
  }
  return null;
}
