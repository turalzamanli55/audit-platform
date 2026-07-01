import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type DetailLayoutProps = {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function DetailLayout({ children, aside, className }: DetailLayoutProps) {
  if (!aside) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start",
        className,
      )}
    >
      <div className="min-w-0">{children}</div>
      <aside className="min-w-0 xl:sticky xl:top-[calc(var(--ds-header-height)+1.5rem)]">
        {aside}
      </aside>
    </div>
  );
}
