import type { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { KgResolvedSubgraph } from "@/lib/ai/knowledge-graph/types";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";
import { KgRelationshipService } from "@/lib/ai/knowledge-graph/relationships";

/**
 * Knowledge Resolver — expands a context-relevant subgraph before retrieval ranking.
 */
export class KgResolver {
  private readonly relationships: KgRelationshipService;

  constructor(private readonly graph: KnowledgeGraph) {
    this.relationships = new KgRelationshipService(graph);
  }

  resolve(context: AiRuntimeContext, extraSeedIds: string[] = []): KgResolvedSubgraph {
    const seedNodeIds = new Set<string>(extraSeedIds);
    if (context.moduleId) seedNodeIds.add(kgNodeId("module", context.moduleId));
    if (context.workflowId) {
      const workflowNodes = this.graph
        .listNodes({ type: "workflow" })
        .filter((node) => String(node.metadata.workflowId ?? "").includes(context.workflowId!));
      for (const node of workflowNodes.slice(0, 5)) seedNodeIds.add(node.id);
    }

    seedNodeIds.add(kgNodeId("documentation", "project-bible"));
    seedNodeIds.add(kgNodeId("documentation", "system-architecture"));

    const nodes = new Map<string, ReturnType<KnowledgeGraph["requireNode"]>>();
    const edges = new Map<string, ReturnType<KnowledgeGraph["listEdges"]>[number]>();

    for (const seedId of seedNodeIds) {
      const seed = this.graph.getNode(seedId);
      if (!seed) continue;
      nodes.set(seed.id, seed);
      for (const neighbor of this.relationships.relatedNodes(seed.id)) {
        nodes.set(neighbor.node.id, neighbor.node);
        edges.set(neighbor.edge.id, neighbor.edge);
      }
    }

    return {
      seedNodeIds: [...seedNodeIds],
      nodes: [...nodes.values()],
      edges: [...edges.values()],
      resolvedAt: new Date().toISOString(),
    };
  }
}
