/** Client-side export helpers for the Platform Console (CSV + JSON downloads). */

function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, columns: string[], rows: (string | number | null)[][]): void {
  const header = columns.map(csvValue).join(",");
  const body = rows.map((row) => row.map(csvValue).join(",")).join("\n");
  triggerDownload([header, body].filter(Boolean).join("\n"), filename, "text/csv");
}

export function downloadJson(filename: string, data: unknown): void {
  triggerDownload(JSON.stringify(data, null, 2), filename, "application/json");
}

export function timestampedName(prefix: string, ext: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.${ext}`;
}
