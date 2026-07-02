"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  DEFAULT_ENGAGEMENT_WIZARD_DRAFT,
  ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY,
  ENGAGEMENT_WIZARD_DRAFT_VERSION,
  mergeWizardDraft,
  type EngagementWizardDraft,
} from "@/lib/engagement/engagement-wizard-draft";

type UseEngagementWizardDraftOptions = {
  enabled?: boolean;
};

const draftListeners = new Set<() => void>();

let cachedStorageRaw: string | null | undefined;
let cachedSnapshot: EngagementWizardDraft = DEFAULT_ENGAGEMENT_WIZARD_DRAFT;

function invalidateDraftSnapshotCache(): void {
  cachedStorageRaw = undefined;
}

function emitDraftChange(): void {
  invalidateDraftSnapshotCache();
  draftListeners.forEach((listener) => listener());
}

function parseStoredDraft(raw: string | null): EngagementWizardDraft | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as EngagementWizardDraft;
    if (parsed.version !== ENGAGEMENT_WIZARD_DRAFT_VERSION) {
      return null;
    }
    return mergeWizardDraft(DEFAULT_ENGAGEMENT_WIZARD_DRAFT, parsed);
  } catch {
    return null;
  }
}

function readDraftFromStorage(): EngagementWizardDraft {
  if (typeof window === "undefined") {
    return DEFAULT_ENGAGEMENT_WIZARD_DRAFT;
  }

  const raw = localStorage.getItem(ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY);
  if (raw === cachedStorageRaw) {
    return cachedSnapshot;
  }

  cachedStorageRaw = raw;
  cachedSnapshot = parseStoredDraft(raw) ?? DEFAULT_ENGAGEMENT_WIZARD_DRAFT;
  return cachedSnapshot;
}

function subscribeToDraft(listener: () => void): () => void {
  draftListeners.add(listener);
  return () => {
    draftListeners.delete(listener);
  };
}

export function useEngagementWizardDraft(options: UseEngagementWizardDraftOptions = {}) {
  const enabled = options.enabled ?? true;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draft = useSyncExternalStore(
    subscribeToDraft,
    () => (enabled ? readDraftFromStorage() : DEFAULT_ENGAGEMENT_WIZARD_DRAFT),
    () => DEFAULT_ENGAGEMENT_WIZARD_DRAFT,
  );

  const persistDraft = useCallback(
    (next: EngagementWizardDraft) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        localStorage.setItem(ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
        emitDraftChange();
      }, 250);
    },
    [enabled],
  );

  const updateDraft = useCallback(
    (patch: Partial<EngagementWizardDraft>) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }

      const current = readDraftFromStorage();
      const next = mergeWizardDraft(current, patch);
      localStorage.setItem(ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
      emitDraftChange();
    },
    [enabled],
  );

  const clearDraft = useCallback(() => {
    if (enabled && typeof window !== "undefined") {
      localStorage.removeItem(ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY);
      emitDraftChange();
    }
  }, [enabled]);

  return {
    draft,
    hydrated: true,
    updateDraft,
    setDraft: (next: EngagementWizardDraft) => {
      if (enabled && typeof window !== "undefined") {
        localStorage.setItem(ENGAGEMENT_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
        emitDraftChange();
      }
    },
    clearDraft,
    persistDraft,
  };
}
