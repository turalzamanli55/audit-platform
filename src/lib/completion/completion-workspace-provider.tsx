"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CompletionWorkspaceView } from "@/lib/completion/completion-workspace-view";

type CompletionWorkspaceContextValue = {
  review: CompletionWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  refreshReview: (review: CompletionWorkspaceView | null) => void;
};

const CompletionWorkspaceContext = createContext<CompletionWorkspaceContextValue | null>(null);

export function useCompletionWorkspace(): CompletionWorkspaceContextValue {
  const context = useContext(CompletionWorkspaceContext);
  if (!context) {
    throw new Error("useCompletionWorkspace must be used within CompletionWorkspaceProvider");
  }
  return context;
}

type CompletionWorkspaceProviderProps = {
  initialReview?: CompletionWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  children: ReactNode;
};

export function CompletionWorkspaceProvider({
  initialReview = null,
  engagementId,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  children,
}: CompletionWorkspaceProviderProps) {
  const [review, setReview] = useState(initialReview);

  const refreshReview = useCallback((next: CompletionWorkspaceView | null) => {
    setReview(next);
  }, []);

  const serverSyncKey = initialReview
    ? `${initialReview.id}:${initialReview.version}:${initialReview.updatedAt}:${initialReview.isArchived}:${initialReview.packageStatus}:${initialReview.progressPct}:${initialReview.pendingCount}:${initialReview.returnedCount}:${initialReview.resolvedCount}`
    : `empty:${engagementId}`;

  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) return;
    syncedKeyRef.current = serverSyncKey;
    setReview(initialReview);
  }, [initialReview, serverSyncKey]);

  return (
    <CompletionWorkspaceContext.Provider
      value={{
        review,
        engagementId,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        refreshReview,
      }}
    >
      {children}
    </CompletionWorkspaceContext.Provider>
  );
}
