import type { KgCitation, KgEdge, KgNode, KgRelationshipType } from "@/lib/ai/knowledge-graph/types";

export function buildKgCitation(input: {
  node: KgNode;
  relationship?: KgRelationshipType | "matched" | "ranked";
  confidence?: number;
  documentReference?: string | null;
  source?: string;
}): KgCitation {
  return {
    title: input.node.title,
    source: input.source ?? input.node.type,
    nodeId: input.node.id,
    relationship: input.relationship ?? "matched",
    confidence: input.confidence ?? input.node.confidence,
    documentReference: input.documentReference ?? null,
  };
}

export function citationsFromHits(
  nodes: KgNode[],
  edges: KgEdge[],
  documentRefByNodeId: Map<string, string>,
): KgCitation[] {
  return nodes.map((node) => {
    const edge = edges.find((item) => item.fromId === node.id || item.toId === node.id);
    return buildKgCitation({
      node,
      relationship: edge?.type ?? "matched",
      documentReference: documentRefByNodeId.get(node.id) ?? null,
    });
  });
}
