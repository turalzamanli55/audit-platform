import type { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import type { KgDocumentIndex } from "@/lib/ai/knowledge-graph/documents";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiModuleId } from "@/lib/ai/constants";
import type { KgBuiltContext, KgRetrievalResult } from "@/lib/ai/knowledge-graph/types";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";
import { KgRelationshipService } from "@/lib/ai/knowledge-graph/relationships";

/**
 * Context Builder — structured retrieval context for Prompt Builder.
 * Never writes vendor prompts. Never calls LLMs.
 */
export class KgContextBuilder {
  private readonly relationships: KgRelationshipService;

  constructor(
    private readonly graph: KnowledgeGraph,
    private readonly documents: KgDocumentIndex,
  ) {
    this.relationships = new KgRelationshipService(graph);
  }

  build(context: AiRuntimeContext, retrieval: KgRetrievalResult): KgBuiltContext {
    const moduleNode = context.moduleId
      ? this.graph.getNode(kgNodeId("module", context.moduleId))
      : null;

    const previousSteps = moduleNode
      ? this.relationships.previousSteps(moduleNode.id).map((node) => node.title)
      : [];
    const nextSteps = moduleNode
      ? this.relationships.nextSteps(moduleNode.id).map((node) => node.title)
      : [];

    const relatedModules = moduleNode
      ? this.relationships
          .relatedNodes(moduleNode.id, ["related_to", "depends_on", "next_step"])
          .map((item) => item.node.moduleId)
          .filter((id): id is AiModuleId => Boolean(id))
      : [];

    const relevantStandards = retrieval.hits
      .filter(
        (hit) =>
          hit.node.type === "audit_standard" ||
          hit.node.type === "accounting_standard" ||
          hit.node.type === "business_rule",
      )
      .map((hit) => ({
        id: hit.node.id,
        title: hit.node.title,
        type: hit.node.type,
      }));

    const relevantDocumentation = retrieval.hits
      .filter(
        (hit) =>
          hit.node.type === "documentation" ||
          hit.node.type === "help_article" ||
          hit.node.type === "template",
      )
      .map((hit) => {
        const document = this.documents.findByNodeId(hit.node.id);
        return {
          id: hit.node.id,
          title: hit.node.title,
          path: document?.path ?? String(hit.node.metadata.path ?? ""),
        };
      });

    return {
      currentModule: context.moduleId,
      currentWorkflow: context.workflowId,
      currentCompany: context.companyId ?? context.companySlug,
      currentEngagement: context.engagementId ?? context.engagementSlug,
      relevantStandards,
      relevantDocumentation,
      relatedModules: [...new Set(relatedModules)],
      previousSteps,
      nextSteps,
      citations: retrieval.citations,
      structuredKnowledge: {
        hitCount: retrieval.hits.length,
        topNodeIds: retrieval.hits.slice(0, 8).map((hit) => hit.node.id),
        modesUsed: retrieval.modesUsed,
        modulePurpose: moduleNode?.summary ?? null,
      },
      builtAt: new Date().toISOString(),
    };
  }
}
