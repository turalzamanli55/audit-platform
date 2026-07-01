import type { ReactNode } from "react";
import { AuthIllustration } from "./auth-illustration";
import { cn } from "@/lib/ui/cn";

type AuthLayoutProps = {
  children: ReactNode;
  variant?: "centered" | "split";
  illustrationLabel?: string;
  aside?: ReactNode;
  className?: string;
};

export function AuthLayout({
  children,
  variant = "centered",
  illustrationLabel = "Authentication",
  aside,
  className,
}: AuthLayoutProps) {
  if (variant === "split") {
    return (
      <div className={cn("w-full max-w-6xl", className)}>
        <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/40 shadow-xl lg:grid lg:grid-cols-2">
          <div className="relative hidden min-h-[36rem] lg:block">
            <AuthIllustration label={illustrationLabel} className="min-h-full rounded-none border-0" />
            {aside ? (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-10 xl:p-12">
                <div className="max-w-md space-y-6">{aside}</div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center p-6 sm:p-8 lg:p-10 xl:p-12">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full max-w-md flex-col items-stretch", className)}>
      {children}
    </div>
  );
}
