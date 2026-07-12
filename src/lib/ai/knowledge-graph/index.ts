/**
 * Enterprise Knowledge Graph & Retrieval Engine
 *
 * Planner → Skill Resolver → Knowledge Resolver → Knowledge Graph →
 * Retriever → Context Builder → Prompt Builder → LLM Platform
 *
 * No vector DB. No embeddings. No OpenAI / Pinecone / Weaviate / Chroma / FAISS.
 */

export * from "@/lib/ai/knowledge-graph/types";
export * from "@/lib/ai/knowledge-graph/utils";
export * from "@/lib/ai/knowledge-graph/nodes";
export * from "@/lib/ai/knowledge-graph/edges";
export * from "@/lib/ai/knowledge-graph/graph";
export * from "@/lib/ai/knowledge-graph/documents";
export * from "@/lib/ai/knowledge-graph/indexing";
export * from "@/lib/ai/knowledge-graph/citations";
export * from "@/lib/ai/knowledge-graph/cache";
export * from "@/lib/ai/knowledge-graph/ranking";
export * from "@/lib/ai/knowledge-graph/search";
export * from "@/lib/ai/knowledge-graph/relationships";
export * from "@/lib/ai/knowledge-graph/resolver";
export * from "@/lib/ai/knowledge-graph/retriever";
export * from "@/lib/ai/knowledge-graph/catalog";
export {
  KnowledgeGraphEngine,
  bootstrapKnowledgeGraphEngine,
  AI_KNOWLEDGE_GRAPH_VERSION,
} from "@/lib/ai/knowledge-graph/engine";
