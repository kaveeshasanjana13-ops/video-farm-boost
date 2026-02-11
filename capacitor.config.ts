import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lk.suraksha.lms',
  appName: 'Suraksha LMS',
  webDir: 'dist',
  // For production:
  server: {
    url: 'https://lms.suraksha.lk',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: "#1976D2",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1976D2'
    },
    PushNotifications: {
      // Android: presentationOptions determine how notifications appear when app is in foreground
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;