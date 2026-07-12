import { describe, expect, it } from "vitest";
import {
  AI_KNOWLEDGE_GRAPH_VERSION,
  bootstrapAiFoundation,
  bootstrapKnowledgeGraphEngine,
  collectAiRuntimeContext,
  KG_SEMANTIC_SEARCH_CONTRACT,
} from "@/lib/ai";

describe("Enterprise Knowledge Graph & Retrieval Engine", () => {
  it("bootstraps a populated graph with modules, docs, and standards", () => {
    const engine = bootstrapKnowledgeGraphEngine();
    const stats = engine.stats();
    expect(stats.version).toBe(AI_KNOWLEDGE_GRAPH_VERSION);
    expect(stats.nodeCount).toBeGreaterThan(50);
    expect(stats.edgeCount).toBeGreaterThan(50);
    expect(stats.documentCount).toBeGreaterThanOrEqual(11);
    expect(stats.semanticSearchImplemented).toBe(false);
    expect(KG_SEMANTIC_SEARCH_CONTRACT.implemented).toBe(false);
  });

  it("registers platform modules and governance documents", () => {
    const engine = bootstrapKnowledgeGraphEngine();
    expect(engine.graph.getNode("kg:module:materiality")?.title).toBe("Materiality");
    expect(engine.graph.getNode("kg:documentation:project-bible")?.title).toBe("PROJECT_BIBLE");
    expect(engine.graph.getNode("kg:audit_standard:isa")?.title).toBe("ISA");
    expect(engine.graph.getNode("kg:accounting_standard:ifrs")?.title).toBe("IFRS");
    expect(engine.documents.list({ kind: "design_system" })[0]?.title).toBe("DESIGN_SYSTEM");
  });

  it("retrieves keyword and graph knowledge with citations", () => {
    const engine = bootstrapKnowledgeGraphEngine();
    const context = collectAiRuntimeContext({
      route: "/en/app/engagements/demo/materiality",
      moduleId: "materiality",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: ["materiality.read"],
    });

    const result = engine.retrieve({
      query: "materiality threshold IFRS ISA",
      context,
      limit: 10,
    });

    expect(result.hits.length).toBeGreaterThan(0);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations[0]?.nodeId).toBeTruthy();
    expect(result.citations[0]?.title).toBeTruthy();
    expect(result.modesUsed).toContain("keyword");
  });

  it("builds structured context without LLM or embeddings", () => {
    const engine = bootstrapKnowledgeGraphEngine();
    const context = collectAiRuntimeContext({
      route: "/en/app/engagements/demo/planning",
      moduleId: "planning",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      companyId: "c1",
      engagementId: "e1",
      permissionCodes: ["planning.read"],
    });

    const built = engine.buildContext({
      query: "planning readiness audit workflow",
      context,
    });

    expect(built.currentModule).toBe("planning");
    expect(built.currentCompany).toBe("c1");
    expect(built.currentEngagement).toBe("e1");
    expect(built.citations.length).toBeGreaterThan(0);
    expect(built.structuredKnowledge.hitCount).toBeGreaterThan(0);
  });

  it("wires knowledge graph into foundation bootstrap and previewTurn", () => {
    const boot = bootstrapAiFoundation();
    expect(boot.knowledgeNodeCount).toBeGreaterThan(50);
    expect(boot.knowledgeDocumentCount).toBeGreaterThanOrEqual(11);

    const preview = boot.core.previewTurn(
      {
        route: "/en/app/import-intelligence",
        moduleId: "import-intelligence",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: ["uaie.read"],
      },
      { utterance: "explain dictionary health and ERP detection" },
    );

    expect(preview.providerAvailable).toBe(false);
    expect(preview.knowledgeRetrieval?.hits.length).toBeGreaterThan(0);
    expect(preview.knowledgeGraphContext?.citations.length).toBeGreaterThan(0);
    expect(preview.prompt.knowledgeGraphContext).toBeTruthy();
  });
});
