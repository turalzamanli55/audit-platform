import "server-only";

import type { Database } from "@/types/supabase";
import type { CompanySettings } from "@/types/company";

export type CompanyWorkspaceView = {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  registrationNumber: string | null;
  description: string | null;
  status: Database["public"]["Enums"]["record_status"];
  createdAt: string;
  updatedAt: string;
  version: number;
  settingsVersion: number;
  isArchived: boolean;
  deletedAt: string | null;
  settings: CompanySettings;
};

export type CompanyWorkspaceLoadResult =
  | { ok: true; company: CompanyWorkspaceView }
  | {
      ok: false;
      reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error";
    };

export const COMPANY_WORKSPACE_SECTIONS = [
  "overview",
  "identity",
  "financial",
  "compliance",
  "contacts",
  "history",
  "settings",
] as const;

export type CompanyWorkspaceSection = (typeof COMPANY_WORKSPACE_SECTIONS)[number];
