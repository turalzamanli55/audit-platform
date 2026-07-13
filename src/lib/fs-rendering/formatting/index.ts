import { DEFAULT_FS_RENDER_FORMATTING } from "@/constants/fs-rendering";
import type { FsRenderFormattingOptions } from "@/types/fs-rendering";

/**
 * Formatting Engine — currency, negatives, separators, zero suppression.
 * UI formatting only. No document export.
 */
export function resolveFormatting(
  overrides?: Partial<FsRenderFormattingOptions> | null,
): FsRenderFormattingOptions {
  return {
    ...DEFAULT_FS_RENDER_FORMATTING,
    ...(overrides ?? {}),
  };
}

export function formatAmount(
  amount: number | null | undefined,
  formatting: FsRenderFormattingOptions,
): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  if (formatting.zeroSuppression && amount === 0) return "";

  const absolute = Math.abs(amount);
  const fixed = absolute.toFixed(formatting.decimals);
  const [wholeRaw, fraction = ""] = fixed.split(".");
  const whole = formatting.thousandsSeparator
    ? (wholeRaw ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : (wholeRaw ?? "0");
  const body = formatting.decimals > 0 ? `${whole}.${fraction}` : whole;
  const withCurrency = formatting.multiCurrencyDisplay
    ? `${formatting.currencyCode} ${body}`
    : body;

  if (amount < 0) {
    return formatting.negativeStyle === "parentheses" ? `(${withCurrency})` : `-${withCurrency}`;
  }
  return withCurrency;
}
