import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/50 bg-card/90 p-8 shadow-lg backdrop-blur-sm sm:p-10 ds-animate-scale-in motion-reduce:animate-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
