import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const resume = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resume" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    experience: z.array(
      z.object({
        company: z.string(),
        role: z.string(),
        duration: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const collections = { resume };
