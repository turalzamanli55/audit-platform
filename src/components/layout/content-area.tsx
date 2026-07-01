import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type ContentAreaProps = {
  children: ReactNode;
  className?: string;
  flush?: boolean;
};

export function ContentArea({ children, className = "", flush = false }: ContentAreaProps) {
  return (
    <main
      id="main-content"
      className={cn(
        "flex-1 overflow-y-auto bg-background",
        flush ? "p-0" : "px-4 py-6 md:px-8 md:py-8",
        className,
      )}
      role="main"
    >
      <div className={cn(!flush && "ds-container")}>{children}</div>
    </main>
  );
}
