/**
 * Message mapping helpers — enterprise chat messages ↔ OpenAI-compatible shapes.
 * Never logs message content.
 */

import type { LlmChatMessage, LlmContentPart, LlmTokenUsage } from "@/lib/ai/providers/provider";

export type OpenAiCompatibleMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
  tool_call_id?: string;
  name?: string;
};

function mapParts(parts: LlmContentPart[]): OpenAiCompatibleMessage["content"] {
  return parts.map((part) => {
    if (part.type === "text") return { type: "text" as const, text: part.text };
    // dataRef may already be a data URL or https URL supplied by the host.
    return {
      type: "image_url" as const,
      image_url: { url: part.dataRef },
    };
  });
}

export function toOpenAiCompatibleMessages(messages: LlmChatMessage[]): OpenAiCompatibleMessage[] {
  return messages.map((message) => {
    if (typeof message.content === "string") {
      return {
        role: message.role,
        content: message.content,
        tool_call_id: message.toolCallId,
        name: message.name,
      };
    }
    return {
      role: message.role,
      content: mapParts(message.content),
      tool_call_id: message.toolCallId,
      name: message.name,
    };
  });
}

export function normalizeUsage(usage?: {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
} | null): LlmTokenUsage | undefined {
  if (!usage) return undefined;
  const inputTokens = usage.prompt_tokens ?? usage.input_tokens ?? 0;
  const outputTokens = usage.completion_tokens ?? usage.output_tokens ?? 0;
  const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;
  return { inputTokens, outputTokens, totalTokens };
}

export function mapFinishReason(
  reason: string | null | undefined,
): "stop" | "length" | "tool_calls" | "content_filter" | "error" | "not_configured" {
  switch (reason) {
    case "stop":
    case "end_turn":
    case "STOP":
      return "stop";
    case "length":
    case "max_tokens":
    case "MAX_TOKENS":
      return "length";
    case "tool_calls":
    case "tool_use":
      return "tool_calls";
    case "content_filter":
      return "content_filter";
    default:
      return reason ? "stop" : "stop";
  }
}
