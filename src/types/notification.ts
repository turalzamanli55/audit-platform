export type NotificationSeverity = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  title: string;
  message?: string;
  severity: NotificationSeverity;
  read: boolean;
  createdAt: string;
  href?: string;
};

export type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
};
