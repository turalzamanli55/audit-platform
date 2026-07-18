import { FoundationNotice, PlatformPageHeader, PlatformSection } from "@/components/platform-console/platform-primitives";

export default function PlatformImpersonationPage() {
  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Impersonation"
        description="The Platform Owner may securely impersonate tenant users for support. Every impersonation is audited."
      />
      <FoundationNotice>
        Impersonation is a foundation in this sprint — the audit-first policy is defined below and no
        impersonation session is currently active.
      </FoundationNotice>
      <PlatformSection title="Policy">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="rounded-lg border px-3 py-2">Impersonation requires an explicit support reason.</li>
          <li className="rounded-lg border px-3 py-2">Every impersonation start and stop is recorded as a security event.</li>
          <li className="rounded-lg border px-3 py-2">The Platform Owner can impersonate Tenant Admin, Manager, and Auditor roles only.</li>
        </ul>
      </PlatformSection>
    </div>
  );
}
