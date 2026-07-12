import type {
  AiCopilotHostAdapter,
  AiCopilotPanelContract,
} from "@/lib/ai/types/ui";

/**
 * UI contracts only — no chat window, no floating assistant.
 */
export class AiCopilotPanelContractImpl implements AiCopilotPanelContract {
  readonly kind = "ai-copilot-panel-contract" as const;
  private adapter: AiCopilotHostAdapter | null = null;

  bindHost(adapter: AiCopilotHostAdapter): void {
    this.adapter = adapter;
  }

  getHost(): AiCopilotHostAdapter | null {
    return this.adapter;
  }
}
