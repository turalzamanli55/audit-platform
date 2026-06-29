/**
 * Shadow elevation system.
 */

export const shadows = {
  none: "none",
  xs: "var(--ds-shadow-xs)",
  sm: "var(--ds-shadow-sm)",
  md: "var(--ds-shadow-md)",
  lg: "var(--ds-shadow-lg)",
  xl: "var(--ds-shadow-xl)",
} as const;

export type ShadowKey = keyof typeof shadows;
