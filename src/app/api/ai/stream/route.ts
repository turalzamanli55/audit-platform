import { NextRequest } from "next/server";
import { bootstrapIntegratedLlmPlatformReady } from "@/lib/ai/providers/integration/bootstrap-live";
import { bootstrapAiToolRuntime } from "@/lib/ai/tools";
import { isLlmPlatformError } from "@/lib/ai/providers/provider-errors";

export const runtime = "nodejs";

/**
 * Server-only streaming endpoint for AI Workspace.
 * Clients never call providers directly — traffic flows through LLM Platform.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      utterance?: string;
      modelId?: string;
      messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    };

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
        try {
          for await (const event of boot.platform.streaming.stream(provider, {
            modelId,
            messages,
          })) {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          }
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
