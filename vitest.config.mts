/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  // `test` is added to Vite's UserConfig by vitest/config's module augmentation,
  // which Astro 7's bundled getViteConfig parameter type does not pick up. The
  // option is valid at runtime (Vitest reads it); only the static type is unaware.
  // @ts-expect-error -- see note above
  test: {
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.{ts,js}"],
      exclude: ["**/*.d.ts", "src/content/**/*", "**/*.astro", ".astro", "src/scripts/**/*"],
    },
  },
});
