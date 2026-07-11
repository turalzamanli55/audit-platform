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
import type { FinancialStatementsWorkspaceView } from "@/lib/financial-statements/financial-statements-workspace-view";

type FinancialStatementsWorkspaceContextValue = {
  review: FinancialStatementsWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  refreshReview: (review: FinancialStatementsWorkspaceView | null) => void;
};

const FinancialStatementsWorkspaceContext = createContext<FinancialStatementsWorkspaceContextValue | null>(null);

export function useFinancialStatementsWorkspace(): FinancialStatementsWorkspaceContextValue {
  const context = useContext(FinancialStatementsWorkspaceContext);
  if (!context) {
    throw new Error("useFinancialStatementsWorkspace must be used within FinancialStatementsWorkspaceProvider");
  }
  return context;
}

type FinancialStatementsWorkspaceProviderProps = {
  initialReview?: FinancialStatementsWorkspaceView | null;
  engagementId: string;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  children: ReactNode;
};

export function FinancialStatementsWorkspaceProvider({
  initialReview = null,
  engagementId,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  children,
}: FinancialStatementsWorkspaceProviderProps) {
  const [review, setReview] = useState(initialReview);

  const refreshReview = useCallback((next: FinancialStatementsWorkspaceView | null) => {
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
    <FinancialStatementsWorkspaceContext.Provider
      value={{
        review,
        engagementId,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        refreshReview,
      }}
    >
      {children}
    </FinancialStatementsWorkspaceContext.Provider>
  );
}
