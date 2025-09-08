import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllProjects, getFeaturedProjects } from "@/utils/portfolio";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockPortfolioCollectionEntries = [
  {
    id: "project-a",
    collection: "portfolioProjects" as const,
    data: {
      title: "Project A",
      date: "2024-01-15",
      description: "Description A",
      featured: true,
      order: 2,
      technologies: ["React", "TypeScript"],
      github: "https://github.com/user/project-a",
      demo: "https://project-a.com",
    },
  },
  {
    id: "project-b",
    collection: "portfolioProjects" as const,
    data: {
      title: "Project B",
      date: "2024-02-10",
      description: "Description B",
      featured: false,
      order: 1,
      technologies: ["Vue", "JavaScript"],
      github: "https://github.com/user/project-b",
    },
  },
  {
    id: "project-c",
    collection: "portfolioProjects" as const,
    data: {
      title: "Project C",
      date: "2024-03-05",
      description: "Description C",
      featured: true,
      order: 3,
      technologies: ["Astro", "Tailwind"],
      demo: "https://project-c.com",
    },
  },
];

describe("portfolioUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCollection.mockResolvedValue(mockPortfolioCollectionEntries);
  });

  describe("getAllProjects", () => {
    it("should return all projects sorted by order (ascending) by default", async () => {
      const result = await getAllProjects();

      expect(result).toHaveLength(3);
      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2);
      expect(result[2].order).toBe(3);
      expect(result[0].title).toBe("Project B");
      expect(result[1].title).toBe("Project A");
      expect(result[2].title).toBe("Project C");
    });

    it("should return unsorted projects when sorted is false", async () => {
      const result = await getAllProjects(false);

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Project A");
      expect(result[1].title).toBe("Project B");
      expect(result[2].title).toBe("Project C");
    });

    it("should return projects sorted by featured first when sortByFeatured is true", async () => {
      const result = await getAllProjects(false, true);

      expect(result).toHaveLength(3);
      // Featured projects should come first
      expect(result[0].featured).toBe(true);
      expect(result[1].featured).toBe(true);
      expect(result[2].featured).toBe(false);
      expect(result[0].title).toBe("Project A");
      expect(result[1].title).toBe("Project C");
      expect(result[2].title).toBe("Project B");
    });

    it("should return projects sorted by featured first, then by order when both flags are true", async () => {
      // Modifying the mock to have two featured projects with different orders
      const testMockEntries = [
        {
          id: "project-a",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project A",
            date: "2024-01-15",
            description: "Description A",
            featured: true,
            order: 3, // Higher order
            technologies: ["React", "TypeScript"],
            github: "https://github.com/user/project-a",
            demo: "https://project-a.com",
          },
        },
        {
          id: "project-c",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project C",
            date: "2024-03-05",
            description: "Description C",
            featured: true,
            order: 1, // Lower order - should come first
            technologies: ["Astro", "Tailwind"],
            demo: "https://project-c.com",
          },
        },
        {
          id: "project-b",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project B",
            date: "2024-02-10",
            description: "Description B",
            featured: false,
            order: 2,
            technologies: ["Vue", "JavaScript"],
            github: "https://github.com/user/project-b",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(testMockEntries);
      const result = await getAllProjects(true, true);

      expect(result).toHaveLength(3);
      // Featured projects should come first, but also sorted by order
      expect(result[0].featured).toBe(true);
      expect(result[0].title).toBe("Project C"); // featured, order 1 (should be first)
      expect(result[0].order).toBe(1);
      
      expect(result[1].featured).toBe(true);
      expect(result[1].title).toBe("Project A"); // featured, order 3 (should be second)
      expect(result[1].order).toBe(3);
      
      expect(result[2].featured).toBe(false);
      expect(result[2].title).toBe("Project B"); // not featured, order 2
      expect(result[2].order).toBe(2);
    });

    it("should handle projects with mixed featured status and preserve order within groups", async () => {
      const mixedMockEntries = [
        {
          id: "project-d",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project D",
            date: "2024-04-01",
            description: "Description D",
            featured: false,
            order: 1,
            technologies: ["Angular"],
          },
        },
        {
          id: "project-e",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project E",
            date: "2024-05-01",
            description: "Description E",
            featured: true,
            order: 2,
            technologies: ["Svelte"],
          },
        },
        {
          id: "project-f",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project F",
            date: "2024-06-01",
            description: "Description F",
            featured: false,
            order: 3,
            technologies: ["Next.js"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mixedMockEntries);
      const result = await getAllProjects(true, true);

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Project E"); // featured, order 2
      expect(result[1].title).toBe("Project D"); // not featured, order 1
      expect(result[2].title).toBe("Project F"); // not featured, order 3
    });

    it("should sort featured projects by order when multiple featured projects exist", async () => {
      // Create multiple featured projects with different orders to test the order sorting within featured group
      const multipleFeaturedMockEntries = [
        {
          id: "project-g",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project G",
            date: "2024-07-01",
            description: "Description G",
            featured: true,
            order: 5,
            technologies: ["React"],
          },
        },
        {
          id: "project-h",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project H",
            date: "2024-08-01",
            description: "Description H",
            featured: true,
            order: 1,
            technologies: ["Vue"],
          },
        },
        {
          id: "project-i",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project I",
            date: "2024-09-01",
            description: "Description I",
            featured: true,
            order: 3,
            technologies: ["Angular"],
          },
        },
        {
          id: "project-j",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project J",
            date: "2024-10-01",
            description: "Description J",
            featured: false,
            order: 2,
            technologies: ["Svelte"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(multipleFeaturedMockEntries);
      const result = await getAllProjects(true, true);

      expect(result).toHaveLength(4);
      
      // All featured projects should come first, sorted by order
      expect(result[0].featured).toBe(true);
      expect(result[0].title).toBe("Project H"); // featured, order 1
      expect(result[0].order).toBe(1);
      
      expect(result[1].featured).toBe(true);
      expect(result[1].title).toBe("Project I"); // featured, order 3
      expect(result[1].order).toBe(3);
      
      expect(result[2].featured).toBe(true);
      expect(result[2].title).toBe("Project G"); // featured, order 5
      expect(result[2].order).toBe(5);
      
      // Non-featured project should come last
      expect(result[3].featured).toBe(false);
      expect(result[3].title).toBe("Project J"); // not featured, order 2
      expect(result[3].order).toBe(2);
    });
  });

  describe("getFeaturedProjects", () => {
    it("should return only featured projects", async () => {
      const result = await getFeaturedProjects();

      expect(result).toHaveLength(2);
      expect(result.every((project) => project.featured)).toBe(true);
      expect(result[0].title).toBe("Project A");
      expect(result[1].title).toBe("Project C");
    });

    it("should return empty array when no featured projects exist", async () => {
      const mockNoFeaturedProjects = [
        {
          id: "project-x",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project X",
            date: "2024-01-01",
            description: "Description X",
            featured: false,
            order: 1,
            technologies: ["React"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockNoFeaturedProjects);
      const result = await getFeaturedProjects();

      expect(result).toEqual([]);
    });
  });
});

