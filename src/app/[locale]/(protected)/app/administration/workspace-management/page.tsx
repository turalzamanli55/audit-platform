import { WorkspaceManagementWorkspaceProvider } from "@/components/workspace-management/workspace-management-workspace-provider";

export default function WorkspaceManagementPage() {
  return (
    <WorkspaceManagementWorkspaceProvider title="Workspace management">
      <p className="text-sm text-muted-foreground">
        Configure workspace settings, feature flags, and tenant administration boundaries.
      </p>
    </WorkspaceManagementWorkspaceProvider>
  );
}
