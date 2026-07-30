import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.goug.travel",
  appName: "GoUG",
  webDir: "dist/client",
  backgroundColor: "#0b2418",
  server: {
    url: "https://hillary520.github.io/GO_UG/",
    cleartext: false
  },
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
