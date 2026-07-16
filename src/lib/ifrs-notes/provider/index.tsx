"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IfrsNotePackage, IfrsNotesDashboardMetrics } from "@/types/ifrs-notes";

export type IfrsNotesWorkspaceContextValue = {
  notePackage: IfrsNotePackage | null;
  metrics: IfrsNotesDashboardMetrics | null;
  engagementSlug: string;
  locale: string;
};

const IfrsNotesWorkspaceContext = createContext<IfrsNotesWorkspaceContextValue | null>(null);

export function IfrsNotesWorkspaceProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: IfrsNotesWorkspaceContextValue;
}) {
  return (
    <IfrsNotesWorkspaceContext.Provider value={value}>{children}</IfrsNotesWorkspaceContext.Provider>
  );
}

export function useIfrsNotesWorkspace(): IfrsNotesWorkspaceContextValue {
  const value = useContext(IfrsNotesWorkspaceContext);
  if (!value) {
    throw new Error("useIfrsNotesWorkspace must be used within IfrsNotesWorkspaceProvider");
  }
  return value;
}
