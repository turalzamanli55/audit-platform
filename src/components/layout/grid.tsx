import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type DashboardLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return <div className={cn("space-y-10", className)}>{children}</div>;
}

type GridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

const gapClasses = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function Grid({ children, cols = 2, gap = "md", className }: GridProps) {
  return <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>{children}</div>;
}
