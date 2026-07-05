import type { ReactNode } from "react";
import { WorkspaceError } from "@/components/workspace";

type CompanyErrorStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function CompanyErrorState({
  title,
  description,
  action,
  className,
}: CompanyErrorStateProps) {
  return (
    <WorkspaceError
      title={String(title)}
      description={String(description)}
      action={action}
      className={className}
    />
  );
}
