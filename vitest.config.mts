/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig(
  getViteConfig({
    test: {
      include: ["tests/unit/**/*.test.ts"],
      coverage: {
        provider: "istanbul",
        include: ["src/**/*.{ts,js}"],
        exclude: ["**/*.d.ts", "src/content/**/*", "**/*.astro", ".astro"],
      },
    },
  }),
);
