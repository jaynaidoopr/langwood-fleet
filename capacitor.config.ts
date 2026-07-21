import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kevin.gpsmobile',
  appName: 'Kevin GPS',
  webDir: 'dist',
  server: {
    // Load the bundled dist/ folder inside the app (no local dev server).
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
