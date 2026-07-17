/**
 * Billing foundation hooks only — no payment gateway implementation.
 * Future adapters: Stripe, Paddle, invoices, bank transfer.
 */

export type BillingProviderId = "stripe" | "paddle" | "invoice" | "bank_transfer";

export type BillingHookContext = {
  organizationId: string;
  planCode: string;
  currency?: string;
};

export type BillingProviderAdapter = {
  id: BillingProviderId;
  createCheckoutSession(context: BillingHookContext): Promise<{ checkoutUrl: string | null }>;
  createInvoice(context: BillingHookContext): Promise<{ invoiceId: string | null }>;
};

export function createBillingFoundationRegistry(): Map<BillingProviderId, BillingProviderAdapter> {
  return new Map();
}

export function assertBillingHookReady(providerId: BillingProviderId): void {
  if (!providerId) {
    throw new Error("Billing provider id is required");
  }
}
