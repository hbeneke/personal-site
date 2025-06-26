import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllTagsWithCounts, getSortedTagsWithCounts } from "@/utils/tag";
import type { TagWithCount } from "@types";
import { getAllTags, getPostsByTag } from "@/utils/post";

vi.mock("@/utils/post", () => ({
  getAllTags: vi.fn(),
  getPostsByTag: vi.fn(),
}));

const mockGetAllTags = vi.mocked(getAllTags);
const mockGetPostsByTag = vi.mocked(getPostsByTag);

describe("tagUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTagsWithCounts", () => {
    it("should return tags with their respective post counts", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "typescript", "web"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            title: "JS Post 1",
            publishDate: "2024-01-01",
            slug: "js-1",
            description: "JS desc",
            featured: false,
            draft: false,
          },
          {
            title: "JS Post 2",
            publishDate: "2024-01-02",
            slug: "js-2",
            description: "JS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "TS Post 1",
            publishDate: "2024-01-03",
            slug: "ts-1",
            description: "TS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([
        { name: "javascript", count: 2 },
        { name: "typescript", count: 1 },
      ]);
      expect(mockGetAllTags).toHaveBeenCalledWith(false);
      expect(mockGetPostsByTag).toHaveBeenCalledTimes(3);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("javascript", false);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("typescript", false);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("web", false);
    });

    it("should filter out tags with zero posts", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "empty-tag", "typescript"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            title: "JS Post",
            publishDate: "2024-01-01",
            slug: "js-1",
            description: "JS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            title: "TS Post",
            publishDate: "2024-01-02",
            slug: "ts-1",
            description: "TS desc",
            featured: false,
            draft: false,
          },
        ]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([
        { name: "javascript", count: 1 },
        { name: "typescript", count: 1 },
      ]);
    });

    it("should include drafts when includeDrafts is true", async () => {
      mockGetAllTags.mockResolvedValue(["javascript"]);
      mockGetPostsByTag.mockResolvedValueOnce([
        {
          title: "JS Post",
          publishDate: "2024-01-01",
          slug: "js-1",
          description: "JS desc",
          featured: false,
          draft: false,
        },
        {
          title: "JS Draft",
          publishDate: "2024-01-02",
          slug: "js-draft",
          description: "JS draft desc",
          featured: false,
          draft: true,
        },
      ]);

      const result = await getAllTagsWithCounts(true);

      expect(result).toEqual([{ name: "javascript", count: 2 }]);
      expect(mockGetAllTags).toHaveBeenCalledWith(true);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("javascript", true);
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

    it("should handle single tag correctly", async () => {
      mockGetAllTags.mockResolvedValue(["solo-tag"]);
      mockGetPostsByTag.mockResolvedValueOnce([
        {
          title: "Solo Post",
          publishDate: "2024-01-01",
          slug: "solo",
          description: "Solo desc",
          featured: false,
          draft: false,
        },
      ]);

      const result = await getAllTagsWithCounts();

      expect(result).toEqual([{ name: "solo-tag", count: 1 }]);
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
            title: "JS Post 1",
            publishDate: "2024-01-01",
            slug: "js-1",
            description: "JS desc",
            featured: false,
            draft: false,
          },
          {
            title: "JS Post 2",
            publishDate: "2024-01-02",
            slug: "js-2",
            description: "JS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "TS Post",
            publishDate: "2024-01-03",
            slug: "ts-1",
            description: "TS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "Web Post 1",
            publishDate: "2024-01-04",
            slug: "web-1",
            description: "Web desc",
            featured: false,
            draft: false,
          },
          {
            title: "Web Post 2",
            publishDate: "2024-01-05",
            slug: "web-2",
            description: "Web desc",
            featured: false,
            draft: false,
          },
          {
            title: "Web Post 3",
            publishDate: "2024-01-06",
            slug: "web-3",
            description: "Web desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "React Post",
            publishDate: "2024-01-07",
            slug: "react-1",
            description: "React desc",
            featured: false,
            draft: false,
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

    it("should handle tags with same count correctly", async () => {
      mockGetAllTags.mockResolvedValue(["tag1", "tag2", "tag3"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            title: "Post 1",
            publishDate: "2024-01-01",
            slug: "post-1",
            description: "Desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "Post 2",
            publishDate: "2024-01-02",
            slug: "post-2",
            description: "Desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "Post 3",
            publishDate: "2024-01-03",
            slug: "post-3",
            description: "Desc",
            featured: false,
            draft: false,
          },
          {
            title: "Post 4",
            publishDate: "2024-01-04",
            slug: "post-4",
            description: "Desc",
            featured: false,
            draft: false,
          },
        ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toEqual([
        { name: "tag3", count: 2 },
        { name: "tag1", count: 1 },
        { name: "tag2", count: 1 },
      ]);
    });

    it("should return empty array when no tags have posts", async () => {
      mockGetAllTags.mockResolvedValue(["tag1", "tag2"]);
      mockGetPostsByTag.mockResolvedValue([]);

      const result = await getSortedTagsWithCounts();

      expect(result).toEqual([]);
    });

    it("should include drafts when includeDrafts is true", async () => {
      mockGetAllTags.mockResolvedValue(["javascript", "draft-tag"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            title: "JS Post",
            publishDate: "2024-01-01",
            slug: "js-1",
            description: "JS desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            title: "Draft Post 1",
            publishDate: "2024-01-02",
            slug: "draft-1",
            description: "Draft desc",
            featured: false,
            draft: true,
          },
          {
            title: "Draft Post 2",
            publishDate: "2024-01-03",
            slug: "draft-2",
            description: "Draft desc",
            featured: false,
            draft: true,
          },
        ]);

      const result = await getSortedTagsWithCounts(true);

      expect(result).toEqual([
        { name: "draft-tag", count: 2 },
        { name: "javascript", count: 1 },
      ]);
      expect(mockGetAllTags).toHaveBeenCalledWith(true);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("javascript", true);
      expect(mockGetPostsByTag).toHaveBeenCalledWith("draft-tag", true);
    });

    it("should maintain stability for tags with equal counts", async () => {
      mockGetAllTags.mockResolvedValue(["alpha", "beta", "gamma"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "Post",
          publishDate: "2024-01-01",
          slug: "post",
          description: "Desc",
          featured: false,
          draft: false,
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

  describe("Edge cases", () => {
    it("should handle very large number of tags efficiently", async () => {
      const largeTags = Array.from({ length: 100 }, (_, i) => `tag-${i}`);
      mockGetAllTags.mockResolvedValue(largeTags);
      mockGetPostsByTag.mockImplementation(async (tag) => {
        const count = Number.parseInt(tag.split("-")[1]) % 5;
        return Array.from({ length: count }, (_, i) => ({
          title: `Post ${i}`,
          publishDate: "2024-01-01",
          slug: `post-${i}`,
          description: "Desc",
          featured: false,
          draft: false,
        }));
      });

      const startTime = Date.now();
      const result = await getSortedTagsWithCounts();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count).toBeGreaterThanOrEqual(result[result.length - 1].count);
    });

    it("should handle tags with special characters", async () => {
      mockGetAllTags.mockResolvedValue(["c++", "c#", "node.js", "@types"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "Special Post",
          publishDate: "2024-01-01",
          slug: "special",
          description: "Desc",
          featured: false,
          draft: false,
        },
      ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toHaveLength(4);
      expect(result.every((tag) => tag.count === 1)).toBe(true);
      expect(result.map((tag) => tag.name)).toEqual(["c++", "c#", "node.js", "@types"]);
    });

    it("should handle empty tag names", async () => {
      mockGetAllTags.mockResolvedValue([""]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "Empty Tag Post",
          publishDate: "2024-01-01",
          slug: "empty",
          description: "Desc",
          featured: false,
          draft: false,
        },
      ]);

      const result = await getSortedTagsWithCounts();

      expect(result).toEqual([{ name: "", count: 1 }]);
    });

    it("should handle concurrent execution correctly", async () => {
      mockGetAllTags.mockResolvedValue(["tag1", "tag2"]);
      mockGetPostsByTag.mockImplementation(async (tag) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return tag === "tag1"
          ? [
              {
                title: "Post 1",
                publishDate: "2024-01-01",
                slug: "post-1",
                description: "Desc",
                featured: false,
                draft: false,
              },
            ]
          : [
              {
                title: "Post 2",
                publishDate: "2024-01-02",
                slug: "post-2",
                description: "Desc",
                featured: false,
                draft: false,
              },
              {
                title: "Post 3",
                publishDate: "2024-01-03",
                slug: "post-3",
                description: "Desc",
                featured: false,
                draft: false,
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

  describe("Type safety", () => {
    it("should return correct TagWithCount interface", async () => {
      mockGetAllTags.mockResolvedValue(["typescript"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "TS Post",
          publishDate: "2024-01-01",
          slug: "ts-1",
          description: "TS desc",
          featured: false,
          draft: false,
        },
      ]);

      const result: TagWithCount[] = await getAllTagsWithCounts();

      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("count");
      expect(typeof result[0].name).toBe("string");
      expect(typeof result[0].count).toBe("number");
    });

    it("should maintain type safety for sorted results", async () => {
      mockGetAllTags.mockResolvedValue(["tag1"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "Post",
          publishDate: "2024-01-01",
          slug: "post",
          description: "Desc",
          featured: false,
          draft: false,
        },
      ]);

      const result: TagWithCount[] = await getSortedTagsWithCounts();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: "tag1", count: 1 });
    });
  });

  describe("Performance tests", () => {
    it("should handle large datasets with many concurrent operations", async () => {
      const manyTags = Array.from({ length: 50 }, (_, i) => `performance-tag-${i}`);
      mockGetAllTags.mockResolvedValue(manyTags);
      mockGetPostsByTag.mockImplementation(async (tag) => {
        const tagIndex = Number.parseInt(tag.split("-")[2]);
        const postCount = (tagIndex % 3) + 1;
        return Array.from({ length: postCount }, (_, i) => ({
          title: `Performance Post ${i}`,
          publishDate: "2024-01-01",
          slug: `perf-post-${i}`,
          description: "Performance test desc",
          featured: false,
          draft: false,
        }));
      });

      const result = await getSortedTagsWithCounts();

      expect(result).toHaveLength(50);
      expect(result.every((tag) => tag.count > 0)).toBe(true);
      expect(result[0].count).toBeGreaterThanOrEqual(result[result.length - 1].count);
    });

    it("should handle tags with zero posts efficiently", async () => {
      mockGetAllTags.mockResolvedValue(["tag-with-posts", "empty-tag-1", "empty-tag-2"]);
      mockGetPostsByTag
        .mockResolvedValueOnce([
          {
            title: "Valid Post",
            publishDate: "2024-01-01",
            slug: "valid",
            description: "Desc",
            featured: false,
            draft: false,
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await getAllTagsWithCounts();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: "tag-with-posts", count: 1 });
    });
  });
});