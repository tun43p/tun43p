import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // ponytail: all pages are static, so prerender instead of running SSR on Workers
  server: {
    preset: "static",
    prerender: { crawlLinks: true },
  },
  vite: {
    plugins: [tailwindcss()],
    // notes/ lives at the repo root, one level above the app
    server: { fs: { allow: [".."] } },
  },
});
