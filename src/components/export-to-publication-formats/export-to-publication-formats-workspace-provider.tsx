"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type ExportToPublicationFormatsWorkspaceContextValue = {
  capabilityId: "cap_export-to-publication-formats";
};

const ExportToPublicationFormatsWorkspaceContext =
  createContext<ExportToPublicationFormatsWorkspaceContextValue | null>(null);

export const useExportToPublicationFormatsWorkspace = () => {
  const value = useContext(ExportToPublicationFormatsWorkspaceContext);
  if (!value) {
    throw new Error("useExportToPublicationFormatsWorkspace requires provider");
  }
  return value;
};

export const ExportToPublicationFormatsWorkspaceProvider = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <ExportToPublicationFormatsWorkspaceContext.Provider
    value={{ capabilityId: "cap_export-to-publication-formats" }}
  >
    <section aria-label={title} className="flex min-h-[40vh] flex-col gap-4 px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  </ExportToPublicationFormatsWorkspaceContext.Provider>
);
