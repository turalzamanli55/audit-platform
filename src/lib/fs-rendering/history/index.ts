import type { FsRenderHistoryEntry } from "@/types/fs-rendering";

export function buildRenderHistoryEntry(input: {
  action: string;
  actorUserId?: string | null;
  summary: string;
  detailsJson?: Record<string, unknown>;
}): FsRenderHistoryEntry {
  return {
    action: input.action,
    actorUserId: input.actorUserId ?? null,
    summary: input.summary,
    detailsJson: input.detailsJson ?? {},
    createdAt: new Date().toISOString(),
  };
}

export function appendHistory(
  history: FsRenderHistoryEntry[],
  entry: FsRenderHistoryEntry,
): FsRenderHistoryEntry[] {
  return [entry, ...history].slice(0, 500);
}
