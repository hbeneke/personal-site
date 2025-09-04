import { describe, it, expect } from "vitest";
import { collections } from "@/content.config";
import type { SchemaContext } from "astro:content";

describe("Content Collections Configuration", () => {
  it("should define all required collections", () => {
    expect(collections.resume).toBeDefined();
    expect(collections.skills).toBeDefined();
    expect(collections.honors).toBeDefined();
    expect(collections.notes).toBeDefined();
    expect(collections.portfolioProjects).toBeDefined();
    expect(collections.posts).toBeDefined();
    expect(collections.tags).toBeDefined();
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

  describe("Skills Collection", () => {
    it("validates skills schema with valid data", () => {
      if (!collections.skills || !collections.skills.schema) {
        expect.fail("Skills schema is not defined");
      }

      const validSkillsData = {
        name: "Frontend Development",
        perks: ["React", "Vue.js", "TypeScript", "Tailwind CSS"],
      };

      const schema =
        typeof collections.skills.schema === "function"
          ? collections.skills.schema({} as SchemaContext)
          : collections.skills.schema;

      const result = schema.safeParse(validSkillsData);
      expect(result.success).toBe(true);
    });

    it("validates skills schema with empty perks array", () => {
      if (!collections.skills || !collections.skills.schema) {
        expect.fail("Skills schema is not defined");
      }

      const validSkillsDataEmptyPerks = {
        name: "New Skill Area",
        perks: [],
      };

      const schema =
        typeof collections.skills.schema === "function"
          ? collections.skills.schema({} as SchemaContext)
          : collections.skills.schema;

      const result = schema.safeParse(validSkillsDataEmptyPerks);
      expect(result.success).toBe(true);
    });

    it("rejects invalid skills data missing name", () => {
      if (!collections.skills || !collections.skills.schema) {
        expect.fail("Skills schema is not defined");
      }

      const invalidSkillsData = {
        // Missing required 'name' field
        perks: ["React", "Vue.js"],
      };

      const schema =
        typeof collections.skills.schema === "function"
          ? collections.skills.schema({} as SchemaContext)
          : collections.skills.schema;

      const result = schema.safeParse(invalidSkillsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid skills data missing perks", () => {
      if (!collections.skills || !collections.skills.schema) {
        expect.fail("Skills schema is not defined");
      }

      const invalidSkillsData = {
        name: "Frontend Development",
        // Missing required 'perks' field
      };

      const schema =
        typeof collections.skills.schema === "function"
          ? collections.skills.schema({} as SchemaContext)
          : collections.skills.schema;

      const result = schema.safeParse(invalidSkillsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid skills data with non-array perks", () => {
      if (!collections.skills || !collections.skills.schema) {
        expect.fail("Skills schema is not defined");
      }

      const invalidSkillsData = {
        name: "Frontend Development",
        perks: "React, Vue.js", // Should be array, not string
      };

      const schema =
        typeof collections.skills.schema === "function"
          ? collections.skills.schema({} as SchemaContext)
          : collections.skills.schema;

      const result = schema.safeParse(invalidSkillsData);
      expect(result.success).toBe(false);
    });
  });

  describe("Honors Collection", () => {
    it("validates honors schema with valid data", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const validHonorsData = {
        category: "International",
        year: "2015",
        title: "Most Voted by public",
        location: "Berlin, Germany",
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(validHonorsData);
      expect(result.success).toBe(true);
    });

    it("validates honors schema with year range", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const validHonorsDataWithRange = {
        category: "National",
        year: "2014-2017",
        title: "Betabeers Organizator",
        location: "Almeria, Spain",
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(validHonorsDataWithRange);
      expect(result.success).toBe(true);
    });

    it("validates honors schema with different categories", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const categories = ["International", "National", "Regional", "Local"];

      for (const category of categories) {
        const validHonorsData = {
          category,
          year: "2020",
          title: `Test ${category} Honor`,
          location: "Test Location",
        };

        const schema =
          typeof collections.honors.schema === "function"
            ? collections.honors.schema({} as SchemaContext)
            : collections.honors.schema;

        const result = schema.safeParse(validHonorsData);
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid honors data missing category", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const invalidHonorsData = {
        // Missing required 'category' field
        year: "2015",
        title: "Most Voted by public",
        location: "Berlin, Germany",
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(invalidHonorsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid honors data missing year", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const invalidHonorsData = {
        category: "International",
        // Missing required 'year' field
        title: "Most Voted by public",
        location: "Berlin, Germany",
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(invalidHonorsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid honors data missing title", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const invalidHonorsData = {
        category: "International",
        year: "2015",
        // Missing required 'title' field
        location: "Berlin, Germany",
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(invalidHonorsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid honors data missing location", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const invalidHonorsData = {
        category: "International",
        year: "2015",
        title: "Most Voted by public",
        // Missing required 'location' field
      };

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      const result = schema.safeParse(invalidHonorsData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid honors data with wrong data types", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const invalidHonorsDataTypes = [
        {
          category: 123, // Should be string
          year: "2015",
          title: "Most Voted by public",
          location: "Berlin, Germany",
        },
        {
          category: "International",
          year: 2015, // Should be string
          title: "Most Voted by public",
          location: "Berlin, Germany",
        },
        {
          category: "International",
          year: "2015",
          title: true, // Should be string
          location: "Berlin, Germany",
        },
        {
          category: "International",
          year: "2015",
          title: "Most Voted by public",
          location: ["Berlin", "Germany"], // Should be string
        },
      ];

      const schema =
        typeof collections.honors.schema === "function"
          ? collections.honors.schema({} as SchemaContext)
          : collections.honors.schema;

      for (const invalidData of invalidHonorsDataTypes) {
        const result = schema.safeParse(invalidData);
        expect(result.success).toBe(false);
      }
    });

    it("accepts various year formats", () => {
      if (!collections.honors || !collections.honors.schema) {
        expect.fail("Honors schema is not defined");
      }

      const yearFormats = ["2015", "2014-2017", "2020-2022", "2010", "1999-2001"];

      for (const year of yearFormats) {
        const validHonorsData = {
          category: "Test",
          year,
          title: "Test Honor",
          location: "Test Location",
        };

        const schema =
          typeof collections.honors.schema === "function"
            ? collections.honors.schema({} as SchemaContext)
            : collections.honors.schema;

        const result = schema.safeParse(validHonorsData);
        expect(result.success).toBe(true);
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
        title: "Test Project",
        date: "2023-05-15",
        description: "A project for testing",
        technologies: ["React", "TypeScript"],
        image: "/images/project.jpg",
        github: "https://github.com/username/project",
        demo: "https://project-demo.com",
        featured: true,
        order: 1,
      };

      const schema =
        typeof collections.portfolioProjects.schema === "function"
          ? collections.portfolioProjects.schema({} as SchemaContext)
          : collections.portfolioProjects.schema;

      const result = schema.safeParse(validProjectData);
      expect(result.success).toBe(true);
    });

    it("validates portfolioProjects schema with minimal required fields", () => {
      if (!collections.portfolioProjects || !collections.portfolioProjects.schema) {
        expect.fail("Portfolio Projects schema is not defined");
      }

      const minimalProjectData = {
        title: "Minimal Project",
        date: "2023-05-15",
        description: "A minimal project for testing",
        technologies: ["HTML"],
      };

      const schema =
        typeof collections.portfolioProjects.schema === "function"
          ? collections.portfolioProjects.schema({} as SchemaContext)
          : collections.portfolioProjects.schema;

      const result = schema.safeParse(minimalProjectData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
      }
    });

    it("rejects invalid portfolioProjects data", () => {
      if (!collections.portfolioProjects || !collections.portfolioProjects.schema) {
        expect.fail("Portfolio Projects schema is not defined");
      }

      const invalidProjectData = {
        // Missing required 'title' field
        date: "2023-05-15",
        description: "A project for testing",
        technologies: ["React", "TypeScript"],
      };

      const schema =
        typeof collections.portfolioProjects.schema === "function"
          ? collections.portfolioProjects.schema({} as SchemaContext)
          : collections.portfolioProjects.schema;

      const result = schema.safeParse(invalidProjectData);
      expect(result.success).toBe(false);
    });

    it("handles featured field default value", () => {
      if (!collections.portfolioProjects || !collections.portfolioProjects.schema) {
        expect.fail("Portfolio Projects schema is not defined");
      }

      const projectDataWithoutFeatured = {
        title: "Test Project",
        date: "2023-05-15",
        description: "A project for testing",
        technologies: ["React", "TypeScript"],
      };

      const schema =
        typeof collections.portfolioProjects.schema === "function"
          ? collections.portfolioProjects.schema({} as SchemaContext)
          : collections.portfolioProjects.schema;

      const result = schema.safeParse(projectDataWithoutFeatured);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
      }
    });
  });

  describe("Posts Collection", () => {
    it("validates posts schema with valid data", () => {
      if (!collections.posts || !collections.posts.schema) {
        expect.fail("Posts schema is not defined");
      }

      const validPostData = {
        title: "Test Blog Post",
        publishDate: "2023-05-15",
        slug: "test-blog-post",
        description: "This is a test blog post",
        content: "Lorem ipsum dolor sit amet...",
        tags: ["technology", "programming"],
        featured: true,
        draft: false,
        readTime: 5,
        updatedDate: "2023-05-16",
      };

      const schema =
        typeof collections.posts.schema === "function"
          ? collections.posts.schema({} as SchemaContext)
          : collections.posts.schema;

      const result = schema.safeParse(validPostData);
      expect(result.success).toBe(true);
    });

    it("validates posts schema with minimal required fields", () => {
      if (!collections.posts || !collections.posts.schema) {
        expect.fail("Posts schema is not defined");
      }

      const minimalPostData = {
        title: "Minimal Post",
        publishDate: "2023-05-15",
        slug: "minimal-post",
        description: "A minimal post for testing",
      };

      const schema =
        typeof collections.posts.schema === "function"
          ? collections.posts.schema({} as SchemaContext)
          : collections.posts.schema;

      const result = schema.safeParse(minimalPostData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
        expect(result.data.draft).toBe(false);
      }
    });

    it("rejects invalid posts data", () => {
      if (!collections.posts || !collections.posts.schema) {
        expect.fail("Posts schema is not defined");
      }

      const invalidPostData = {
        // Missing required 'title' field
        publishDate: "2023-05-15",
        slug: "test-post",
        description: "A test post",
      };

      const schema =
        typeof collections.posts.schema === "function"
          ? collections.posts.schema({} as SchemaContext)
          : collections.posts.schema;

      const result = schema.safeParse(invalidPostData);
      expect(result.success).toBe(false);
    });

    it("handles default values for featured and draft fields", () => {
      if (!collections.posts || !collections.posts.schema) {
        expect.fail("Posts schema is not defined");
      }

      const postDataWithoutDefaults = {
        title: "Test Post",
        publishDate: "2023-05-15",
        slug: "test-post",
        description: "A test post",
      };

      const schema =
        typeof collections.posts.schema === "function"
          ? collections.posts.schema({} as SchemaContext)
          : collections.posts.schema;

      const result = schema.safeParse(postDataWithoutDefaults);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
        expect(result.data.draft).toBe(false);
      }
    });
  });

  describe("Tags Collection", () => {
    it("validates tags schema with valid data", () => {
      if (!collections.tags || !collections.tags.schema) {
        expect.fail("Tags schema is not defined");
      }

      const validTagData = {
        title: "Technology Posts",
        description: "All posts related to technology and programming",
      };

      const schema =
        typeof collections.tags.schema === "function"
          ? collections.tags.schema({} as SchemaContext)
          : collections.tags.schema;

      const result = schema.safeParse(validTagData);
      expect(result.success).toBe(true);
    });

    it("validates tags schema with minimal data", () => {
      if (!collections.tags || !collections.tags.schema) {
        expect.fail("Tags schema is not defined");
      }

      const minimalTagData = {};

      const schema =
        typeof collections.tags.schema === "function"
          ? collections.tags.schema({} as SchemaContext)
          : collections.tags.schema;

      const result = schema.safeParse(minimalTagData);
      expect(result.success).toBe(true);
    });

    it("validates title length constraint", () => {
      if (!collections.tags || !collections.tags.schema) {
        expect.fail("Tags schema is not defined");
      }

      const tagDataWithLongTitle = {
        title: "This is a very long title that exceeds the sixty character limit",
        description: "A tag with a title that's too long",
      };

      const schema =
        typeof collections.tags.schema === "function"
          ? collections.tags.schema({} as SchemaContext)
          : collections.tags.schema;

      const result = schema.safeParse(tagDataWithLongTitle);
      expect(result.success).toBe(false);
    });

    it("accepts title within length constraint", () => {
      if (!collections.tags || !collections.tags.schema) {
        expect.fail("Tags schema is not defined");
      }

      const tagDataWithValidTitle = {
        title: "Tech", // Well within 60 character limit
        description: "Technology related posts",
      };

      const schema =
        typeof collections.tags.schema === "function"
          ? collections.tags.schema({} as SchemaContext)
          : collections.tags.schema;

      const result = schema.safeParse(tagDataWithValidTitle);
      expect(result.success).toBe(true);
    });
  });
});
