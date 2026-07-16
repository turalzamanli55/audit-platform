import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { DocumentAuthority, GovernanceDocumentId } from "@/lib/project-sync/types";
import { GOVERNANCE_DOCUMENTS } from "@/lib/project-sync/types";
import { documentFileName, hashContent } from "@/lib/project-sync/utils";

export type LoadedDocument = {
  id: GovernanceDocumentId;
  authority: DocumentAuthority;
  path: string;
  content: string;
  hash: string;
  bytes: number;
};

const AUTHORITY: Record<GovernanceDocumentId, DocumentAuthority> = {
  PROJECT_BIBLE: "primary",
  MASTER_PRD: "functional",
  SYSTEM_ARCHITECTURE: "architectural",
  IMPLEMENTATION_STANDARD: "implementation",
  MASTER_IMPLEMENTATION_TEMPLATE: "implementation_template",
  DESIGN_SYSTEM: "design",
};

export function resolveDocsRoot(cwd = process.cwd()): string {
  return path.join(cwd, "docs");
}

export function loadGovernanceDocument(
  id: GovernanceDocumentId,
  cwd = process.cwd(),
): LoadedDocument {
  const filePath = path.join(resolveDocsRoot(cwd), documentFileName(id));
  if (!existsSync(filePath)) {
    throw new Error(`Governance document missing: ${filePath}`);
  }
  const content = readFileSync(filePath, "utf8");
  return {
    id,
    authority: AUTHORITY[id],
    path: filePath,
    content,
    hash: hashContent(content),
    bytes: Buffer.byteLength(content, "utf8"),
  };
}

export function loadAllGovernanceDocuments(cwd = process.cwd()): LoadedDocument[] {
  return GOVERNANCE_DOCUMENTS.map((id) => loadGovernanceDocument(id, cwd));
}

/**
 * Conflict resolution: PROJECT_BIBLE always wins.
 * Other docs may enrich metadata but never override bible facts.
 */
export function documentPrecedence(id: GovernanceDocumentId): number {
  switch (id) {
    case "PROJECT_BIBLE":
      return 100;
    case "MASTER_PRD":
      return 80;
    case "SYSTEM_ARCHITECTURE":
      return 70;
    case "IMPLEMENTATION_STANDARD":
      return 60;
    case "MASTER_IMPLEMENTATION_TEMPLATE":
      return 50;
    case "DESIGN_SYSTEM":
      return 40;
    default:
      return 0;
  }
}
