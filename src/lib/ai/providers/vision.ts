/**
 * Vision layer — image-analysis contracts only.
 * No provider SDK implementation.
 */

import type {
  LlmImagePart,
  LlmProvider,
  LlmVisionRequest,
  LlmVisionResult,
} from "@/lib/ai/providers/provider";
import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";

export type LlmVisionAnalysisRequest = {
  modelId: string;
  prompt: string;
  images: LlmImagePart[];
  abortSignal?: AbortSignal;
};

export type LlmVisionAnalysisResult = LlmVisionResult & {
  imageCount: number;
};

export class LlmVisionLayer {
  private readonly capabilities = new LlmCapabilityResolver();

  async analyze(
    provider: LlmProvider,
    request: LlmVisionAnalysisRequest,
  ): Promise<LlmVisionAnalysisResult> {
    this.capabilities.assert(provider, "vision");
    if (request.images.length === 0) {
      throw new LlmPlatformError("capability_unsupported", "Vision analysis requires at least one image.", {
        providerId: provider.id,
      });
    }
    for (const image of request.images) {
      this.assertImagePart(image);
    }

    const result = await provider.vision(request satisfies LlmVisionRequest);
    return {
      ...result,
      imageCount: request.images.length,
    };
  }

  private assertImagePart(image: LlmImagePart): void {
    if (!image.dataRef.trim()) {
      throw new LlmPlatformError("capability_unsupported", "Vision image dataRef is required.");
    }
    if (!image.mediaType.trim()) {
      throw new LlmPlatformError("capability_unsupported", "Vision image mediaType is required.");
    }
  }
}
