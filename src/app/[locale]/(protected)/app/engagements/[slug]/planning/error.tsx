"use client";

import { EngagementWorkspaceError } from "@/components/engagement/workspace";

export default function PlanningError() {
  return (
    <EngagementWorkspaceError
      title="Unable to load planning workspace"
      description="Something went wrong while loading audit planning."
    />
  );
}
