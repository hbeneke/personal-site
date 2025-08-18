import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import vue from "@astrojs/vue";

export default defineConfig({
  integrations: [tailwind(), vue()],
  adapter: vercel(),
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@types": "/src/types/index.ts",
      },
    },
  },
});
