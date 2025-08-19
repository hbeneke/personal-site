import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  integrations: [tailwind()],
  adapter: vercel(),
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@types": "/src/types/index.ts",
      },
    },
  },
});
