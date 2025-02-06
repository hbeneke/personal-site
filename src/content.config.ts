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
        description: z.string(),
        responsibilities: z.array(z.string()),
      })
    ),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    notes: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
      })
    ),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    link: z.string().optional(),
  }),
});

export const collections = { resume, notes, projects };
