import type { KgDocumentKind, KgDocumentRecord } from "@/lib/ai/knowledge-graph/types";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";

export type CreateKgDocumentInput = {
  kind: KgDocumentKind;
  slug: string;
  title: string;
  path: string;
  summary: string;
  keywords?: readonly string[];
  localeScope?: readonly string[];
  version?: string;
  nodeType?: "documentation" | "help_article" | "template";
};

export function createKgDocument(input: CreateKgDocumentInput): KgDocumentRecord {
  const nodeType = input.nodeType ?? (input.kind === "help_article" ? "help_article" : input.kind === "template" ? "template" : "documentation");
  return {
    id: `kg:doc:${input.kind}:${input.slug}`,
    kind: input.kind,
    title: input.title,
    path: input.path,
    summary: input.summary,
    nodeId: kgNodeId(nodeType, input.slug),
    keywords: input.keywords ?? [],
    localeScope: input.localeScope ?? ["en", "az", "ru", "tr"],
    version: input.version ?? "1.0.0",
  };
}

/** Document index contracts — no embeddings, no blob storage wiring. */
export class KgDocumentIndex {
  private readonly documents = new Map<string, KgDocumentRecord>();

  register(document: KgDocumentRecord): void {
    this.documents.set(document.id, document);
  }

  registerAll(documents: readonly KgDocumentRecord[]): void {
    for (const document of documents) this.register(document);
  }

  get(id: string): KgDocumentRecord | null {
    return this.documents.get(id) ?? null;
  }

  list(filter?: { kind?: KgDocumentKind }): KgDocumentRecord[] {
    return [...this.documents.values()].filter((document) => {
      if (filter?.kind && document.kind !== filter.kind) return false;
      return true;
    });
  }

  findByNodeId(nodeId: string): KgDocumentRecord | null {
    return [...this.documents.values()].find((document) => document.nodeId === nodeId) ?? null;
  }

  count(): number {
    return this.documents.size;
  }
}
