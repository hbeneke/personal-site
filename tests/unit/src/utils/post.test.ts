import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllPosts,
  getLatestPost,
  getLatestPosts,
  getFeaturedPosts,
  getPostsByTag,
  getAllTags,
  getPostsGroupedByYear,
} from "@/utils/post";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockPostsCollectionEntries = [
  {
    id: "post-1",
    collection: "posts" as const,
    data: {
      title: "First Post",
      publishDate: "2024-01-15T00:00:00.000Z",
      slug: "first-post",
      description: "Description of first post",
      content: "Content of first post",
      tags: ["javascript", "tutorial"],
      featured: true,
      draft: false,
      updatedDate: "2025-07-23T00:00:00.000Z",
    },
  },
  {
    id: "post-2",
    collection: "posts" as const,
    data: {
      title: "Second Post",
      publishDate: "2024-02-10T00:00:00.000Z",
      slug: "second-post",
      description: "Description of second post",
      content: "Content of second post",
      tags: ["typescript", "advanced"],
      featured: false,
      draft: false,
    },
  },
  {
    id: "post-3",
    collection: "posts" as const,
    data: {
      title: "Draft Post",
      publishDate: "2024-03-05T00:00:00.000Z",
      slug: "draft-post",
      description: "Description of draft post",
      content: "Content of draft post",
      tags: ["draft", "wip"],
      featured: false,
      draft: true,
      updatedDate: "2025-07-23T00:00:00.000Z",
    },
  },
  {
    id: "post-4",
    collection: "posts" as const,
    data: {
      title: "Featured Draft",
      publishDate: "2024-03-20T00:00:00.000Z",
      slug: "featured-draft",
      description: "Description of featured draft",
      content: "Content of featured draft",
      tags: ["featured", "draft"],
      featured: true,
      draft: true,
    },
  },
  {
    id: "post-5",
    collection: "posts" as const,
    data: {
      title: "Latest Post",
      publishDate: "2024-04-01T00:00:00.000Z",
      slug: "latest-post",
      description: "Description of latest post",
      tags: ["javascript", "typescript", "latest"],
      featured: false,
      draft: false,
    },
  },
];

