import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "overline";

const variantClasses: Record<TypographyVariant, string> = {
  display: "ds-typography-display",
  h1: "ds-typography-h1",
  h2: "ds-typography-h2",
  h3: "ds-typography-h3",
  h4: "ds-typography-h4",
  body: "ds-typography-body",
  "body-sm": "ds-typography-body-sm",
  caption: "ds-typography-caption",
  overline: "ds-typography-overline",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  overline: "span",
};

type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
};

export function Typography({
  variant = "body",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];
  return (
    <Component className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Component>
  );
}
