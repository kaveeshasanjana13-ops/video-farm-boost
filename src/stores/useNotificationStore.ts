// src/stores/useNotificationStore.ts
// Global notification state — call initUnreadCount ONCE on app load, then manage locally.
import { useState, useCallback, useRef } from 'react';
import { notificationApiService } from '@/services/notificationApiService';

// Simple singleton store pattern (no external dependencies)
let globalUnreadCount = 0;
let isCountLoaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useNotificationStore() {
  const [, forceUpdate] = useState(0);
  const registered = useRef(false);

  if (!registered.current) {
    registered.current = true;
    const listener = () => forceUpdate((c) => c + 1);
    listeners.add(listener);
    // We intentionally don't clean up to keep the store alive across mounts/unmounts
    // in the same session. For a React app that doesn't hot-swap root, this is fine.
  }

  const initUnreadCount = useCallback(async () => {
    if (isCountLoaded) return;
    try {
      const { unreadCount } = await notificationApiService.getMyUnreadCount();
      globalUnreadCount = unreadCount || 0;
      isCountLoaded = true;
      notify();
    } catch (e) {
      console.error('Failed to load unread count:', e);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const { unreadCount } = await notificationApiService.getMyUnreadCount();
      globalUnreadCount = unreadCount || 0;
      isCountLoaded = true;
      notify();
    } catch (e) {
      console.error('Failed to refresh unread count:', e);
    }
  }, []);

  const decrementUnread = useCallback((count = 1) => {
    globalUnreadCount = Math.max(0, globalUnreadCount - count);
    notify();
  }, []);

  const incrementUnread = useCallback((count = 1) => {
    globalUnreadCount = globalUnreadCount + count;
    notify();
  }, []);

  const resetUnread = useCallback(() => {
    globalUnreadCount = 0;
    notify();
  }, []);

  const setUnread = useCallback((count: number) => {
    globalUnreadCount = count;
    isCountLoaded = true;
    notify();
  }, []);

  return {
    globalUnreadCount,
    isCountLoaded,
    initUnreadCount,
    refreshUnreadCount,
    decrementUnread,
    incrementUnread,
    resetUnread,
    setUnread,
  };
}
