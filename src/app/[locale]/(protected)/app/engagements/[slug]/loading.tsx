import { EngagementLoadingSkeleton, EngagementPageShell } from "@/components/engagement";

export default function EngagementWorkspaceRouteLoading() {
  return (
    <EngagementPageShell className="max-w-[90rem]">
      <EngagementLoadingSkeleton variant="detail" />
    </EngagementPageShell>
  );
}
