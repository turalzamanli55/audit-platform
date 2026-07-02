import "server-only";

import { notFound } from "next/navigation";
import { loadCompanyWorkspaceCached } from "@/lib/company/load-company-workspace";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";

export type CompanyWorkspacePageResult =
  | { ok: true; company: CompanyWorkspaceView }
  | {
      ok: false;
      reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error";
    };

export async function loadCompanyWorkspacePage(slug: string): Promise<CompanyWorkspacePageResult> {
  return loadCompanyWorkspaceCached(slug);
}

export async function requireCompanyWorkspace(slug: string): Promise<CompanyWorkspaceView> {
  const result = await loadCompanyWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }
    throw new Error(`company_workspace_${result.reason}`);
  }

  return result.company;
}
