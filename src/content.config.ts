import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const resume = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/resume" }),
	schema: z.object({
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
	}),
});

const notes = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
	schema: z.object({
		title: z.string(),
		publishDate: z.string(),
		slug: z.string(),
		description: z.string(),
		starred: z.boolean().default(false),
	}),
});

const portfolioProjects = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
	schema: z.object({
		projects: z.array(
			z.object({
				title: z.string(),
				date: z.string(),
				description: z.string(),
				technologies: z.array(z.string()),
				link: z.string().optional(),
				image: z.string().optional(),
				github: z.string().optional(),
				demo: z.string().optional(),
				featured: z.boolean().default(false),
				order: z.number().optional(),
			}),
		),
	}),
});

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema: z.object({
		posts: z.array(
			z.object({
				title: z.string(),
				date: z.string(),
				slug: z.string(),
				description: z.string(),
				content: z.string().optional(),
				tags: z.array(z.string()).optional(),
				featured: z.boolean().default(false),
			}),
		),
	}),
});

export const collections = { resume, notes, portfolioProjects, posts };
