import { getViteConfig } from "astro/config";
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig(
  getViteConfig({
    test: {
      include: ["tests/unit/**/*.test.ts"],
      coverage: {
        provider: "istanbul",
        include: ["src/**/*.{ts,js}"],
        exclude: ["**/*.d.ts", "src/content/**/*", "**/*.astro", ".astro", "src/scripts/**/*"],
      },
    },
  }),
);
