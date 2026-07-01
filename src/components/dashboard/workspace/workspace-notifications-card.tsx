"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBell } from "@/components/ui/icons";
import { useNotifications } from "@/providers";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

type WorkspaceNotificationsCardProps = {
  labels: DashboardWorkspaceLabels["notifications"];
};

export function WorkspaceNotificationsCard({ labels }: WorkspaceNotificationsCardProps) {
  const { notifications, unreadCount } = useNotifications();
  const preview = notifications.slice(0, 4);

  return (
    <WorkspacePanel>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <IconBell />
          </span>
          <div>
            <h3 className="font-semibold tracking-tight">{labels.title}</h3>
            <p className="text-sm text-muted-foreground">{labels.description}</p>
          </div>
        </div>
        {unreadCount > 0 ? <Badge>{unreadCount}</Badge> : null}
      </div>

      {preview.length === 0 ? (
        <EmptyState
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          icon={<IconBell />}
          className="py-10"
        />
      ) : (
        <ul className="space-y-2">
          {preview.map((notification) => (
            <li
              key={notification.id}
              className="rounded-2xl border border-border/40 bg-muted/10 px-4 py-3"
            >
              <p className="text-sm font-medium text-foreground">{notification.title}</p>
              {notification.message ? (
                <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </WorkspacePanel>
  );
}
