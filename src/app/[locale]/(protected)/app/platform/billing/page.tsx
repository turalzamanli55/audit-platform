import { FoundationNotice, PlatformPageHeader, PlatformSection } from "@/components/platform-console/platform-primitives";

export default function PlatformBillingPage() {
  const providers = ["Stripe", "Paddle", "Invoices", "Bank Transfer"];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Billing"
        description="Billing foundation. Payment-gateway hooks are prepared for future integration."
      />
      <FoundationNotice>
        Billing is a foundation in this sprint — no payment gateway is wired. The integration hooks
        below are prepared for a later sprint.
      </FoundationNotice>
      <PlatformSection title="Prepared Providers">
        <ul className="grid gap-2 sm:grid-cols-2">
          {providers.map((provider) => (
            <li key={provider} className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
              {provider}
            </li>
          ))}
        </ul>
      </PlatformSection>
    </div>
  );
}
