import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTagsWithCounts,
  getSortedTagsWithCounts,
  getTagContent,
  groupPostsByYear,
  sortYearsDescending,
  getTagPageData,
  getAllTagPaths,
} from "@/utils/tag";
import type { TagWithCount, Post, TagContent, TagPageData } from "@/types";
import { getAllTags, getPostsByTag } from "@/utils/post";
import { getCollection } from "astro:content";

// Mock modules
vi.mock("@/utils/post", () => ({
  getAllTags: vi.fn(),
  getPostsByTag: vi.fn(),
}));

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetAllTags = vi.mocked(getAllTags);
const mockGetPostsByTag = vi.mocked(getPostsByTag);
const mockGetCollection = vi.mocked(getCollection);

describe("tagUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTagsWithCounts", () => {
    it("should handle includeDrafts parameter correctly", async () => {
      mockGetAllTags.mockResolvedValue(["javascript"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          id: "test",
          collection: "posts" as const,
          data: {
            title: "Test Post",
            publishDate: "2024-01-01",
            slug: "test",
            description: "Test",
            featured: false,
            draft: false,
          },
        },
      ]);

      const resultWithoutDrafts = await getAllTagsWithCounts(false);
      expect(resultWithoutDrafts).toEqual([{ name: "javascript", count: 1 }]);
      expect(mockGetAllTags).toHaveBeenCalledWith(false);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("javascript", false);

      vi.clearAllMocks();
      mockGetAllTags.mockResolvedValue(["javascript"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          id: "test",
          collection: "posts" as const,
          data: {
            title: "Test Post",
            publishDate: "2024-01-01",
            slug: "test",
            description: "Test",
            featured: false,
            draft: false,
          },
        },
      ]);

      await getAllTagsWithCounts(true);
      expect(mockGetAllTags).toHaveBeenCalledWith(true);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("javascript", true);
    });

    it("should return tags with their respective post counts", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "typescript", "web"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            id: "js-1",
            collection: "posts" as const,
            data: {
              title: "JS Post 1",
              publishDate: "2024-01-01",
              slug: "js-1",
              description: "JS desc",
              featured: false,
              draft: false,
            },
          },
          {
            id: "js-2",
            collection: "posts" as const,
            data: {
              title: "JS Post 2",
              publishDate: "2024-01-02",
              slug: "js-2",
              description: "JS desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: "ts-1",
            collection: "posts" as const,
            data: {
              title: "TS Post 1",
              publishDate: "2024-01-03",
              slug: "ts-1",
              description: "TS desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([
        { name: "javascript", count: 2 },
        { name: "typescript", count: 1 },
      ]);
    });

    it("should return empty array when no tags exist", async () => {
      mockGetAllTags.mockResolvedValue([]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([]);
      expect(mockGetPostsByTag).not.toHaveBeenCalled();
    });

    it("should return empty array when all tags have zero posts", async () => {
      mockGetAllTags.mockResolvedValue(["tag1", "tag2"]);
      mockGetPostsByTag.mockResolvedValue([]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([]);
    });

    it("should propagate errors from getAllTags", async () => {
      mockGetAllTags.mockRejectedValue(new Error("Tags fetch error"));

      await expect(getAllTagsWithCounts()).rejects.toThrow("Tags fetch error");
    });

    it("should propagate errors from getPostsByTag", async () => {
      mockGetAllTags.mockResolvedValue(["javascript"]);
      mockGetPostsByTag.mockRejectedValue(new Error("Posts fetch error"));

      await expect(getAllTagsWithCounts()).rejects.toThrow("Posts fetch error");
    });
  });

  describe("getSortedTagsWithCounts", () => {
    it("should return tags sorted by count in descending order", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "typescript", "web", "react"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            id: "js-1",
            collection: "posts" as const,
            data: {
              title: "JS Post 1",
              publishDate: "2024-01-01",
              slug: "js-1",
              description: "JS desc",
              featured: false,
              draft: false,
            },
          },
          {
            id: "js-2",
            collection: "posts" as const,
            data: {
              title: "JS Post 2",
              publishDate: "2024-01-02",
              slug: "js-2",
              description: "JS desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: "ts-1",
            collection: "posts" as const,
            data: {
              title: "TS Post",
              publishDate: "2024-01-03",
              slug: "ts-1",
              description: "TS desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: "web-1",
            collection: "posts" as const,
            data: {
              title: "Web Post 1",
              publishDate: "2024-01-04",
              slug: "web-1",
              description: "Web desc",
              featured: false,
              draft: false,
            },
          },
          {
            id: "web-2",
            collection: "posts" as const,
            data: {
              title: "Web Post 2",
              publishDate: "2024-01-05",
              slug: "web-2",
              description: "Web desc",
              featured: false,
              draft: false,
            },
          },
          {
            id: "web-3",
            collection: "posts" as const,
            data: {
              title: "Web Post 3",
              publishDate: "2024-01-06",
              slug: "web-3",
              description: "Web desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: "react-1",
            collection: "posts" as const,
            data: {
              title: "React Post",
              publishDate: "2024-01-07",
              slug: "react-1",
              description: "React desc",
              featured: false,
              draft: false,
            },
          },
        ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toEqual([
        { name: "web", count: 3 },
        { name: "javascript", count: 2 },
        { name: "typescript", count: 1 },
        { name: "react", count: 1 },
      ]);
    });

    it("should include drafts when includeDrafts is true", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "draft-tag"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            id: "js-1",
            collection: "posts" as const,
            data: {
              title: "JS Post",
              publishDate: "2024-01-01",
              slug: "js-1",
              description: "JS desc",
              featured: false,
              draft: false,
            },
          },
        ])
        .mockResolvedValueOnce([
          {
            id: "draft-1",
            collection: "posts" as const,
            data: {
              title: "Draft Post 1",
              publishDate: "2024-01-02",
              slug: "draft-1",
              description: "Draft desc",
              featured: false,
              draft: true,
            },
          },
          {
            id: "draft-2",
            collection: "posts" as const,
            data: {
              title: "Draft Post 2",
              publishDate: "2024-01-03",
              slug: "draft-2",
              description: "Draft desc",
              featured: false,
              draft: true,
            },
          },
        ]);

      const result = await getSortedTagsWithCounts(true);

      expect(result).toEqual([
        { name: "draft-tag", count: 2 },
        { name: "javascript", count: 1 },
      ]);
    });

    it("should maintain stability for tags with equal counts", async () => {
      mockGetAllTags.mockResolvedValue(["alpha", "beta", "gamma"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          id: "post",
          collection: "posts" as const,
          data: {
            title: "Post",
            publishDate: "2024-01-01",
            slug: "post",
            description: "Desc",
            featured: false,
            draft: false,
          },
        },
      ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toHaveLength(3);
      expect(result.every((tag) => tag.count === 1)).toBe(true);
      expect(result[0].name).toBe("alpha");
      expect(result[1].name).toBe("beta");
      expect(result[2].name).toBe("gamma");
    });

    it("should propagate errors from underlying functions", async () => {
      mockGetAllTags.mockRejectedValue(new Error("Underlying error"));

      await expect(getSortedTagsWithCounts()).rejects.toThrow("Underlying error");
    });
  });

  describe("getTagContent", () => {
    it("should return tag content when tag exists", async () => {
      const mockTagEntry = {
        id: "javascript",
        collection: "tags" as const,
        data: {
          title: "JavaScript Development",
          description: "All about JavaScript",
        },
        body: "<p>JavaScript content</p>",
      };

      mockGetCollection.mockResolvedValue([mockTagEntry]);

      const result = await getTagContent("javascript");

      expect(result).toEqual({
        title: "JavaScript Development",
        description: "All about JavaScript",
        content: "<p>JavaScript content</p>",
      });
    });

    it("should return null when tag does not exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getTagContent("nonexistent");

      expect(result).toBeNull();
    });

    it("should return null when getCollection throws error", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      const result = await getTagContent("javascript");

      expect(result).toBeNull();
    });

    it("should handle partial tag data", async () => {
      const mockTagEntry = {
        id: "typescript",
        collection: "tags" as const,
        data: {
          title: "TypeScript",
        },
        body: "",
      };

      mockGetCollection.mockResolvedValue([mockTagEntry]);

      const result = await getTagContent("typescript");

      expect(result).toEqual({
        title: "TypeScript",
        description: undefined,
        content: "",
      });
    });
  });

  describe("groupPostsByYear", () => {
    it("should group posts by year correctly", async () => {
      const posts = [
        {
          id: "post-2024",
          collection: "posts" as const,
          data: {
            title: "Post 2024",
            publishDate: "2024-06-15T00:00:00.000Z",
            slug: "post-2024",
            description: "2024 post",
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-2023",
          collection: "posts" as const,
          data: {
            title: "Post 2023",
            publishDate: "2023-03-10T00:00:00.000Z",
            slug: "post-2023",
            description: "2023 post",
            featured: false,
            draft: false,
          },
        },
        {
          id: "another-2024",
          collection: "posts" as const,
          data: {
            title: "Another 2024",
            publishDate: "2024-12-31T00:00:00.000Z",
            slug: "another-2024",
            description: "Another 2024 post",
            featured: false,
            draft: false,
          },
        },
      ];

      const result = groupPostsByYear(posts);

      expect(result).toEqual({
        2024: [
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Post 2024",
              publishDate: "2024-06-15T00:00:00.000Z",
              slug: "post-2024",
              description: "2024 post",
            }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Another 2024",
              publishDate: "2024-12-31T00:00:00.000Z",
              slug: "another-2024",
              description: "Another 2024 post",
            }),
          }),
        ],
        2023: [
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Post 2023",
              publishDate: "2023-03-10T00:00:00.000Z",
              slug: "post-2023",
              description: "2023 post",
            }),
          }),
        ],
      });
    });

    it("should handle empty posts array", async () => {
      const result = groupPostsByYear([]);

      expect(result).toEqual({});
    });

    it("should handle invalid dates gracefully", async () => {
      const posts = [
        {
          id: "invalid-post",
          collection: "posts" as const,
          data: {
            title: "Invalid Date Post",
            publishDate: "invalid-date",
            slug: "invalid",
            description: "Invalid date",
            featured: false,
            draft: false,
          },
        },
      ];

      const result = groupPostsByYear(posts);

      expect(result).toEqual({});
    });
  });

  describe("sortYearsDescending", () => {
    it("should sort years in descending order", async () => {
      const groupedPosts = {
        2020: [],
        2024: [],
        2022: [],
      };

      const result = sortYearsDescending(groupedPosts);

      expect(result).toEqual([2024, 2022, 2020]);
    });

    it("should handle empty object", async () => {
      const result = sortYearsDescending({});

      expect(result).toEqual([]);
    });

    it("should handle single year", async () => {
      const groupedPosts = {
        2024: [],
      };

      const result = sortYearsDescending(groupedPosts);

      expect(result).toEqual([2024]);
    });
  });

  describe("getTagPageData", () => {
    beforeEach(() => {
      mockGetPostsByTag.mockResolvedValue([
        {
          id: "test-post",
          collection: "posts" as const,
          data: {
            title: "Test Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "test-post",
            description: "Test description",
            featured: false,
            draft: false,
          },
        },
      ]);
    });

    it("should return complete tag page data with custom tag content", async () => {
      const mockTagEntry = {
        id: "javascript",
        collection: "tags" as const,
        data: {
          title: "JavaScript Development",
          description: "All about JavaScript programming",
        },
        body: "<p>JavaScript content</p>",
      };

      mockGetCollection.mockResolvedValue([mockTagEntry]);

      const result = await getTagPageData("javascript");

      expect(result.tag).toBe("javascript");
      expect(result.posts).toHaveLength(1);
      expect(result.tagContent).toEqual({
        title: "JavaScript Development",
        description: "All about JavaScript programming",
        content: "<p>JavaScript content</p>",
      });
      expect(result.pageTitle).toBe("JavaScript Development");
      expect(result.pageDescription).toBe("All about JavaScript programming");
      expect(result.groupedPostsByYear).toEqual({
        2024: [
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Test Post",
              publishDate: "2024-01-01T00:00:00.000Z",
              slug: "test-post",
              description: "Test description",
              featured: false,
              draft: false,
            }),
          }),
        ],
      });
      expect(result.years).toEqual([2024]);
    });

    it("should return default data when no tag content exists", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getTagPageData("typescript");

      expect(result.tag).toBe("typescript");
      expect(result.tagContent).toBeNull();
      expect(result.pageTitle).toBe("Posts about typescript");
      expect(result.pageDescription).toBe(
        'All blog posts tagged with "typescript". Explore related content and insights.',
      );
    });

    it("should handle empty posts", async () => {
      mockGetPostsByTag.mockResolvedValue([]);
      mockGetCollection.mockResolvedValue([]);

      const result = await getTagPageData("empty-tag");

      expect(result.posts).toEqual([]);
      expect(result.groupedPostsByYear).toEqual({});
      expect(result.years).toEqual([]);
    });
  });

  describe("getAllTagPaths", () => {
    it("should return all available tags", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "typescript", "react"]);

      const result = await getAllTagPaths();

      expect(result).toEqual(["javascript", "typescript", "react"]);
      expect(mockGetAllTags).toHaveBeenCalledWith(false);
    });

    it("should return empty array when no tags exist", async () => {
      mockGetAllTags.mockResolvedValue([]);

      const result = await getAllTagPaths();

      expect(result).toEqual([]);
    });

    it("should propagate errors from getAllTags", async () => {
      mockGetAllTags.mockRejectedValue(new Error("Tags error"));

      await expect(getAllTagPaths()).rejects.toThrow("Tags error");
    });
  });

  describe("Edge cases", () => {
    it("should handle tags with special characters", async () => {
      mockGetAllTags.mockResolvedValue(["c++", "c#", "node.js", "@types"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          id: "special",
          collection: "posts" as const,
          data: {
            title: "Special Post",
            publishDate: "2024-01-01",
            slug: "special",
            description: "Desc",
            featured: false,
            draft: false,
          },
        },
      ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toHaveLength(4);
      expect(result.every((tag) => tag.count === 1)).toBe(true);
      expect(result.map((tag) => tag.name)).toEqual(["c++", "c#", "node.js", "@types"]);
    });

    it("should handle concurrent execution correctly", async () => {
      mockGetAllTags.mockResolvedValue(["tag1", "tag2"]);
      mockGetPostsByTag.mockImplementation(async (tag) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return tag === "tag1"
          ? [
              {
                id: "post-1",
                collection: "posts" as const,
                data: {
                  title: "Post 1",
                  publishDate: "2024-01-01",
                  slug: "post-1",
                  description: "Desc",
                  featured: false,
                  draft: false,
                },
              },
            ]
          : [
              {
                id: "post-2",
                collection: "posts" as const,
                data: {
                  title: "Post 2",
                  publishDate: "2024-01-02",
                  slug: "post-2",
                  description: "Desc",
                  featured: false,
                  draft: false,
                },
              },
              {
                id: "post-3",
                collection: "posts" as const,
                data: {
                  title: "Post 3",
                  publishDate: "2024-01-03",
                  slug: "post-3",
                  description: "Desc",
                  featured: false,
                  draft: false,
                },
              },
            ];
      });

      const [result1, result2] = await Promise.all([
        getSortedTagsWithCounts(),
        getSortedTagsWithCounts(),
      ]);

      expect(result1).toEqual(result2);
      expect(result1).toEqual([
        { name: "tag2", count: 2 },
        { name: "tag1", count: 1 },
      ]);
    });
  });
});
