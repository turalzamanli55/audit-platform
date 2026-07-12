export type AiMemoryEntry = {
  id: string;
  key: string;
  value: unknown;
  createdAt: string;
};

/**
 * Temporary session memory only — cleared when conversation resets.
 * No long-term / cross-engagement memory.
 */
export type AiSessionMemorySnapshot = {
  conversationId: string;
  entries: AiMemoryEntry[];
};
