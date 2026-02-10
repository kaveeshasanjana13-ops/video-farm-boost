// src/components/notifications/DateGroupedNotifications.tsx
import React from 'react';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import type { Notification } from '@/services/notificationApiService';
import { NotificationItem } from './NotificationItem';

interface DateGroupedNotificationsProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

function getDateLabel(dateString: string): string {
  if (!dateString) return 'Notifications';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Notifications';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisYear(date)) return format(date, 'MMMM d');
  return format(date, 'MMMM d, yyyy');
}

function groupByDate(notifications: Notification[]): { label: string; items: Notification[] }[] {
  const groups: Map<string, Notification[]> = new Map();
  
  for (const notification of notifications) {
    const label = getDateLabel(notification.sentAt || notification.createdAt || '');
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(notification);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export const DateGroupedNotifications: React.FC<DateGroupedNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onClick,
}) => {
  const groups = groupByDate(notifications);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.label}>
          <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-1.5 border-b">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {group.label}
            </span>
          </div>
          <div className="divide-y">
            {group.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
