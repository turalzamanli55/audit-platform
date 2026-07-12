import { createAiId } from "@/lib/ai/utils/id";
import type {
  AiPipelineObservability,
  AiPipelineStepId,
  AiPipelineStepTrace,
  AiPipelineSurface,
  AiPipelineTrace,
} from "@/lib/ai/pipeline/types";
import { AI_PIPELINE_GRAPH, pipelineStepLabel } from "@/lib/ai/pipeline/trace";

type StepTimer = {
  stepId: AiPipelineStepId;
  startedMs: number;
};

/**
 * Pipeline trace + observability collector.
 */
export class AiPipelineTelemetry {
  private readonly steps: AiPipelineStepTrace[] = [];
  private active: StepTimer | null = null;
  private readonly startedMs = Date.now();
  private memoryRetrievalMs = 0;
  private knowledgeRetrievalMs = 0;
  private skillSelectionMs = 0;
  private toolSelectionMs = 0;
  private hostPlanningMs = 0;
  private promptGenerationMs = 0;
  private orchestratorMs = 0;
  private memoryHitCount = 0;
  private knowledgeHitCount = 0;
  private selectedSkillId: string | null = null;
  private selectedToolId: string | null = null;
  private promptTokenEstimate = 0;
  private provider: string | null = null;

  begin(stepId: AiPipelineStepId): void {
    this.endActive("succeeded");
    this.active = { stepId, startedMs: Date.now() };
  }

  end(stepId: AiPipelineStepId, metadata?: Record<string, unknown>): void {
    if (!this.active || this.active.stepId !== stepId) {
      this.begin(stepId);
    }
    const durationMs = Date.now() - (this.active?.startedMs ?? Date.now());
    this.steps.push({
      stepId,
      label: pipelineStepLabel(stepId),
      status: "succeeded",
      durationMs,
      metadata,
    });
    this.recordBucket(stepId, durationMs, metadata);
    this.active = null;
  }

  skip(stepId: AiPipelineStepId, reason: string): void {
    this.steps.push({
      stepId,
      label: pipelineStepLabel(stepId),
      status: "skipped",
      durationMs: 0,
      metadata: { reason },
    });
  }

  fail(stepId: AiPipelineStepId, message: string): void {
    const durationMs = this.active?.stepId === stepId ? Date.now() - this.active.startedMs : 0;
    this.steps.push({
      stepId,
      label: pipelineStepLabel(stepId),
      status: "failed",
      durationMs,
      metadata: { message },
    });
    this.active = null;
  }

  buildTrace(surface: AiPipelineSurface): AiPipelineTrace {
    this.endActive("succeeded");
    return {
      executionId: createAiId("pipe_exec"),
      surface,
      steps: [...this.steps],
      graph: [...AI_PIPELINE_GRAPH],
      totalDurationMs: Date.now() - this.startedMs,
      producedAt: new Date().toISOString(),
    };
  }

  snapshot(): AiPipelineObservability {
    return {
      pipelineLatencyMs: Date.now() - this.startedMs,
      memoryRetrievalMs: this.memoryRetrievalMs,
      knowledgeRetrievalMs: this.knowledgeRetrievalMs,
      skillSelectionMs: this.skillSelectionMs,
      toolSelectionMs: this.toolSelectionMs,
      hostPlanningMs: this.hostPlanningMs,
      promptGenerationMs: this.promptGenerationMs,
      orchestratorMs: this.orchestratorMs,
      llmDurationMs: null,
      streamingDurationMs: null,
      memoryHitCount: this.memoryHitCount,
      knowledgeHitCount: this.knowledgeHitCount,
      selectedSkillId: this.selectedSkillId,
      selectedToolId: this.selectedToolId,
      promptTokenEstimate: this.promptTokenEstimate,
      provider: this.provider,
    };
  }

  setProvider(provider: string | null): void {
    this.provider = provider;
  }

  setPromptTokenEstimate(value: number): void {
    this.promptTokenEstimate = value;
  }

  private endActive(status: AiPipelineStepTrace["status"]): void {
    if (!this.active) return;
    this.steps.push({
      stepId: this.active.stepId,
      label: pipelineStepLabel(this.active.stepId),
      status,
      durationMs: Date.now() - this.active.startedMs,
    });
  }

  private recordBucket(
    stepId: AiPipelineStepId,
    durationMs: number,
    metadata?: Record<string, unknown>,
  ): void {
    switch (stepId) {
      case "memory_resolver":
      case "memory_ranking":
        this.memoryRetrievalMs += durationMs;
        if (typeof metadata?.hitCount === "number") this.memoryHitCount = metadata.hitCount;
        break;
      case "knowledge_graph":
        this.knowledgeRetrievalMs += durationMs;
        if (typeof metadata?.hitCount === "number") this.knowledgeHitCount = metadata.hitCount;
        break;
      case "skill_resolver":
        this.skillSelectionMs += durationMs;
        if (typeof metadata?.selectedSkillId === "string") this.selectedSkillId = metadata.selectedSkillId;
        break;
      case "tool_resolver":
        this.toolSelectionMs += durationMs;
        if (typeof metadata?.selectedToolId === "string") this.selectedToolId = metadata.selectedToolId;
        break;
      case "host_planner":
        this.hostPlanningMs += durationMs;
        break;
      case "prompt_builder":
        this.promptGenerationMs += durationMs;
        break;
      case "orchestrator":
        this.orchestratorMs += durationMs;
        break;
      default:
        break;
    }
  }
}
