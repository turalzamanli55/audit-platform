import { buildKnowledgeGraphCatalog, type KgCatalogSeed } from "@/lib/ai/knowledge-graph/catalog/seed";
import { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import { KgDocumentIndex } from "@/lib/ai/knowledge-graph/documents";
import { KgIndexer } from "@/lib/ai/knowledge-graph/indexing";

export type PopulatedKnowledgeGraph = {
  graph: KnowledgeGraph;
  documents: KgDocumentIndex;
  indexer: KgIndexer;
  seed: KgCatalogSeed;
};

export function populateKnowledgeGraph(seed: KgCatalogSeed = buildKnowledgeGraphCatalog()): PopulatedKnowledgeGraph {
  const graph = new KnowledgeGraph();
  graph.addNodes(seed.nodes);
  graph.addEdges(seed.edges);

  const documents = new KgDocumentIndex();
  documents.registerAll(seed.documents);

  const indexer = new KgIndexer();
  indexer.indexGraph(seed.nodes, seed.edges);

  return { graph, documents, indexer, seed };
}

export { buildKnowledgeGraphCatalog };
export type { KgCatalogSeed };
