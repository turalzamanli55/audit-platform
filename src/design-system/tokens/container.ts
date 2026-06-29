/**
 * Container width system — content max-widths per breakpoint context.
 */

export const containerWidths = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  prose: "65ch",
  shell: "100%",
} as const;

export type ContainerWidth = keyof typeof containerWidths;
