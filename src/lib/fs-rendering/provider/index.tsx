"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { FsRenderDashboardMetrics, FsRenderPresentation } from "@/types/fs-rendering";

export type FsRenderingWorkspaceContextValue = {
  presentation: FsRenderPresentation | null;
  metrics: FsRenderDashboardMetrics | null;
  engagementSlug: string;
  locale: string;
};

const FsRenderingWorkspaceContext = createContext<FsRenderingWorkspaceContextValue | null>(null);

export function FsRenderingWorkspaceProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FsRenderingWorkspaceContextValue;
}) {
  return (
    <FsRenderingWorkspaceContext.Provider value={value}>
      {children}
    </FsRenderingWorkspaceContext.Provider>
  );
}

export function useFsRenderingWorkspace(): FsRenderingWorkspaceContextValue {
  const value = useContext(FsRenderingWorkspaceContext);
  if (!value) {
    throw new Error("useFsRenderingWorkspace must be used within FsRenderingWorkspaceProvider");
  }
  return value;
}
