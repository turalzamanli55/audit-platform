/**
 * EPAC documents — load governance sources. PROJECT_BIBLE is primary authority.
 */
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const EPAC_GOVERNANCE_DOCUMENTS = [
  "PROJECT_BIBLE",
  "MASTER_PRD",
  "SYSTEM_ARCHITECTURE",
  "IMPLEMENTATION_STANDARD",
  "MASTER_IMPLEMENTATION_TEMPLATE",
  "DESIGN_SYSTEM",
] as const;

export type EpacDocumentId = (typeof EPAC_GOVERNANCE_DOCUMENTS)[number];

export type EpacLoadedDocument = {
  id: EpacDocumentId;
  path: string;
  content: string;
  hash: string;
  bytes: number;
  present: boolean;
};

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function loadEpacDocuments(cwd = process.cwd()): EpacLoadedDocument[] {
  return EPAC_GOVERNANCE_DOCUMENTS.map((id) => {
    const path = join(cwd, "docs", `${id}.md`);
    if (!existsSync(path)) {
      return {
        id,
        path,
        content: "",
        hash: "",
        bytes: 0,
        present: false,
      };
    }
    const content = readFileSync(path, "utf8");
    return {
      id,
      path,
      content,
      hash: hashContent(content),
      bytes: Buffer.byteLength(content, "utf8"),
      present: true,
    };
  });
}

export function requireProjectBible(cwd = process.cwd()): EpacLoadedDocument {
  const docs = loadEpacDocuments(cwd);
  const bible = docs.find((doc) => doc.id === "PROJECT_BIBLE");
  if (!bible?.present) {
    throw new Error("PROJECT_BIBLE.md is required and missing from docs/");
  }
  return bible;
}
