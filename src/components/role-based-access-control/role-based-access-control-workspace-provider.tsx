"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type RoleBasedAccessControlWorkspaceContextValue = {
  capabilityId: "cap_role-based-access-control";
};

const RoleBasedAccessControlWorkspaceContext =
  createContext<RoleBasedAccessControlWorkspaceContextValue | null>(null);

export const useRoleBasedAccessControlWorkspace = () => {
  const value = useContext(RoleBasedAccessControlWorkspaceContext);
  if (!value) throw new Error("useRoleBasedAccessControlWorkspace requires provider");
  return value;
};

export const RoleBasedAccessControlWorkspaceProvider = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <RoleBasedAccessControlWorkspaceContext.Provider
    value={{ capabilityId: "cap_role-based-access-control" }}
  >
    <section aria-label={title} className="flex min-h-[40vh] flex-col gap-4 px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  </RoleBasedAccessControlWorkspaceContext.Provider>
);
