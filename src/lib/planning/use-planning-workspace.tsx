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
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";

type PlanningWorkspaceContextValue = {
  plan: PlanningWorkspaceView | null;
  engagementId: string;
  refreshPlanning: (plan: PlanningWorkspaceView | null) => void;
};

const PlanningWorkspaceContext = createContext<PlanningWorkspaceContextValue | null>(null);

export function usePlanningWorkspace(): PlanningWorkspaceContextValue {
  const context = useContext(PlanningWorkspaceContext);
  if (!context) {
    throw new Error("usePlanningWorkspace must be used within PlanningWorkspaceProvider");
  }
  return context;
}

type PlanningWorkspaceProviderProps = {
  initialPlan: PlanningWorkspaceView | null;
  engagementId: string;
  children: ReactNode;
};

export function PlanningWorkspaceProvider({
  initialPlan,
  engagementId,
  children,
}: PlanningWorkspaceProviderProps) {
  const [plan, setPlan] = useState(initialPlan);

  const refreshPlanning = useCallback((next: PlanningWorkspaceView | null) => {
    setPlan(next);
  }, []);

  const serverSyncKey = initialPlan
    ? `${initialPlan.id}:${initialPlan.version}:${initialPlan.updatedAt}:${initialPlan.isArchived}:${initialPlan.planningStatus}:${initialPlan.planVersion}`
    : `empty:${engagementId}`;

  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) {
      return;
    }
    syncedKeyRef.current = serverSyncKey;
    setPlan(initialPlan);
  }, [initialPlan, serverSyncKey]);

  return (
    <PlanningWorkspaceContext.Provider value={{ plan, engagementId, refreshPlanning }}>
      {children}
    </PlanningWorkspaceContext.Provider>
  );
}
