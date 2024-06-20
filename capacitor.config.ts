import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matrino.proc',
  appName: 'matrino',
  webDir: 'dist',
  server: {
    androidScheme: "https",
    url: "http://192.168.1.10:4321",
    cleartext: true
  },
};

export default config;
