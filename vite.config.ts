import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifestFilename: "manifest.json",
      injectRegister: "auto",
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
        type: "module",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Exclude large files from precaching
        globIgnores: ["**/intro.webp", "**/pabji.svg", "**/contact-us.svg"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB limit
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
            },
          },
          // Cache API calls
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              networkTimeoutSeconds: 10,
            },
          },
          // Cache images on demand
          {
            urlPattern: /\.(?:svg|jpg|jpeg|png|webp|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "آریانا مهاجر - خدمات گیمینگ و سیم‌کارت",
        short_name: "آریانا",
        description:
          "خرید سریع یوسی پابجی، سی‌پی کالاف دیوتی و سیم‌کارت‌های بین‌المللی با تحویل فوری",
        theme_color: "#dc2626",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        lang: "fa",
        dir: "rtl",
        categories: ["games", "entertainment", "business"],
        icons: [
          {
            src: "icons/ariyana-logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/ariyana-logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/ariyana-logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/ariyana-logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [],
        prefer_related_applications: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
