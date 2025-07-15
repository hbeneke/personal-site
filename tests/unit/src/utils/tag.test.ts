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
    it("should handle includeDrafts parameter correctly", async () => {
      mockGetAllTags.mockResolvedValue(["javascript"]);
      mockGetPostsByTag.mockResolvedValue([
        {
          title: "Test Post",
          publishDate: "2024-01-01",
          slug: "test",
          description: "Test",
          featured: false,
          draft: false,
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
          title: "Test Post",
          publishDate: "2024-01-01",
          slug: "test",
          description: "Test",
          featured: false,
          draft: false,
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
});
