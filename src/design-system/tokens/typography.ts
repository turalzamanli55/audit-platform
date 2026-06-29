/**
 * Typography scale — enterprise professional UI.
 */

export const fontFamily = {
  sans: "var(--ds-font-sans)",
  mono: "var(--ds-font-mono)",
} as const;

export const fontSize = {
  xs: "var(--ds-text-xs)",
  sm: "var(--ds-text-sm)",
  base: "var(--ds-text-base)",
  lg: "var(--ds-text-lg)",
  xl: "var(--ds-text-xl)",
  "2xl": "var(--ds-text-2xl)",
  "3xl": "var(--ds-text-3xl)",
  "4xl": "var(--ds-text-4xl)",
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
} as const;

export const letterSpacing = {
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
} as const;
