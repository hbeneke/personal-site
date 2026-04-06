import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://equero.dev",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("404") &&
        !page.includes("_draft") &&
        !page.includes("/resume/print"),
      customPages: [],
    }),
  ],
  adapter: vercel(),
  output: "static",
  vite: {
    plugins: [tailwindcss()],
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
