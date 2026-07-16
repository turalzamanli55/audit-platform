/**
 * EPIRE — Enterprise Platform Inventory & Readiness Engine.
 * PROJECT_BIBLE.md is the only source of truth.
 * Inputs: EPBSE + EPAC + ECIE + EIIE (no duplicated scoring logic).
 */
export * from "@/lib/platform-inventory/types";
export * from "@/lib/platform-inventory/resolver";
export * from "@/lib/platform-inventory/inventory";
export * from "@/lib/platform-inventory/domains";
export * from "@/lib/platform-inventory/modules";
export * from "@/lib/platform-inventory/features";
export * from "@/lib/platform-inventory/capabilities";
export * from "@/lib/platform-inventory/health";
export * from "@/lib/platform-inventory/readiness";
export * from "@/lib/platform-inventory/completion";
export * from "@/lib/platform-inventory/scoring";
export * from "@/lib/platform-inventory/graph";
export * from "@/lib/platform-inventory/reporting";
export * from "@/lib/platform-inventory/dashboard";
export * from "@/lib/platform-inventory/engine";
