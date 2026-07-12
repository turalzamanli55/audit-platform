import type { KgNode, KgNodeType } from "@/lib/ai/knowledge-graph/types";
import type { AiModuleId } from "@/lib/ai/constants";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";

export type CreateKgNodeInput = {
  type: KgNodeType;
  slug: string;
  title: string;
  summary: string;
  keywords?: readonly string[];
  moduleId?: AiModuleId | null;
  permissionCodes?: readonly string[];
  confidence?: number;
  freshness?: string;
  metadata?: Record<string, unknown>;
};

export function createKgNode(input: CreateKgNodeInput): KgNode {
  return {
    id: kgNodeId(input.type, input.slug),
    type: input.type,
    title: input.title,
    summary: input.summary,
    moduleId: input.moduleId ?? null,
    keywords: input.keywords ?? [],
    permissionCodes: input.permissionCodes,
    confidence: input.confidence ?? 0.85,
    freshness: input.freshness ?? new Date().toISOString().slice(0, 10),
    metadata: input.metadata ?? {},
  };
}
