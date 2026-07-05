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
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";

type ReviewWorkspaceContextValue = {
  review: ReviewWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  refreshReview: (review: ReviewWorkspaceView | null) => void;
};

const ReviewWorkspaceContext = createContext<ReviewWorkspaceContextValue | null>(null);

export function useReviewWorkspace(): ReviewWorkspaceContextValue {
  const context = useContext(ReviewWorkspaceContext);
  if (!context) {
    throw new Error("useReviewWorkspace must be used within ReviewWorkspaceProvider");
  }
  return context;
}

type ReviewWorkspaceProviderProps = {
  initialReview?: ReviewWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  children: ReactNode;
};

export function ReviewWorkspaceProvider({
  initialReview = null,
  engagementId,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  children,
}: ReviewWorkspaceProviderProps) {
  const [review, setReview] = useState(initialReview);

  const refreshReview = useCallback((next: ReviewWorkspaceView | null) => {
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
    <ReviewWorkspaceContext.Provider
      value={{
        review,
        engagementId,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        refreshReview,
      }}
    >
      {children}
    </ReviewWorkspaceContext.Provider>
  );
}
