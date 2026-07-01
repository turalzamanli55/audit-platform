import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type PublicLinkButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "md" | "lg";
  children: ReactNode;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-transparent hover:bg-muted",
  ghost: "bg-transparent hover:bg-muted",
};

const sizes = {
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function PublicLinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PublicLinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] motion-reduce:transform-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
