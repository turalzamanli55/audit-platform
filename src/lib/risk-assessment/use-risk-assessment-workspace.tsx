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
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";

type RiskAssessmentWorkspaceContextValue = {
  riskAssessment: RiskAssessmentWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  materialityApproved: boolean;
  refreshRiskAssessment: (riskAssessment: RiskAssessmentWorkspaceView | null) => void;
};

const RiskAssessmentWorkspaceContext = createContext<RiskAssessmentWorkspaceContextValue | null>(
  null,
);

export function useRiskAssessmentWorkspace(): RiskAssessmentWorkspaceContextValue {
  const context = useContext(RiskAssessmentWorkspaceContext);
  if (!context) {
    throw new Error(
      "useRiskAssessmentWorkspace must be used within RiskAssessmentWorkspaceProvider",
    );
  }
  return context;
}

type RiskAssessmentWorkspaceProviderProps = {
  initialRiskAssessment: RiskAssessmentWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  materialityApproved: boolean;
  children: ReactNode;
};

export function RiskAssessmentWorkspaceProvider({
  initialRiskAssessment,
  engagementId,
  planningApproved,
  materialityApproved,
  children,
}: RiskAssessmentWorkspaceProviderProps) {
  const [riskAssessment, setRiskAssessment] = useState(initialRiskAssessment);

  const refreshRiskAssessment = useCallback((next: RiskAssessmentWorkspaceView | null) => {
    setRiskAssessment(next);
  }, []);

  const serverSyncKey = initialRiskAssessment
    ? `${initialRiskAssessment.id}:${initialRiskAssessment.version}:${initialRiskAssessment.updatedAt}:${initialRiskAssessment.isArchived}:${initialRiskAssessment.assessmentStatus}:${initialRiskAssessment.progressPct}`
    : `empty:${engagementId}`;

  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) return;
    syncedKeyRef.current = serverSyncKey;
    setRiskAssessment(initialRiskAssessment);
  }, [initialRiskAssessment, serverSyncKey]);

  return (
    <RiskAssessmentWorkspaceContext.Provider
      value={{ riskAssessment, engagementId, planningApproved, materialityApproved, refreshRiskAssessment }}
    >
      {children}
    </RiskAssessmentWorkspaceContext.Provider>
  );
}
