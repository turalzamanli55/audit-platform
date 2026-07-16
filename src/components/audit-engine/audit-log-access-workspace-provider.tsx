"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { AuditLogAccessWorkspace } from "./audit-log-access-workspace";

type AuditLogAccessWorkspaceContextValue = {
  capabilityId: "cap_audit-log-access";
};

const AuditLogAccessWorkspaceContext =
  createContext<AuditLogAccessWorkspaceContextValue | null>(null);

export const useAuditLogAccessWorkspace = () => {
  const value = useContext(AuditLogAccessWorkspaceContext);
  if (!value) {
    throw new Error("useAuditLogAccessWorkspace requires provider");
  }
  return value;
};

export const AuditLogAccessWorkspaceProvider = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <AuditLogAccessWorkspaceContext.Provider
    value={{ capabilityId: "cap_audit-log-access" }}
  >
    <AuditLogAccessWorkspace title={title} subtitle={subtitle}>
      {children}
    </AuditLogAccessWorkspace>
  </AuditLogAccessWorkspaceContext.Provider>
);
