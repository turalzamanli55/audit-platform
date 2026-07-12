import { NextRequest } from "next/server";
import { bootstrapIntegratedLlmPlatformReady } from "@/lib/ai/providers/integration/bootstrap-live";
import { bootstrapAiToolRuntime } from "@/lib/ai/tools";
import { isLlmPlatformError } from "@/lib/ai/providers/provider-errors";
import type { AiPipelineStreamMetadata } from "@/lib/ai/pipeline/types";

export const runtime = "nodejs";

type StreamRequestBody = {
  utterance?: string;
  modelId?: string;
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  streamMetadata?: AiPipelineStreamMetadata;
  promptContext?: {
    userUtterance?: string;
    memoryCount?: number;
    citationCount?: number;
    toolCount?: number;
  };
};

/**
 * Server-only streaming endpoint — preserves pipeline metadata in stream events.
 */
export async function POST(request: NextRequest) {
  const streamStarted = Date.now();
  try {
    const body = (await request.json()) as StreamRequestBody;

    const boot = await bootstrapIntegratedLlmPlatformReady({
      toolRuntime: bootstrapAiToolRuntime(),
    });

    if (boot.configuredProviderIds.length === 0) {
      return Response.json(
        { error: { code: "provider_not_configured", message: "No LLM provider configured." } },
        { status: 503 },
      );
    }

    const route = boot.platform.route({
      task: "general_chat",
      preferLatency: "low",
      allowedProviderIds: boot.configuredProviderIds,
    });
    const modelId = body.modelId ?? route.model.id;
    const messages =
      body.messages ??
      (body.utterance
        ? [{ role: "user" as const, content: body.utterance }]
        : []);

    if (messages.length === 0) {
      return Response.json(
        { error: { code: "validation_failed", message: "messages or utterance required." } },
        { status: 400 },
      );
    }

    const provider = boot.platform.providers.require(route.providerId);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (body.streamMetadata) {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                kind: "metadata",
                traceExecutionId: body.streamMetadata.traceExecutionId,
                citations: body.streamMetadata.citations,
                knowledgeReferences: body.streamMetadata.knowledgeReferences,
                toolPlans: body.streamMetadata.toolPlans,
                hostExecutionPlanId: body.streamMetadata.hostExecutionPlanId,
                promptContext: body.promptContext ?? null,
                provider: route.providerId,
              })}\n`,
            ),
          );
        }

        try {
          for await (const event of boot.platform.streaming.stream(provider, {
            modelId,
            messages,
          })) {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          }
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                kind: "done",
                streamingDurationMs: Date.now() - streamStarted,
                provider: route.providerId,
              })}\n`,
            ),
          );
          controller.close();
        } catch (error) {
          const payload = isLlmPlatformError(error)
            ? { kind: "error", message: error.message, code: error.code }
            : { kind: "error", message: "Stream failed.", code: "provider_offline" };
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    const message = isLlmPlatformError(error) ? error.message : "LLM stream bootstrap failed.";
    const code = isLlmPlatformError(error) ? error.code : "provider_offline";
    return Response.json({ error: { code, message } }, { status: 500 });
  }
}
