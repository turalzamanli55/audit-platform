import { createHash } from "node:crypto";
import type { GovernanceDocumentId } from "@/lib/project-sync/types";

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function stableId(kind: string, name: string): string {
  return `${kind}_${slugify(name)}`;
}

export function round2(value: number): number {
  return Number(value.toFixed(2));
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return round2(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function documentFileName(id: GovernanceDocumentId): string {
  switch (id) {
    case "PROJECT_BIBLE":
      return "PROJECT_BIBLE.md";
    case "MASTER_PRD":
      return "MASTER_PRD.md";
    case "SYSTEM_ARCHITECTURE":
      return "SYSTEM_ARCHITECTURE.md";
    case "IMPLEMENTATION_STANDARD":
      return "IMPLEMENTATION_STANDARD.md";
    case "MASTER_IMPLEMENTATION_TEMPLATE":
      return "MASTER_IMPLEMENTATION_TEMPLATE.md";
    case "DESIGN_SYSTEM":
      return "DESIGN_SYSTEM.md";
    default:
      return `${id}.md`;
  }
}

export function includesAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase();
  return needles.some((needle) => lower.includes(needle.toLowerCase()));
}
