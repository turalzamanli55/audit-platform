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
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";

type EngagementWorkspaceContextValue = {
  engagement: EngagementWorkspaceView;
  refreshEngagement: (engagement: EngagementWorkspaceView) => void;
};

const EngagementWorkspaceContext = createContext<EngagementWorkspaceContextValue | null>(null);

export function useEngagementWorkspace(): EngagementWorkspaceContextValue {
  const context = useContext(EngagementWorkspaceContext);
  if (!context) {
    throw new Error("useEngagementWorkspace must be used within EngagementWorkspaceProvider");
  }
  return context;
}

type EngagementWorkspaceProviderProps = {
  initialEngagement: EngagementWorkspaceView;
  children: ReactNode;
};

export function EngagementWorkspaceProvider({
  initialEngagement,
  children,
}: EngagementWorkspaceProviderProps) {
  const [engagement, setEngagement] = useState(initialEngagement);

  const refreshEngagement = useCallback((next: EngagementWorkspaceView) => {
    setEngagement(next);
  }, []);

  const serverSyncKey = `${initialEngagement.id}:${initialEngagement.version}:${initialEngagement.updatedAt}:${initialEngagement.isArchived}`;
  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) {
      return;
    }
    syncedKeyRef.current = serverSyncKey;
    setEngagement(initialEngagement);
  }, [initialEngagement, serverSyncKey]);

  return (
    <EngagementWorkspaceContext.Provider value={{ engagement, refreshEngagement }}>
      {children}
    </EngagementWorkspaceContext.Provider>
  );
}
