import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        auth: resolve(__dirname, "auth.html"),
        saved: resolve(__dirname, "saved.html"),
      },
    },
  },
});