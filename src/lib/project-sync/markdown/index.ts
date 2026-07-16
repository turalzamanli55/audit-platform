export type MarkdownHeading = {
  level: number;
  title: string;
  start: number;
  end: number;
};

export type MarkdownTable = {
  headers: string[];
  rows: string[][];
  sectionTitle: string;
};

export function splitLines(content: string): string[] {
  return content.split(/\r?\n/);
}

export function extractHeadings(content: string): MarkdownHeading[] {
  const lines = splitLines(content);
  const headings: MarkdownHeading[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[index] ?? "");
    if (!match) continue;
    headings.push({
      level: match[1]!.length,
      title: match[2]!.trim(),
      start: index,
      end: lines.length,
    });
  }
  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index]!;
    const next = headings[index + 1];
    current.end = next ? next.start : lines.length;
  }
  return headings;
}

export function sectionBody(content: string, heading: MarkdownHeading): string {
  return splitLines(content).slice(heading.start + 1, heading.end).join("\n");
}

export function findHeading(
  headings: MarkdownHeading[],
  predicate: (title: string) => boolean,
): MarkdownHeading | undefined {
  return headings.find((heading) => predicate(heading.title));
}

export function parseMarkdownTables(sectionContent: string, sectionTitle: string): MarkdownTable[] {
  const lines = splitLines(sectionContent);
  const tables: MarkdownTable[] = [];
  let index = 0;
  while (index < lines.length) {
    const headerLine = lines[index] ?? "";
    const separatorLine = lines[index + 1] ?? "";
    if (
      headerLine.includes("|") &&
      /^\s*\|?[\s:-]+\|/.test(separatorLine)
    ) {
      const headers = splitRow(headerLine);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && (lines[index] ?? "").includes("|")) {
        const row = splitRow(lines[index] ?? "");
        if (row.length > 0) rows.push(row);
        index += 1;
      }
      tables.push({ headers, rows, sectionTitle });
      continue;
    }
    index += 1;
  }
  return tables;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().replace(/^\*\*(.+)\*\*$/, "$1"));
}

export function boldTokens(text: string): string[] {
  const matches = [...text.matchAll(/\*\*([^*]+)\*\*/g)];
  return matches.map((match) => match[1]!.trim());
}
