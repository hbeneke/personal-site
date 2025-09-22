import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://equero.dev",
  integrations: [tailwind(), sitemap()],
  adapter: vercel(),
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@types": "/src/types/index.ts",
        "@scripts": "/src/scripts",
        "@icons": "/public/icons",
      },
    },
  },
});
