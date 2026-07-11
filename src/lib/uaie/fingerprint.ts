import { createHash } from "crypto";
import type { UaieSheetMatrix } from "@/types/uaie";
import { normalizeAccountingHeader } from "@/lib/uaie/normalize";

export function sha256Hex(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

export function hashWorkbookPayload(payload: string | Buffer): string {
  return sha256Hex(payload);
}

export function hashHeaders(headers: string[]): string {
  return sha256Hex(headers.map((h) => normalizeAccountingHeader(h)).join("|"));
}

export function buildLayoutFingerprint(input: {
  sheetName: string;
  headerRowIndex: number;
  columnCount: number;
  mappings: Array<{ index: number; field: string }>;
  erp: string;
}): string {
  const mappingPart = input.mappings
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((m) => `${m.index}:${m.field}`)
    .join(",");
  return sha256Hex(
    [
      input.erp,
      normalizeAccountingHeader(input.sheetName),
      String(input.headerRowIndex),
      String(input.columnCount),
      mappingPart,
    ].join("::"),
  );
}

export function previewRows(sheet: UaieSheetMatrix, limit = 12): string[][] {
  return sheet.rows.slice(0, limit).map((row) =>
    row.map((cell) => (cell == null ? "" : String(cell))),
  );
}