describe("portfolioUtils - Extended Tests", () => {
  describe("getAllProjects - Edge Cases", () => {
    it("should handle projects with undefined order", async () => {
      const mockProjectsWithUndefinedOrder = [
        {
          id: "project-no-order",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project No Order",
            date: "2024-01-01",
            description: "No order defined",
            featured: false,
            technologies: ["HTML"],
          },
        },
        {
          id: "project-with-order",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project With Order",
            date: "2024-01-02",
            description: "Has order",
            featured: true,
            order: 5,
            technologies: ["CSS"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockProjectsWithUndefinedOrder);
      const result = await getAllProjects();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Project No Order");
      expect(result[1].title).toBe("Project With Order");
    });

    it("should handle projects with same order", async () => {
      const mockSameOrderProjects = [
        {
          id: "project-a",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project A",
            date: "2024-01-01",
            description: "First project",
            featured: false,
            order: 1,
            technologies: ["React"],
          },
        },
        {
          id: "project-b",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project B",
            date: "2024-01-02",
            description: "Second project",
            featured: true,
            order: 1,
            technologies: ["Vue"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockSameOrderProjects);
      const result = await getAllProjects();

      expect(result).toHaveLength(2);
      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(1);
    });

    it("should handle collection with empty projects array", async () => {
      mockGetCollection.mockResolvedValue([]);
      const result = await getAllProjects();

      expect(result).toEqual([]);
    });

    it("should handle negative order values", async () => {
      const mockNegativeOrderProjects = [
        {
          id: "negative-order",
          collection: "portfolioProjects" as const,
          data: {
            title: "Negative Order",
            date: "2024-01-01",
            description: "Has negative order",
            featured: false,
            order: -1,
            technologies: ["JavaScript"],
          },
        },
        {
          id: "positive-order",
          collection: "portfolioProjects" as const,
          data: {
            title: "Positive Order",
            date: "2024-01-02",
            description: "Has positive order",
            featured: true,
            order: 1,
            technologies: ["TypeScript"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockNegativeOrderProjects);
      const result = await getAllProjects();

      expect(result).toHaveLength(2);
      expect(result[0].order).toBe(-1);
      expect(result[1].order).toBe(1);
      expect(result[0].title).toBe("Negative Order");
    });

    it("should handle projects where both have undefined order", async () => {
      const mockBothUndefinedOrder = [
        {
          id: "project-a",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project A",
            date: "2024-01-01",
            description: "No order A",
            featured: false,
            technologies: ["React"],
          },
        },
        {
          id: "project-b",
          collection: "portfolioProjects" as const,
          data: {
            title: "Project B",
            date: "2024-01-02",
            description: "No order B",
            featured: true,
            technologies: ["Vue"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockBothUndefinedOrder);
      const result = await getAllProjects();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Project A");
      expect(result[1].title).toBe("Project B");
    });
  });

  describe("getFeaturedProjects - Edge Cases", () => {
    it("should handle projects with mixed featured values", async () => {
      const mockMixedFeaturedProjects = [
        {
          id: "featured-1",
          collection: "portfolioProjects" as const,
          data: {
            title: "Featured Project 1",
            date: "2024-01-01",
            description: "First featured",
            featured: true,
            order: 1,
            technologies: ["React"],
          },
        },
        {
          id: "non-featured",
          collection: "portfolioProjects" as const,
          data: {
            title: "Non-Featured Project",
            date: "2024-01-02",
            description: "Not featured",
            featured: false,
            order: 2,
            technologies: ["Vue"],
          },
        },
        {
          id: "featured-2",
          collection: "portfolioProjects" as const,
          data: {
            title: "Featured Project 2",
            date: "2024-01-03",
            description: "Second featured",
            featured: true,
            order: 3,
            technologies: ["Astro"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockMixedFeaturedProjects);
      const result = await getFeaturedProjects();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Featured Project 1");
      expect(result[1].title).toBe("Featured Project 2");
      expect(result.every((project) => project.featured)).toBe(true);
    });

    it("should handle collection error gracefully", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getFeaturedProjects()).rejects.toThrow("Collection error");
    });

    it("should maintain original order for featured projects", async () => {
      const mockFeaturedProjectsOrder = [
        {
          id: "last-featured",
          collection: "portfolioProjects" as const,
          data: {
            title: "Last Featured",
            date: "2024-01-01",
            description: "Should appear last",
            featured: true,
            order: 3,
            technologies: ["Svelte"],
          },
        },
        {
          id: "first-featured",
          collection: "portfolioProjects" as const,
          data: {
            title: "First Featured",
            date: "2024-01-02",
            description: "Should appear first",
            featured: true,
            order: 1,
            technologies: ["React"],
          },
        },
        {
          id: "not-featured",
          collection: "portfolioProjects" as const,
          data: {
            title: "Not Featured",
            date: "2024-01-03",
            description: "Should not appear",
            featured: false,
            order: 2,
            technologies: ["Vue"],
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockFeaturedProjectsOrder);
      const result = await getFeaturedProjects();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Last Featured");
      expect(result[1].title).toBe("First Featured");
    });
  });

  describe("Error Handling", () => {
    it("should propagate getCollection errors in getAllProjects", async () => {
      mockGetCollection.mockRejectedValue(new Error("Database error"));

      await expect(getAllProjects()).rejects.toThrow("Database error");
    });

    it("should propagate getCollection errors in getFeaturedProjects", async () => {
      mockGetCollection.mockRejectedValue(new Error("Network error"));

      await expect(getFeaturedProjects()).rejects.toThrow("Network error");
    });

    it("should handle empty collection gracefully", async () => {
      mockGetCollection.mockResolvedValue([]);

      const allProjects = await getAllProjects();
      const featuredProjects = await getFeaturedProjects();

      expect(allProjects).toEqual([]);
      expect(featuredProjects).toEqual([]);
    });
  });
});
