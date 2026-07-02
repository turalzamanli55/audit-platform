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
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";

type FieldworkWorkspaceContextValue = {
  fieldwork: FieldworkWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  refreshFieldwork: (fieldwork: FieldworkWorkspaceView | null) => void;
};

const FieldworkWorkspaceContext = createContext<FieldworkWorkspaceContextValue | null>(null);

export function useFieldworkWorkspace(): FieldworkWorkspaceContextValue {
  const context = useContext(FieldworkWorkspaceContext);
  if (!context) {
    throw new Error("useFieldworkWorkspace must be used within FieldworkWorkspaceProvider");
  }
  return context;
}

type FieldworkWorkspaceProviderProps = {
  initialFieldwork: FieldworkWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  children: ReactNode;
};

export function FieldworkWorkspaceProvider({
  initialFieldwork,
  engagementId,
  planningApproved,
  children,
}: FieldworkWorkspaceProviderProps) {
  const [fieldwork, setFieldwork] = useState(initialFieldwork);

  const refreshFieldwork = useCallback((next: FieldworkWorkspaceView | null) => {
    setFieldwork(next);
  }, []);

  const serverSyncKey = initialFieldwork
    ? `${initialFieldwork.id}:${initialFieldwork.version}:${initialFieldwork.updatedAt}:${initialFieldwork.isArchived}:${initialFieldwork.packageStatus}:${initialFieldwork.progressPct}`
    : `empty:${engagementId}`;

  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) return;
    syncedKeyRef.current = serverSyncKey;
    setFieldwork(initialFieldwork);
  }, [initialFieldwork, serverSyncKey]);

  return (
    <FieldworkWorkspaceContext.Provider
      value={{ fieldwork, engagementId, planningApproved, refreshFieldwork }}
    >
      {children}
    </FieldworkWorkspaceContext.Provider>
  );
}
