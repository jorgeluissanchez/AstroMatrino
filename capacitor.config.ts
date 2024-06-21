import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matrino.proc',
  appName: 'matrino',
  webDir: 'dist',
  server: {
    androidScheme: "https",
    url: "https://astro-matrino.vercel.app",
    cleartext: true
  },
};

export default config;
