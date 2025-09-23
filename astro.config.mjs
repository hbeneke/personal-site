import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://equero.dev",
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes("404") && !page.includes("_draft"),
      customPages: [],
    }),
  ],
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
