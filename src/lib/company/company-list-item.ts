import "server-only";

import type { Database } from "@/types/supabase";

export type CompanyListItem = {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  jurisdiction: string;
  reportingFramework: string;
  status: Database["public"]["Enums"]["record_status"];
  updatedAt: string;
  version: number;
  isArchived: boolean;
};

export type CompanyListLoadResult =
  | { ok: true; items: CompanyListItem[] }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" };
