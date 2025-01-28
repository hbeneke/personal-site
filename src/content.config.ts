import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const resume = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resume" }),
  schema: z.object({
    work_experience: z.array(
      z.object({
        company: z.string(),
        website: z.string().optional(),
        company_url: z.string().optional(),
        startup: z.boolean().default(false),
        location: z.string().optional(),
        position: z.string(),
        start_date: z.string(),
        end_date: z.string(),
        responsibilities: z.array(z.string()),
      })
    ),
  }),
});

export const collections = { resume };
