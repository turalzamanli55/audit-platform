import { createAiId } from "@/lib/ai/utils/id";
import type { AiModuleId } from "@/lib/ai/constants";
import type {
  AiOrchestratorPipelineMode,
  AiOrchestratorStep,
  AiOrchestratorStepKind,
} from "@/lib/ai/orchestrator/types";

export type CreateStepInput = {
  order: number;
  kind: AiOrchestratorStepKind;
  description: string;
  dependencies?: string[];
  skillId?: string | null;
  knowledgeQuery?: string | null;
  toolIds?: string[];
  moduleId?: AiModuleId | "*" | null;
  expectedOutput: string;
  pipelineMode?: AiOrchestratorPipelineMode;
  retryLimit?: number;
  conditionalOn?: AiOrchestratorStep["conditionalOn"];
  id?: string;
};

/**
 * Step factory — structural step records only.
 */
export class AiOrchestratorStepFactory {
  create(input: CreateStepInput): AiOrchestratorStep {
    return {
      id: input.id ?? createAiId("orch_step"),
      order: input.order,
      kind: input.kind,
      description: input.description,
      dependencies: input.dependencies ?? [],
      skillId: input.skillId ?? null,
      knowledgeQuery: input.knowledgeQuery ?? null,
      toolIds: input.toolIds ?? [],
      moduleId: input.moduleId ?? null,
      expectedOutput: input.expectedOutput,
      status: "pending",
      pipelineMode: input.pipelineMode ?? "sequential",
      retryLimit: input.retryLimit ?? 0,
      retryCount: 0,
      conditionalOn: input.conditionalOn,
      startedAt: null,
      completedAt: null,
      durationMs: null,
      output: null,
      error: null,
    };
  }
}
