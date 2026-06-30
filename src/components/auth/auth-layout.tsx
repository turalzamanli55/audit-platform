import type { ReactNode } from "react";
import { Card } from "@/components/ui";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md animate-[ds-slide-in_300ms_var(--ds-easing-out)]">
        {children}
      </Card>
    </div>
  );
}
