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
import type { ReportingWorkspaceView } from "@/lib/reporting/reporting-workspace-view";

type ReportingWorkspaceContextValue = {
  review: ReportingWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  refreshReview: (review: ReportingWorkspaceView | null) => void;
};

const ReportingWorkspaceContext = createContext<ReportingWorkspaceContextValue | null>(null);

export function useReportingWorkspace(): ReportingWorkspaceContextValue {
  const context = useContext(ReportingWorkspaceContext);
  if (!context) {
    throw new Error("useReportingWorkspace must be used within ReportingWorkspaceProvider");
  }
  return context;
}

type ReportingWorkspaceProviderProps = {
  initialReview?: ReportingWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  children: ReactNode;
};

export function ReportingWorkspaceProvider({
  initialReview = null,
  engagementId,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  children,
}: ReportingWorkspaceProviderProps) {
  const [review, setReview] = useState(initialReview);

  const refreshReview = useCallback((next: ReportingWorkspaceView | null) => {
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
    <ReportingWorkspaceContext.Provider
      value={{
        review,
        engagementId,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        refreshReview,
      }}
    >
      {children}
    </ReportingWorkspaceContext.Provider>
  );
}
