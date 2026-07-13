"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { FsMappingDashboardMetrics, FsMappingSet } from "@/types/fs-mapping";

export type FsMappingWorkspaceContextValue = {
  mappingSet: FsMappingSet | null;
  metrics: FsMappingDashboardMetrics | null;
  engagementSlug: string;
  locale: string;
};

const FsMappingWorkspaceContext = createContext<FsMappingWorkspaceContextValue | null>(null);

export function FsMappingWorkspaceProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FsMappingWorkspaceContextValue;
}) {
  return (
    <FsMappingWorkspaceContext.Provider value={value}>{children}</FsMappingWorkspaceContext.Provider>
  );
}

export function useFsMappingWorkspace(): FsMappingWorkspaceContextValue {
  const value = useContext(FsMappingWorkspaceContext);
  if (!value) {
    throw new Error("useFsMappingWorkspace must be used within FsMappingWorkspaceProvider");
  }
  return value;
}
