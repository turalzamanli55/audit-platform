/**
 * Responsive design breakpoints.
 * Desktop-first architecture — scale down for smaller viewports.
 *
 * Targets: Desktop, Laptop, Tablet, iPad, Android, iPhone
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;
