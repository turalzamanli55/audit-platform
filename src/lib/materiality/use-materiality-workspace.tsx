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
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";

type MaterialityWorkspaceContextValue = {
  materiality: MaterialityWorkspaceView | null;
  /** @deprecated Use `materiality` */
  materialityPackage: MaterialityWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  refreshMateriality: (materiality: MaterialityWorkspaceView | null) => void;
  /** @deprecated Use `refreshMateriality` */
  refreshMaterialityPackage: (materiality: MaterialityWorkspaceView | null) => void;
};

const MaterialityWorkspaceContext = createContext<MaterialityWorkspaceContextValue | null>(null);

export function useMaterialityWorkspace(): MaterialityWorkspaceContextValue {
  const context = useContext(MaterialityWorkspaceContext);
  if (!context) {
    throw new Error(
      "useMaterialityWorkspace must be used within MaterialityWorkspaceProvider",
    );
  }
  return context;
}

type MaterialityWorkspaceProviderProps = {
  initialMateriality?: MaterialityWorkspaceView | null;
  /** @deprecated Use `initialMateriality` */
  initialMaterialityPackage?: MaterialityWorkspaceView | null;
  engagementId: string;
  planningApproved: boolean;
  children: ReactNode;
};

export function MaterialityWorkspaceProvider({
  initialMateriality,
  initialMaterialityPackage,
  engagementId,
  planningApproved,
  children,
}: MaterialityWorkspaceProviderProps) {
  const resolvedInitial = initialMateriality ?? initialMaterialityPackage ?? null;
  const [materiality, setMateriality] = useState(resolvedInitial);

  const refreshMateriality = useCallback((next: MaterialityWorkspaceView | null) => {
    setMateriality(next);
  }, []);

  const serverSyncKey = resolvedInitial
    ? `${resolvedInitial.id}:${resolvedInitial.version}:${resolvedInitial.updatedAt}:${resolvedInitial.isArchived}:${resolvedInitial.packageStatus}:${resolvedInitial.progressPct}`
    : `empty:${engagementId}`;

  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) return;
    syncedKeyRef.current = serverSyncKey;
    setMateriality(resolvedInitial);
  }, [resolvedInitial, serverSyncKey]);

  return (
    <MaterialityWorkspaceContext.Provider
      value={{
        materiality,
        materialityPackage: materiality,
        engagementId,
        planningApproved,
        refreshMateriality,
        refreshMaterialityPackage: refreshMateriality,
      }}
    >
      {children}
    </MaterialityWorkspaceContext.Provider>
  );
}
