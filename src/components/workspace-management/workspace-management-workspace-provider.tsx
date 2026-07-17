"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type WorkspaceManagementWorkspaceContextValue = {
  capabilityId: "cap_workspace-management";
};

const WorkspaceManagementWorkspaceContext =
  createContext<WorkspaceManagementWorkspaceContextValue | null>(null);

export const useWorkspaceManagementWorkspace = () => {
  const value = useContext(WorkspaceManagementWorkspaceContext);
  if (!value) throw new Error("useWorkspaceManagementWorkspace requires provider");
  return value;
};

export const WorkspaceManagementWorkspaceProvider = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <WorkspaceManagementWorkspaceContext.Provider
    value={{ capabilityId: "cap_workspace-management" }}
  >
    <section aria-label={title} className="flex min-h-[40vh] flex-col gap-4 px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  </WorkspaceManagementWorkspaceContext.Provider>
);
