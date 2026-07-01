import type { Tables } from "./supabase";

export type TenantBootstrap = {
  organizations: Array<Pick<Tables<"organizations">, "id" | "name" | "slug">>;
  workspaces: Array<Pick<Tables<"workspaces">, "id" | "name" | "slug" | "organization_id">>;
  currentOrganizationId: string | null;
  currentWorkspaceId: string | null;
  hasOrganization: boolean;
  hasWorkspace: boolean;
  permissionCodes: string[];
  roleSlugs: string[];
};
