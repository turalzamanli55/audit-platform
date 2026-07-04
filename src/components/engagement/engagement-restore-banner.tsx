import type { ReactNode } from "react";
import { WorkspaceNoticeBanner } from "@/components/workspace";

type EngagementRestoreBannerProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementRestoreBanner({
  title,
  description,
  action,
  className = "",
}: EngagementRestoreBannerProps) {
  return (
    <WorkspaceNoticeBanner
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
