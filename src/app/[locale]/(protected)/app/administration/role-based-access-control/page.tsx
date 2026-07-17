import { RoleBasedAccessControlWorkspaceProvider } from "@/components/role-based-access-control/role-based-access-control-workspace-provider";

export default function RoleBasedAccessControlPage() {
  return (
    <RoleBasedAccessControlWorkspaceProvider title="Role-based access control">
      <p className="text-sm text-muted-foreground">
        Assign platform, tenant, and workspace roles with deny-by-default permissions.
      </p>
    </RoleBasedAccessControlWorkspaceProvider>
  );
}
