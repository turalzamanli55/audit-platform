import type {
  FsRenderLayout,
  FsRenderPresentation,
  FsRenderedStatementBundle,
} from "@/types/fs-rendering";

export function searchRenderEntities(input: {
  query: string;
  presentation: FsRenderPresentation | null;
  layouts: FsRenderLayout[];
  bundle: FsRenderedStatementBundle | null;
}): Array<{ kind: "statement" | "line" | "layout"; id: string; label: string; meta: string }> {
  const q = input.query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{ kind: "statement" | "line" | "layout"; id: string; label: string; meta: string }> = [];

  for (const layout of input.layouts) {
    const hay = `${layout.layoutCode} ${layout.layoutName} ${layout.layoutMode}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "layout",
        id: layout.id,
        label: layout.layoutName,
        meta: layout.layoutMode,
      });
    }
  }

  for (const statement of input.bundle?.statements ?? []) {
    if (statement.title.toLowerCase().includes(q) || statement.statementType.includes(q)) {
      results.push({
        kind: "statement",
        id: statement.statementType,
        label: statement.title,
        meta: statement.statementType,
      });
    }
    for (const line of statement.lines) {
      const hay = `${line.lineCode} ${line.label}`.toLowerCase();
      if (hay.includes(q)) {
        results.push({
          kind: "line",
          id: line.lineCode,
          label: line.label,
          meta: `${statement.title} · ${line.formattedAmount}`,
        });
      }
    }
  }

  return results.slice(0, 100);
}
