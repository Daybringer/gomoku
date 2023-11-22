// vite.config.js
const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { checker } from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // checker({ vueTsc: true })
  ],
  build: { outDir: "./dist" },
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
    port: 8080,
  },

  preview: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
