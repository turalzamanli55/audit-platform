import type { ReactNode } from "react";
import { WorkspaceNoticeBanner } from "@/components/workspace";

type CompanyRestoreBannerProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function CompanyRestoreBanner({
  title = "This company is archived",
  description = "The profile is read-only. Restore the company to make changes again.",
  action,
  className = "",
}: CompanyRestoreBannerProps) {
  return (
    <WorkspaceNoticeBanner
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
