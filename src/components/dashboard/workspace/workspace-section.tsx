import type { ReactNode } from "react";
import { WorkspacePanel, workspaceTokens } from "@/components/workspace";
import { cn } from "@/lib/ui/cn";

type WorkspaceSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function WorkspaceSection({
  title,
  description,
  action,
  children,
  className,
  id,
}: WorkspaceSectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn(workspaceTokens.sectionGap, className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2
            id={id ? `${id}-title` : undefined}
            className={workspaceTokens.sectionTitle}
          >
            {title}
          </h2>
          {description ? (
            <p className={workspaceTokens.sectionDescription}>{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export { WorkspacePanel };
