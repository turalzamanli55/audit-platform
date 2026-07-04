import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import { WorkspaceProgressBar } from "./workspace-progress";
import { workspaceTokens } from "./workspace-tokens";

type WorkspaceHeroProps = {
  breadcrumb?: ReactNode;
  alerts?: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  badges?: ReactNode;
  progress?: { label: string; value: number };
  leading?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function WorkspaceHero({
  breadcrumb,
  alerts,
  eyebrow,
  title,
  subtitle,
  description,
  badges,
  progress,
  leading,
  action,
  className,
}: WorkspaceHeroProps) {
  return (
    <div className={cn(workspaceTokens.pageGap, className)}>
      {breadcrumb}
      {alerts}
      <div
        className={cn(
          "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
          workspaceTokens.heroBorder,
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-5 sm:gap-6">
          {leading}
          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              {eyebrow ? <p className={workspaceTokens.heroEyebrow}>{eyebrow}</p> : null}
              <h1 className={workspaceTokens.heroTitle}>{title}</h1>
              {subtitle ? <p className={workspaceTokens.heroSubtitle}>{subtitle}</p> : null}
              {description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  {description}
                </p>
              ) : null}
            </div>
            {badges ? <div className="flex flex-wrap items-center gap-2">{badges}</div> : null}
            {progress ? (
              <WorkspaceProgressBar label={progress.label} value={progress.value} />
            ) : null}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}

export function WorkspaceBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={workspaceTokens.backButton}>
      {label}
    </Link>
  );
}

export function WorkspaceHeroIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary sm:h-16 sm:w-16"
    >
      {children}
    </span>
  );
}
