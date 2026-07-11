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
import type { OpinionWorkspaceView } from "@/lib/opinion/opinion-workspace-view";

type OpinionWorkspaceContextValue = {
  review: OpinionWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  refreshReview: (review: OpinionWorkspaceView | null) => void;
};

const OpinionWorkspaceContext = createContext<OpinionWorkspaceContextValue | null>(null);

export function useOpinionWorkspace(): OpinionWorkspaceContextValue {
  const context = useContext(OpinionWorkspaceContext);
  if (!context) {
    throw new Error("useOpinionWorkspace must be used within OpinionWorkspaceProvider");
  }
  return context;
}

type OpinionWorkspaceProviderProps = {
  initialReview?: OpinionWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  children: ReactNode;
};

export function OpinionWorkspaceProvider({
  initialReview = null,
  engagementId,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  children,
}: OpinionWorkspaceProviderProps) {
  const [review, setReview] = useState(initialReview);

  const refreshReview = useCallback((next: OpinionWorkspaceView | null) => {
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
    <OpinionWorkspaceContext.Provider
      value={{
        review,
        engagementId,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        refreshReview,
      }}
    >
      {children}
    </OpinionWorkspaceContext.Provider>
  );
}
