// vite.config.js
const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: { outDir: "../dist/public" },
  server: {
    proxy: {
      "/api": "http://localhost:3000/",
      "/app": "http://localhost:3000/app",
    },
    port: 8080,
  },
  preview: {
    proxy: {
      "/api": "http://localhost:3000/",
    },
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
