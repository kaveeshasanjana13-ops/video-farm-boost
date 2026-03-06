import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lk.suraksha.lms',
  appName: 'Suraksha LMS',
  webDir: 'dist',

  // ============================================================
  // LIVE URL MODE:
  // The app loads from https://lms.suraksha.lk (S3).
  // - Hashed JS/CSS files are cached by the browser (1 year, immutable)
  //   → NOT re-downloaded unless you deploy new code.
  // - Only index.html (~3KB, no-cache) is fetched fresh on each open
  //   → If you deployed new code, it picks up the new bundles.
  //   → If nothing changed, same cached bundles are reused (zero download).
  // - Small UI/image/feature changes reflect INSTANTLY on next app open.
  // - Only a Play Store update is needed for native plugin changes.
  // ============================================================
  server: {
    url: 'https://lms.suraksha.lk',
    allowNavigation: ['*.suraksha.lk'],
  },

  android: {
    // Disable cleartext (HTTP) traffic — enforce HTTPS only
    allowMixedContent: false,
    backgroundColor: '#F0F6FF',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#F0F6FF',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#0039B3',
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Keyboard: {
      resize: 'body',
      scrollAssist: true,
      scrollPadding: true,
    },
  },
};

export default config;