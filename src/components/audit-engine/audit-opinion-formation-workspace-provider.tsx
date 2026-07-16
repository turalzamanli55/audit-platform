"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { AuditOpinionFormationWorkspace } from "./audit-opinion-formation-workspace";

type AuditOpinionFormationWorkspaceContextValue = {
  capabilityId: "cap_audit-opinion-formation";
};

const AuditOpinionFormationWorkspaceContext =
  createContext<AuditOpinionFormationWorkspaceContextValue | null>(null);

export const useAuditOpinionFormationWorkspace = () => {
  const value = useContext(AuditOpinionFormationWorkspaceContext);
  if (!value) {
    throw new Error("useAuditOpinionFormationWorkspace requires provider");
  }
  return value;
};

export const AuditOpinionFormationWorkspaceProvider = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <AuditOpinionFormationWorkspaceContext.Provider
    value={{ capabilityId: "cap_audit-opinion-formation" }}
  >
    <AuditOpinionFormationWorkspace title={title} subtitle={subtitle}>
      {children}
    </AuditOpinionFormationWorkspace>
  </AuditOpinionFormationWorkspaceContext.Provider>
);
