import ExcelJS from "exceljs";
import Papa from "papaparse";
import type { UaieCellValue, UaieSheetMatrix, UaieWorkbookScan } from "@/types/uaie";

function cellToValue(value: ExcelJS.CellValue): UaieCellValue {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "object") {
    if ("result" in value && value.result != null) {
      return cellToValue(value.result as ExcelJS.CellValue);
    }
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("");
    }
    if (value instanceof Date) return value.toISOString();
  }
  return String(value);
}

function detectDelimiter(sample: string): string {
  const firstLine = sample.split(/\r?\n/).find((line) => line.trim().length > 0) ?? "";
  const counts = {
    ",": (firstLine.match(/,/g) ?? []).length,
    ";": (firstLine.match(/;/g) ?? []).length,
    "\t": (firstLine.match(/\t/g) ?? []).length,
  };
  if (counts["\t"] >= counts[","] && counts["\t"] >= counts[";"]) return "\t";
  if (counts[";"] > counts[","]) return ";";
  return ",";
}

async function parseWorkbookBuffer(buffer: Buffer): Promise<UaieSheetMatrix[]> {
  const workbook = new ExcelJS.Workbook();
  // exceljs accepts both xlsx; older .xls may fail — caller falls back
  // @ts-expect-error exceljs buffer typing varies by version
  await workbook.xlsx.load(buffer);

  const sheets: UaieSheetMatrix[] = [];
  workbook.eachSheet((worksheet, id) => {
    const rows: UaieCellValue[][] = [];
    const columnCount = worksheet.columnCount || 0;
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (row.hidden) return;
      const values: UaieCellValue[] = [];
      for (let col = 1; col <= Math.max(columnCount, row.cellCount); col += 1) {
        const cell = row.getCell(col);
        // Skip purely empty trailing cells later; keep positional integrity
        values.push(cellToValue(cell.value));
      }
      // Drop fully empty rows
      if (values.every((v) => v == null || String(v).trim() === "")) return;
      rows.push(values);
    });
    sheets.push({
      name: worksheet.name || `Sheet${id}`,
      index: id - 1,
      rows,
    });
  });
  return sheets;
}

function parseDelimitedText(text: string, filename: string): UaieSheetMatrix[] {
  const delimiter = detectDelimiter(text);
  const parsed = Papa.parse<string[]>(text, {
    delimiter,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
  });

  const rows = (parsed.data ?? [])
    .map((row) => row.map((cell) => (cell == null || cell === "" ? null : cell)))
    .filter((row) => row.some((cell) => cell != null && String(cell).trim() !== ""));

  return [
    {
      name: filename.replace(/\.[^.]+$/, "") || "Sheet1",
      index: 0,
      rows,
    },
  ];
}

export async function parseAccountingUpload(input: {
  filename: string;
  mimeType?: string | null;
  bytes: Buffer;
}): Promise<UaieWorkbookScan> {
  const lower = input.filename.toLowerCase();
  const isCsv = lower.endsWith(".csv") || input.mimeType?.includes("csv");
  const isTsv = lower.endsWith(".tsv") || input.mimeType?.includes("tab-separated");
  const isExcel =
    lower.endsWith(".xlsx") ||
    lower.endsWith(".xls") ||
    Boolean(input.mimeType?.includes("spreadsheet") || input.mimeType?.includes("excel"));

  if (isCsv || isTsv) {
    const text = input.bytes.toString("utf8").replace(/^\uFEFF/, "");
    return {
      sheets: parseDelimitedText(text, input.filename),
      sourceFormat: isTsv ? "tsv" : "csv",
    };
  }

  if (isExcel || input.bytes.length > 0) {
    try {
      const sheets = await parseWorkbookBuffer(input.bytes);
      return {
        sheets,
        sourceFormat: lower.endsWith(".xls") && !lower.endsWith(".xlsx") ? "xls" : "xlsx",
      };
    } catch {
      // Some .xls or mislabeled files — attempt text parse
      const text = input.bytes.toString("utf8");
      if (text.includes(",") || text.includes(";") || text.includes("\t")) {
        return {
          sheets: parseDelimitedText(text, input.filename),
          sourceFormat: "csv",
        };
      }
      throw new Error("Unable to parse workbook. Supported formats: .xlsx, .xls, .csv, .tsv");
    }
  }

  throw new Error("Unsupported file format");
}
