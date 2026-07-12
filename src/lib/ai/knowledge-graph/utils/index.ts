import type { KgEdge, KgNode, KgRelationshipType } from "@/lib/ai/knowledge-graph/types";

export function kgNodeId(type: string, slug: string): string {
  return `kg:${type}:${slug}`;
}

export function kgEdgeId(type: KgRelationshipType, fromId: string, toId: string): string {
  return `kg:edge:${type}:${fromId}->${toId}`;
}

export function normalizeKgQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9_./-]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

export function nodeMatchesKeywords(node: KgNode, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const haystack = [node.title, node.summary, ...node.keywords, node.id]
    .join(" ")
    .toLowerCase();
  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) hits += 1;
  }
  return hits;
}

export function createKgEdge(
  type: KgRelationshipType,
  fromId: string,
  toId: string,
  weight = 1,
  metadata?: Record<string, unknown>,
): KgEdge {
  return {
    id: kgEdgeId(type, fromId, toId),
    type,
    fromId,
    toId,
    weight,
    metadata,
  };
}
