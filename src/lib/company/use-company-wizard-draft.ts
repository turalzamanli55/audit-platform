"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  COMPANY_WIZARD_DRAFT_STORAGE_KEY,
  COMPANY_WIZARD_DRAFT_VERSION,
  DEFAULT_COMPANY_WIZARD_DRAFT,
  mergeWizardDraft,
  type CompanyWizardDraft,
} from "@/lib/company/company-wizard-draft";

type UseCompanyWizardDraftOptions = {
  enabled?: boolean;
};

const draftListeners = new Set<() => void>();

function emitDraftChange(): void {
  draftListeners.forEach((listener) => listener());
}

function parseStoredDraft(raw: string | null): CompanyWizardDraft | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CompanyWizardDraft;
    if (parsed.version !== COMPANY_WIZARD_DRAFT_VERSION) {
      return null;
    }
    return mergeWizardDraft(DEFAULT_COMPANY_WIZARD_DRAFT, parsed);
  } catch {
    return null;
  }
}

function readDraftFromStorage(): CompanyWizardDraft {
  if (typeof window === "undefined") {
    return DEFAULT_COMPANY_WIZARD_DRAFT;
  }

  return (
    parseStoredDraft(localStorage.getItem(COMPANY_WIZARD_DRAFT_STORAGE_KEY)) ??
    DEFAULT_COMPANY_WIZARD_DRAFT
  );
}

function subscribeToDraft(listener: () => void): () => void {
  draftListeners.add(listener);
  return () => {
    draftListeners.delete(listener);
  };
}

export function useCompanyWizardDraft(options: UseCompanyWizardDraftOptions = {}) {
  const enabled = options.enabled ?? true;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draft = useSyncExternalStore(
    subscribeToDraft,
    () => (enabled ? readDraftFromStorage() : DEFAULT_COMPANY_WIZARD_DRAFT),
    () => DEFAULT_COMPANY_WIZARD_DRAFT,
  );

  const persistDraft = useCallback(
    (next: CompanyWizardDraft) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        localStorage.setItem(COMPANY_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
        emitDraftChange();
      }, 250);
    },
    [enabled],
  );

  const updateDraft = useCallback(
    (patch: Partial<CompanyWizardDraft>) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }

      const current = readDraftFromStorage();
      const next = mergeWizardDraft(current, patch);
      localStorage.setItem(COMPANY_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
      emitDraftChange();
    },
    [enabled],
  );

  const clearDraft = useCallback(() => {
    if (enabled && typeof window !== "undefined") {
      localStorage.removeItem(COMPANY_WIZARD_DRAFT_STORAGE_KEY);
      emitDraftChange();
    }
  }, [enabled]);

  return {
    draft,
    hydrated: true,
    updateDraft,
    setDraft: (next: CompanyWizardDraft) => {
      if (enabled && typeof window !== "undefined") {
        localStorage.setItem(COMPANY_WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(next));
        emitDraftChange();
      }
    },
    clearDraft,
    persistDraft,
  };
}
