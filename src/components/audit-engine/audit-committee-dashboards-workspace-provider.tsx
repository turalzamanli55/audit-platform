"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { AuditCommitteeDashboardsWorkspace } from "./audit-committee-dashboards-workspace";

type AuditCommitteeDashboardsWorkspaceContextValue = {
  capabilityId: "cap_audit-committee-dashboards";
};

const AuditCommitteeDashboardsWorkspaceContext =
  createContext<AuditCommitteeDashboardsWorkspaceContextValue | null>(null);

export const useAuditCommitteeDashboardsWorkspace = () => {
  const value = useContext(AuditCommitteeDashboardsWorkspaceContext);
  if (!value) {
    throw new Error("useAuditCommitteeDashboardsWorkspace requires provider");
  }
  return value;
};

export const AuditCommitteeDashboardsWorkspaceProvider = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <AuditCommitteeDashboardsWorkspaceContext.Provider
    value={{ capabilityId: "cap_audit-committee-dashboards" }}
  >
    <AuditCommitteeDashboardsWorkspace title={title} subtitle={subtitle}>
      {children}
    </AuditCommitteeDashboardsWorkspace>
  </AuditCommitteeDashboardsWorkspaceContext.Provider>
);
