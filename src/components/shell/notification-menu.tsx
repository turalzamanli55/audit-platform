"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconBell } from "@/components/ui/icons";
import { useNotifications } from "@/providers";
import { cn } from "@/lib/ui/cn";

type NotificationMenuLabels = {
  title: string;
  empty: string;
  markAllRead: string;
};

type NotificationMenuProps = {
  labels: NotificationMenuLabels;
  className?: string;
};

export function NotificationMenu({ labels, className }: NotificationMenuProps) {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();

  return (
    <DropdownMenu
      className={className}
      align="end"
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          aria-label={labels.title}
        >
          <IconBell />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      }
    >
      <DropdownMenuLabel>{labels.title}</DropdownMenuLabel>
      {notifications.length > 0 ? (
        <>
          <div className="px-1.5 pb-1">
            <button
              type="button"
              onClick={markAllAsRead}
              className="w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-xs font-medium text-primary transition-colors duration-200 hover:bg-muted active:scale-[0.99] motion-reduce:transform-none"
            >
              {labels.markAllRead}
            </button>
          </div>
          <DropdownMenuSeparator />
        </>
      ) : null}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground shadow-xs">
              <IconBell width={22} height={22} />
            </span>
            <p className="text-sm font-medium text-foreground">{labels.title}</p>
            <p className="max-w-[14rem] text-sm leading-relaxed text-muted-foreground">{labels.empty}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onSelect={() => {
                markAsRead(notification.id);
                if (notification.href) {
                  router.push(notification.href);
                } else {
                  dismiss(notification.id);
                }
              }}
              className={cn("flex-col items-start gap-0.5", !notification.read && "bg-accent/30")}
            >
              <span className="font-medium">{notification.title}</span>
              {notification.message ? (
                <span className="text-xs text-muted-foreground">{notification.message}</span>
              ) : null}
            </DropdownMenuItem>
          ))
        )}
      </div>
    </DropdownMenu>
  );
}