describe("postsUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCollection.mockResolvedValue(mockPostsCollectionEntries);
  });

  describe("getAllPosts", () => {
    it("should return sorted non-draft posts by default", async () => {
      const result = await getAllPosts();

      expect(result).toHaveLength(3);
      expect(result[0].data.slug).toBe("latest-post");
      expect(result[1].data.slug).toBe("second-post");
      expect(result[2].data.slug).toBe("first-post");
      expect(result.every((post) => !post.data.draft)).toBe(true);
    });

    it("should return unsorted posts when sorted is false", async () => {
      const result = await getAllPosts(false);

      expect(result).toHaveLength(3);
      expect(result[0].data.slug).toBe("first-post");
      expect(result[1].data.slug).toBe("second-post");
      expect(result[2].data.slug).toBe("latest-post");
    });

    it("should include drafts when includeDrafts is true", async () => {
      const result = await getAllPosts(true, true);

      expect(result).toHaveLength(5);
      expect(result.some((post) => post.data.draft)).toBe(true);
    });

    it("should return empty array when no posts exist", async () => {
      mockGetCollection.mockResolvedValue([]);
      const result = await getAllPosts();
      expect(result).toEqual([]);
    });
  });

  describe("getLatestPost", () => {
    it("should return the most recent non-draft post", async () => {
      const result = await getLatestPost();

      expect(result?.data.slug).toBe("latest-post");
      expect(result?.data.publishDate).toBe("2024-04-01T00:00:00.000Z");
      expect(result?.data.draft).toBe(false);
    });

    it("should return null when no non-draft posts exist", async () => {
      mockGetCollection.mockResolvedValue([mockPostsCollectionEntries[2]]);
      const result = await getLatestPost();
      expect(result).toBeNull();
    });
  });

  describe("getLatestPosts", () => {
    it("should return specified count of latest posts", async () => {
      const result = await getLatestPosts(2);

      expect(result).toHaveLength(2);
      expect(result[0].data.slug).toBe("latest-post");
      expect(result[1].data.slug).toBe("second-post");
    });

    it("should include drafts when includeDrafts is true", async () => {
      const result = await getLatestPosts(3, true);

      expect(result).toHaveLength(3);
      expect(result.some((post) => post.data.draft)).toBe(true);
    });

    it("should handle count exceeding available posts", async () => {
      const result = await getLatestPosts(10);
      expect(result).toHaveLength(3);
    });

    it("should handle count of 0", async () => {
      const result = await getLatestPosts(0);
      expect(result).toHaveLength(0);
    });

    it("should use default count of 1", async () => {
      const result = await getLatestPosts();
      expect(result).toHaveLength(1);
    });

    it("should return empty array when no posts available after filtering", async () => {
      mockGetCollection.mockResolvedValue([mockPostsCollectionEntries[2]]);
      const result = await getLatestPosts(5, false);
      expect(result).toEqual([]);
    });
  });

  describe("getFeaturedPosts", () => {
    it("should return only featured non-draft posts", async () => {
      const result = await getFeaturedPosts();

      expect(result).toHaveLength(1);
      expect(result[0].data.slug).toBe("first-post");
      expect(result[0].data.featured).toBe(true);
      expect(result[0].data.draft).toBe(false);
    });

    it("should include featured drafts when includeDrafts is true", async () => {
      const result = await getFeaturedPosts(true);

      expect(result).toHaveLength(2);
      expect(result.every((post) => post.data.featured)).toBe(true);
    });

    it("should return empty array when no featured posts exist", async () => {
      mockGetCollection.mockResolvedValue([mockPostsCollectionEntries[1]]);
      const result = await getFeaturedPosts();
      expect(result).toEqual([]);
    });
  });

  describe("getPostsByTag", () => {
    it("should return posts with specified tag", async () => {
      const result = await getPostsByTag("javascript");

      expect(result).toHaveLength(2);
      expect(result.every((post) => post.data.tags?.includes("javascript"))).toBe(true);
      expect(result.every((post) => !post.data.draft)).toBe(true);
    });

    it("should include drafts when includeDrafts is true", async () => {
      const result = await getPostsByTag("draft", true);

      expect(result).toHaveLength(2);
      expect(result.every((post) => post.data.tags?.includes("draft"))).toBe(true);
    });

    it("should return empty array for nonexistent tag", async () => {
      const result = await getPostsByTag("nonexistent-tag");
      expect(result).toEqual([]);
    });

    it("should handle posts without tags", async () => {
      const mockPostWithoutTags = [
        {
          id: "no-tags",
          collection: "posts" as const,
          data: {
            title: "No Tags Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "no-tags",
            description: "Post without tags",
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockPostWithoutTags);
      const result = await getPostsByTag("any-tag");
      expect(result).toEqual([]);
    });
  });

  describe("getAllTags", () => {
    it("should return unique tags sorted alphabetically", async () => {
      const result = await getAllTags();
      expect(result).toEqual(["advanced", "javascript", "latest", "tutorial", "typescript"]);
    });

    it("should include tags from drafts when includeDrafts is true", async () => {
      const result = await getAllTags(true);
      expect(result).toEqual([
        "advanced",
        "draft",
        "featured",
        "javascript",
        "latest",
        "tutorial",
        "typescript",
        "wip",
      ]);
    });

    it("should return empty array when no posts have tags", async () => {
      mockGetCollection.mockResolvedValue([
        {
          id: "no-tags",
          collection: "posts" as const,
          data: {
            title: "No Tags Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "no-tags",
            description: "Post without tags",
            featured: false,
            draft: false,
          },
        },
      ]);

      const result = await getAllTags();
      expect(result).toEqual([]);
    });
  });

  describe("getPostsGroupedByYear", () => {
    beforeEach(() => {
      const mockGroupedPostsEntries = [
        {
          id: "post-2024-feb",
          collection: "posts" as const,
          data: {
            title: "Post February 2024",
            publishDate: "2024-02-10T00:00:00.000Z",
            slug: "post-2024-feb",
            description: "February 2024 post",
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-2024-jan",
          collection: "posts" as const,
          data: {
            title: "Post January 2024",
            publishDate: "2024-01-15T00:00:00.000Z",
            slug: "post-2024-jan",
            description: "January 2024 post",
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-2023-dec",
          collection: "posts" as const,
          data: {
            title: "Post December 2023",
            publishDate: "2023-12-31T00:00:00.000Z",
            slug: "post-2023-dec",
            description: "December 2023 post",
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-2024-draft",
          collection: "posts" as const,
          data: {
            title: "Draft Post 2024",
            publishDate: "2024-03-01T00:00:00.000Z",
            slug: "post-2024-draft",
            description: "Draft post",
            featured: false,
            draft: true,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockGroupedPostsEntries);
    });

    it("should group posts by year excluding drafts by default", async () => {
      const result = await getPostsGroupedByYear();

      expect(result).toEqual({
        2024: [
          expect.objectContaining({ data: expect.objectContaining({ slug: "post-2024-feb" }) }),
          expect.objectContaining({ data: expect.objectContaining({ slug: "post-2024-jan" }) }),
        ],
        2023: [
          expect.objectContaining({ data: expect.objectContaining({ slug: "post-2023-dec" }) }),
        ],
      });
    });

    it("should include drafts when includeDrafts is true", async () => {
      const result = await getPostsGroupedByYear(true);

      expect(result[2024]).toHaveLength(3);
      expect(result[2024].some((post) => post.data.draft)).toBe(true);
    });

    it("should sort posts within each year by date (newest first)", async () => {
      const result = await getPostsGroupedByYear();

      expect(result[2024][0].data.publishDate).toBe("2024-02-10T00:00:00.000Z");
      expect(result[2024][1].data.publishDate).toBe("2024-01-15T00:00:00.000Z");
    });

    it("should return empty object when no posts exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getPostsGroupedByYear();

      expect(result).toEqual({});
    });

    it("should handle posts with same date", async () => {
      const sameDatePosts = [
        {
          id: "post-a",
          collection: "posts" as const,
          data: {
            title: "Post A",
            publishDate: "2024-01-15T00:00:00.000Z",
            slug: "post-a",
            description: "Post A",
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-b",
          collection: "posts" as const,
          data: {
            title: "Post B",
            publishDate: "2024-01-15T00:00:00.000Z",
            slug: "post-b",
            description: "Post B",
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(sameDatePosts);

      const result = await getPostsGroupedByYear();

      expect(result[2024]).toHaveLength(2);
    });

    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getPostsGroupedByYear()).rejects.toThrow("Collection error");
    });
  });

  describe("Error handling", () => {
    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getAllPosts()).rejects.toThrow("Collection error");
      await expect(getLatestPosts(3)).rejects.toThrow("Collection error");
      await expect(getFeaturedPosts()).rejects.toThrow("Collection error");
      await expect(getPostsByTag("tag")).rejects.toThrow("Collection error");
      await expect(getAllTags()).rejects.toThrow("Collection error");
    });
  });
});
