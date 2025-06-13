import { describe, it, expect } from "vitest";
import { collections } from "@/content.config";
import type { SchemaContext } from "astro:content";

describe("Content Collections Configuration", () => {
	it("should define all required collections", () => {
		expect(collections.resume).toBeDefined();
		expect(collections.notes).toBeDefined();
		expect(collections.portfolioProjects).toBeDefined();
	});

	describe("Resume Collection", () => {
		it("validates resume schema with valid data", () => {
			if (!collections.resume || !collections.resume.schema) {
				expect.fail("Resume schema is not defined");
			}

			const validResumeData = {
				company: "Test Company",
				position: "Developer",
				start_date: "2022-01",
				end_date: "2023-01",
				description: "Worked on various projects",
				responsibilities: ["Coding", "Testing"],
				startup: false,
			};

			const schema =
				typeof collections.resume.schema === "function"
					? collections.resume.schema({} as SchemaContext)
					: collections.resume.schema;

			const result = schema.safeParse(validResumeData);
			expect(result.success).toBe(true);
		});

		it("validates resume schema with all optional fields", () => {
			if (!collections.resume || !collections.resume.schema) {
				expect.fail("Resume schema is not defined");
			}

			const validResumeDataWithOptionals = {
				company: "Test Company",
				website: "https://test.com",
				company_url: "https://company.com",
				startup: true,
				location: "Madrid, Spain",
				position: "Senior Developer",
				start_date: "2022-01",
				end_date: "Present",
				description: "Worked on various projects",
				responsibilities: ["Coding", "Testing", "Leading"],
			};

			const schema =
				typeof collections.resume.schema === "function"
					? collections.resume.schema({} as SchemaContext)
					: collections.resume.schema;

			const result = schema.safeParse(validResumeDataWithOptionals);
			expect(result.success).toBe(true);
		});

		it("rejects invalid resume data", () => {
			if (!collections.resume || !collections.resume.schema) {
				expect.fail("Resume schema is not defined");
			}

			const invalidResumeData = {
				// Missing required 'company' field
				position: "Developer",
				start_date: "2022-01",
				end_date: "2023-01",
				description: "Worked on various projects",
				responsibilities: ["Coding", "Testing"],
			};

			const schema =
				typeof collections.resume.schema === "function"
					? collections.resume.schema({} as SchemaContext)
					: collections.resume.schema;

			const result = schema.safeParse(invalidResumeData);
			expect(result.success).toBe(false);
		});

		it("handles startup field default value", () => {
			if (!collections.resume || !collections.resume.schema) {
				expect.fail("Resume schema is not defined");
			}

			const resumeDataWithoutStartup = {
				company: "Test Company",
				position: "Developer",
				start_date: "2022-01",
				end_date: "2023-01",
				description: "Worked on various projects",
				responsibilities: ["Coding", "Testing"],
			};

			const schema =
				typeof collections.resume.schema === "function"
					? collections.resume.schema({} as SchemaContext)
					: collections.resume.schema;

			const result = schema.safeParse(resumeDataWithoutStartup);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.startup).toBe(false);
			}
		});
	});

	describe("Notes Collection", () => {
		it("validates notes schema with valid data", () => {
			if (!collections.notes || !collections.notes.schema) {
				expect.fail("Notes schema is not defined");
			}

			const validNotesData = {
				title: "Test Note",
				publishDate: "2023-05-15",
				slug: "test-note",
				description: "This is a test note",
				starred: false,
			};

			const schema =
				typeof collections.notes.schema === "function"
					? collections.notes.schema({} as SchemaContext)
					: collections.notes.schema;

			const result = schema.safeParse(validNotesData);
			expect(result.success).toBe(true);
		});

		it("rejects invalid notes data", () => {
			if (!collections.notes || !collections.notes.schema) {
				expect.fail("Notes schema is not defined");
			}

			const invalidNotesData = {
				// Missing required 'title' field
				publishDate: "2023-05-15",
				slug: "test-note",
				description: "This is a test note",
			};

			const schema =
				typeof collections.notes.schema === "function"
					? collections.notes.schema({} as SchemaContext)
					: collections.notes.schema;

			const result = schema.safeParse(invalidNotesData);
			expect(result.success).toBe(false);
		});
	});

	describe("Portfolio Projects Collection", () => {
		it("validates portfolioProjects schema with valid data", () => {
			if (!collections.portfolioProjects || !collections.portfolioProjects.schema) {
				expect.fail("Portfolio Projects schema is not defined");
			}

			const validProjectData = {
				projects: [
					{
						title: "Test Project",
						date: "2023-05-15",
						description: "A project for testing",
						technologies: ["React", "TypeScript"],
						image: "/images/project.jpg",
						github: "https://github.com/username/project",
						demo: "https://project-demo.com",
						featured: true,
					},
				],
			};

			const schema =
				typeof collections.portfolioProjects.schema === "function"
					? collections.portfolioProjects.schema({} as SchemaContext)
					: collections.portfolioProjects.schema;

			const result = schema.safeParse(validProjectData);
			expect(result.success).toBe(true);
		});

		it("rejects invalid portfolioProjects data", () => {
			if (!collections.portfolioProjects || !collections.portfolioProjects.schema) {
				expect.fail("Portfolio Projects schema is not defined");
			}

			const invalidProjectData = {
				projects: [
					{
						// Missing required 'title' field
						date: "2023-05-15",
						description: "A project for testing",
						technologies: ["React", "TypeScript"],
					},
				],
			};

			const schema =
				typeof collections.portfolioProjects.schema === "function"
					? collections.portfolioProjects.schema({} as SchemaContext)
					: collections.portfolioProjects.schema;

			const result = schema.safeParse(invalidProjectData);
			expect(result.success).toBe(false);
		});
	});
});
