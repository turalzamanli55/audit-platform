/**
 * Animation and transition tokens.
 */

export const duration = {
  instant: "0ms",
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;

export const easing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const animation = {
  fadeIn: "ds-fade-in var(--ds-duration-normal) var(--ds-easing-default)",
  slideIn: "ds-slide-in var(--ds-duration-normal) var(--ds-easing-out)",
  spin: "ds-spin 1s linear infinite",
} as const;
