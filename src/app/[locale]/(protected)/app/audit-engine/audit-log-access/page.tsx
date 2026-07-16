import {
  AuditLogAccessPanel,
  AuditLogAccessWorkspaceProvider,
} from "@/components/audit-engine";

export default function AuditLogAccessPage() {
  return (
    <AuditLogAccessWorkspaceProvider
      title="Audit log access"
      subtitle="Tenant-scoped audit trail access and export for administrators."
    >
      <AuditLogAccessPanel entries={[]} />
    </AuditLogAccessWorkspaceProvider>
  );
}
