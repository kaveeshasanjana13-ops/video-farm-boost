// public/firebase-messaging-sw.js
// Firebase Messaging Service Worker for background notifications (Web only)
// Note: This service worker is only used in web browsers, not in native Capacitor apps

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config will be injected at runtime via message from main app
// This allows us to avoid hardcoding sensitive values
let firebaseInitialized = false;

// Listen for config message from main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    if (!firebaseInitialized) {
      try {
        firebase.initializeApp(event.data.config);
        firebaseInitialized = true;
        initializeMessaging();
      } catch (error) {
        // silent
      }
    }
  }
});

// Fallback: Try to initialize with config from query params (set during registration)
// This is a backup method if message passing fails
const urlParams = new URL(self.location).searchParams;
const configParam = urlParams.get('firebaseConfig');
if (configParam && !firebaseInitialized) {
  try {
    const config = JSON.parse(decodeURIComponent(configParam));
    firebase.initializeApp(config);
    firebaseInitialized = true;
    initializeMessaging();
  } catch (error) {
    // silent
  }
}

function initializeMessaging() {
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/favicon.png',
      badge: '/favicon.png',
      image: payload.notification?.image,
      data: payload.data,
      tag: payload.data?.notificationId || 'default',
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/notifications';

  // Determine if actionUrl is external (different origin) or internal
  const appOrigin = self.location.origin;
  let isExternal = false;
  let targetAbsolute = actionUrl;

  if (actionUrl.startsWith('http')) {
    try {
      const parsed = new URL(actionUrl);
      isExternal = parsed.origin !== appOrigin;
      targetAbsolute = actionUrl;
    } catch (_) {
      // malformed URL — treat as internal path
    }
  } else {
    targetAbsolute = appOrigin + actionUrl;
  }

  if (isExternal) {
    // Open external site directly in a new tab — no in-app navigation
    event.waitUntil(
      clients.openWindow(actionUrl)
    );
    return;
  }

  // Internal — focus existing app tab and post message, or open new tab
  const targetPath = actionUrl.startsWith('http') ? new URL(actionUrl).pathname : actionUrl;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          // Pass full original URL so the hook can decide path+search+hash
          client.postMessage({ type: 'NAVIGATE_TO', url: actionUrl, path: targetPath });
          return;
        }
      }
      // App not open — open new tab
      if (clients.openWindow) {
        return clients.openWindow(targetAbsolute);
      }
    })
  );
});
