import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Hisaab-Khata · Loan Interest Calculator",
        short_name: "Hisaab-Khata",
        description: "Bilingual loan interest calculator with date-range and EMI tracker modes.",
        theme_color: "#9b3a2e",
        background_color: "#f3ecda",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        // Precache the whole app shell so repeat loads (and offline use) are instant.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
    }),
  ],
  build: {
    // content-hashed filenames -> safe to cache forever (see vercel.json)
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
