/**
 * Border radius scale.
 */

export const radius = {
  none: "0",
  sm: "var(--ds-radius-sm)",
  md: "var(--ds-radius-md)",
  lg: "var(--ds-radius-lg)",
  xl: "var(--ds-radius-xl)",
  "2xl": "var(--ds-radius-2xl)",
  full: "9999px",
} as const;

export type RadiusKey = keyof typeof radius;
