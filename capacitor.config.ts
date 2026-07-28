import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.goug.travel",
  appName: "GoUG",
  webDir: "dist",
  backgroundColor: "#0b2418",
  android: {
    allowMixedContent: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0b2418",
      showSpinner: false
    }
  }
};

export default config;
