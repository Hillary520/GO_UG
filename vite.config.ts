import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "GoUG — Uganda in your pocket",
        short_name: "GoUG",
        description:
          "Discover Uganda's remarkable places, people, food and experiences.",
        theme_color: "#0b2418",
        background_color: "#f5f1e7",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        icons: [
          {
            src: "/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "goug-images",
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase")) return "firebase";
          if (id.includes("node_modules/react")) return "react";
          if (id.includes("node_modules/lucide-react")) return "icons";
        }
      }
    }
  }
});
