// src/pages/AllNotificationsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForceRefresh } from '@/hooks/useForceRefresh';
import { Bell, CheckCheck, RefreshCw, Filter } from 'lucide-react';
import { notificationApiService, Notification } from '@/services/notificationApiService';
import { DateGroupedNotifications } from '@/components/notifications/DateGroupedNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * All Notifications Page — Unified Inbox
 * Uses GET /push-notifications/my endpoint
 * Shows all notifications across all scopes (GLOBAL, INSTITUTE, CLASS, SUBJECT)
 */
const AllNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerForceRefresh } = useForceRefresh();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const result = await notificationApiService.getMyNotifications({
        page,
        limit: 15,
        isRead: filter === 'unread' ? false : undefined,
        scope: scopeFilter !== 'ALL' ? scopeFilter as any : undefined,
      });
      setNotifications(result.data || []);
      setTotalPages(result.totalPages || 1);
      if (result.unreadCount !== undefined) {
        setUnreadCount(result.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, filter, scopeFilter]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await notificationApiService.getMyUnreadCount();
      setUnreadCount(result.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, scopeFilter]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApiService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApiService.markAllMyNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleRefresh = () => {
    triggerForceRefresh();
    loadNotifications();
    loadUnreadCount();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">All Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      <p className="text-sm sm:text-base text-muted-foreground">
        View all your notifications across all institutes and system announcements.
      </p>

      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 p-3 sm:p-6 pb-3 sm:pb-4">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2 sm:px-3 h-7">All</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs px-2 sm:px-3 h-7">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs value={scopeFilter} onValueChange={setScopeFilter}>
                <TabsList className="h-8">
                  <TabsTrigger value="ALL" className="text-xs px-2 sm:px-3 h-7">All</TabsTrigger>
                  <TabsTrigger value="GLOBAL" className="text-xs px-2 sm:px-3 h-7">System</TabsTrigger>
                  <TabsTrigger value="INSTITUTE" className="text-xs px-2 sm:px-3 h-7">Institute</TabsTrigger>
                  <TabsTrigger value="CLASS" className="text-xs px-2 sm:px-3 h-7">Class</TabsTrigger>
                  <TabsTrigger value="SUBJECT" className="text-xs px-2 sm:px-3 h-7">Subject</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                >
                  <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Read all</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading && notifications.length === 0 ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <DateGroupedNotifications
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClick={handleNotificationClick}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllNotificationsPage;
