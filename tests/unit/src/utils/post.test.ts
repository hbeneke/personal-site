import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllPosts,
  getLatestPost,
  getLatestPosts,
  getFeaturedPosts,
  getPostsByTag,
  getAllTags,
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
    it("should return all non-draft posts sorted by date (newest first) by default", async () => {
      const result = await getAllPosts();

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("latest-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("first-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should return unsorted non-draft posts when sorted is false", async () => {
      const result = await getAllPosts(false);

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("first-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("latest-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should include draft posts when includeDrafts is true", async () => {
      const result = await getAllPosts(true, true);

      expect(result).toHaveLength(5);
      expect(result[0].publishDate).toBe("2024-04-01T00:00:00.000Z");
      expect(result[4].publishDate).toBe("2024-01-15T00:00:00.000Z");
    });

    it("should return unsorted posts including drafts when both flags are set", async () => {
      const result = await getAllPosts(false, true);

      expect(result).toHaveLength(5);
      expect(result[0].slug).toBe("first-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("draft-post");
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

      expect(result).toBeDefined();
      expect(result?.slug).toBe("latest-post");
      expect(result?.publishDate).toBe("2024-04-01T00:00:00.000Z");
      expect(result?.draft).toBe(false);
    });

    it("should return null when no non-draft posts exist", async () => {
      const mockOnlyDrafts = [
        {
          id: "draft-only",
          collection: "posts" as const,
          data: {
            title: "Only Draft",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "only-draft",
            description: "Only draft available",
            featured: false,
            draft: true,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockOnlyDrafts);

      const result = await getLatestPost();

      expect(result).toBeNull();
    });

    it("should return null when no posts exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getLatestPost();

      expect(result).toBeNull();
    });
  });

  describe("getLatestPosts", () => {
    it("should return the most recent non-draft post when count is 1", async () => {
      const result = await getLatestPosts(1);

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("latest-post");
      expect(result[0].draft).toBe(false);
    });

    it("should return multiple non-draft posts when count is greater than 1", async () => {
      const result = await getLatestPosts(2);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("latest-post");
      expect(result[1].slug).toBe("second-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should return all non-draft posts when count exceeds available posts", async () => {
      const result = await getLatestPosts(10);

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("latest-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("first-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should include drafts when includeDrafts is true", async () => {
      const result = await getLatestPosts(3, true);

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("latest-post");
      expect(result[1].slug).toBe("featured-draft");
      expect(result[2].slug).toBe("draft-post");
    });

    it("should return empty array when no posts exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getLatestPosts(5);

      expect(result).toEqual([]);
    });

    it("should use default count of 1 when no parameter provided", async () => {
      const result = await getLatestPosts();

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("latest-post");
    });

    it("should handle count of 0", async () => {
      const result = await getLatestPosts(0);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getLatestPosts(3)).rejects.toThrow("Collection error");
    });
  });

  describe("getFeaturedPosts", () => {
    it("should return only featured non-draft posts", async () => {
      const result = await getFeaturedPosts();

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("first-post");
      expect(result[0].featured).toBe(true);
      expect(result[0].draft).toBe(false);
    });

    it("should include featured draft posts when includeDrafts is true", async () => {
      const result = await getFeaturedPosts(true);

      expect(result).toHaveLength(2);
      expect(result.every((post) => post.featured)).toBe(true);
      expect(result.some((post) => post.draft)).toBe(true);
    });

    it("should return empty array when no featured posts exist", async () => {
      const mockNoFeaturedPosts = [
        {
          id: "regular-post",
          collection: "posts" as const,
          data: {
            title: "Regular Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "regular-post",
            description: "Regular post",
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockNoFeaturedPosts);
      const result = await getFeaturedPosts();

      expect(result).toEqual([]);
    });

    it("should maintain original order for featured posts", async () => {
      const result = await getFeaturedPosts(true);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("first-post");
      expect(result[1].slug).toBe("featured-draft");
    });
  });

  describe("getPostsByTag", () => {
    it("should return posts with specified tag (non-draft)", async () => {
      const result = await getPostsByTag("javascript");

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("first-post");
      expect(result[1].slug).toBe("latest-post");
      expect(result.every((post) => post.tags?.includes("javascript"))).toBe(true);
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should include draft posts when includeDrafts is true", async () => {
      const result = await getPostsByTag("draft", true);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("draft-post");
      expect(result[1].slug).toBe("featured-draft");
      expect(result.every((post) => post.tags?.includes("draft"))).toBe(true);
    });

    it("should return empty array when no posts have the specified tag", async () => {
      const result = await getPostsByTag("nonexistent-tag");

      expect(result).toEqual([]);
    });

    it("should handle posts without tags", async () => {
      const mockPostsWithoutTags = [
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

      mockGetCollection.mockResolvedValue(mockPostsWithoutTags);
      const result = await getPostsByTag("any-tag");

      expect(result).toEqual([]);
    });

    it("should be case sensitive for tag matching", async () => {
      const result = await getPostsByTag("JavaScript");

      expect(result).toEqual([]);
    });
  });

  describe("getAllTags", () => {
    it("should return all unique tags from non-draft posts sorted alphabetically", async () => {
      const result = await getAllTags();

      expect(result).toEqual(["advanced", "javascript", "latest", "tutorial", "typescript"]);
    });

    it("should include tags from draft posts when includeDrafts is true", async () => {
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
      const mockPostsWithoutTags = [
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

      mockGetCollection.mockResolvedValue(mockPostsWithoutTags);
      const result = await getAllTags();

      expect(result).toEqual([]);
    });

    it("should return empty array when no posts exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getAllTags();

      expect(result).toEqual([]);
    });

    it("should handle duplicate tags correctly", async () => {
      const mockPostsWithDuplicateTags = [
        {
          id: "post-1",
          collection: "posts" as const,
          data: {
            title: "Post 1",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "post-1",
            description: "Post 1",
            tags: ["javascript", "tutorial"],
            featured: false,
            draft: false,
          },
        },
        {
          id: "post-2",
          collection: "posts" as const,
          data: {
            title: "Post 2",
            publishDate: "2024-01-02T00:00:00.000Z",
            slug: "post-2",
            description: "Post 2",
            tags: ["javascript", "advanced"],
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockPostsWithDuplicateTags);
      const result = await getAllTags();

      expect(result).toEqual(["advanced", "javascript", "tutorial"]);
    });
  });

  describe("getPosts helper function coverage", () => {
    it("should return unsorted posts excluding drafts when both parameters are default/false", async () => {
      const result = await getAllPosts(false, false);

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("first-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("latest-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });

    it("should return sorted posts including drafts", async () => {
      const result = await getAllPosts(true, true);

      expect(result).toHaveLength(5);
      expect(result[0].slug).toBe("latest-post");
      expect(result[4].slug).toBe("first-post");
      expect(result.some((post) => post.draft)).toBe(true);
    });

    it("should return sorted posts excluding drafts", async () => {
      const result = await getAllPosts(true, false);

      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("latest-post");
      expect(result[1].slug).toBe("second-post");
      expect(result[2].slug).toBe("first-post");
      expect(result.every((post) => !post.draft)).toBe(true);
    });
    it("should handle posts with undefined tags in mapping", async () => {
      const mockPostsWithUndefinedTags = [
        {
          id: "null-tags",
          collection: "posts" as const,
          data: {
            title: "Undefined Tags Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "null-tags",
            description: "Post with null tags",
            tags: undefined,
            featured: false,
            draft: false,
          },
        },
        {
          id: "undefined-tags",
          collection: "posts" as const,
          data: {
            title: "Undefined Tags Post",
            publishDate: "2024-01-02T00:00:00.000Z",
            slug: "undefined-tags",
            description: "Post with undefined tags",
            // tags property is missing (undefined)
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockPostsWithUndefinedTags);
      const result = await getAllPosts(false, false);

      expect(result).toHaveLength(2);
      expect(result[0].tags).toBeUndefined();
      expect(result[1].tags).toBeUndefined();
    });

    it("should properly map all entry.data properties to Post interface", async () => {
      const mockCompletePost = [
        {
          id: "complete-post",
          collection: "posts" as const,
          data: {
            title: "Complete Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "complete-post",
            description: "Complete post description",
            content: "Complete post content",
            tags: ["tag1", "tag2"],
            featured: true,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockCompletePost);

      const result = await getAllPosts(false, false);

      expect(result).toHaveLength(1);
      const post = result[0];
      expect(post.title).toBe("Complete Post");
      expect(post.publishDate).toBe("2024-01-01T00:00:00.000Z");
      expect(post.slug).toBe("complete-post");
      expect(post.description).toBe("Complete post description");
      expect(post.content).toBe("Complete post content");
      expect(post.tags).toEqual(["tag1", "tag2"]);
      expect(post.featured).toBe(true);
      expect(post.draft).toBe(false);
    });
  });
});

describe("postsUtils - Extended Tests", () => {
  describe("getAllPosts - Edge Cases", () => {
    it("should handle posts with same date", async () => {
      const mockSameDatePosts = [
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

      mockGetCollection.mockResolvedValue(mockSameDatePosts);
      const result = await getAllPosts();

      expect(result).toHaveLength(2);
      expect(result[0].publishDate).toBe("2024-01-15T00:00:00.000Z");
      expect(result[1].publishDate).toBe("2024-01-15T00:00:00.000Z");
    });

    it("should handle invalid date formats gracefully", async () => {
      const mockInvalidDatePosts = [
        {
          id: "invalid-date",
          collection: "posts" as const,
          data: {
            title: "Invalid Date Post",
            publishDate: "invalid-date",
            slug: "invalid-date",
            description: "Invalid date",
            featured: false,
            draft: false,
          },
        },
        {
          id: "valid-date",
          collection: "posts" as const,
          data: {
            title: "Valid Date Post",
            publishDate: "2024-01-15T00:00:00.000Z",
            slug: "valid-date",
            description: "Valid date",
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockInvalidDatePosts);
      const result = await getAllPosts();

      expect(result).toHaveLength(2);
    });

    it("should maintain all post properties", async () => {
      const result = await getAllPosts();

      for (const post of result) {
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("publishDate");
        expect(post).toHaveProperty("slug");
        expect(post).toHaveProperty("description");
        expect(post).toHaveProperty("featured");
        expect(post).toHaveProperty("draft");
      }
    });
  });

  describe("Error Handling", () => {
    it("should propagate getCollection errors in getAllPosts", async () => {
      mockGetCollection.mockRejectedValue(new Error("Database error"));

      await expect(getAllPosts()).rejects.toThrow("Database error");
    });

    it("should propagate getCollection errors in getFeaturedPosts", async () => {
      mockGetCollection.mockRejectedValue(new Error("Network error"));

      await expect(getFeaturedPosts()).rejects.toThrow("Network error");
    });

    it("should propagate getCollection errors in getPostsByTag", async () => {
      mockGetCollection.mockRejectedValue(new Error("API error"));

      await expect(getPostsByTag("tag")).rejects.toThrow("API error");
    });

    it("should propagate getCollection errors in getAllTags", async () => {
      mockGetCollection.mockRejectedValue(new Error("Connection error"));

      await expect(getAllTags()).rejects.toThrow("Connection error");
    });

    it("should handle empty collection gracefully", async () => {
      mockGetCollection.mockResolvedValue([]);

      const allPosts = await getAllPosts();
      const latestPost = await getLatestPost();
      const latestPosts = await getLatestPosts(5);
      const featuredPosts = await getFeaturedPosts();
      const taggedPosts = await getPostsByTag("any-tag");
      const allTags = await getAllTags();

      expect(allPosts).toEqual([]);
      expect(latestPost).toBeNull();
      expect(latestPosts).toEqual([]);
      expect(featuredPosts).toEqual([]);
      expect(taggedPosts).toEqual([]);
      expect(allTags).toEqual([]);
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle large number of posts efficiently", async () => {
      const largeMockPosts = Array.from({ length: 1000 }, (_, index) => ({
        id: `post-${index}`,
        collection: "posts" as const,
        data: {
          title: `Post ${index}`,
          publishDate: `2024-01-${String((index % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
          slug: `post-${index}`,
          description: `Description ${index}`,
          tags: [`tag-${index % 10}`],
          featured: index % 10 === 0,
          draft: index % 5 === 0,
        },
      }));

      mockGetCollection.mockResolvedValue(largeMockPosts);

      const startTime = Date.now();
      const result = await getAllPosts();
      const endTime = Date.now();

      expect(result.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should handle posts with empty tags array", async () => {
      const mockPostsWithEmptyTags = [
        {
          id: "empty-tags",
          collection: "posts" as const,
          data: {
            title: "Empty Tags Post",
            publishDate: "2024-01-01T00:00:00.000Z",
            slug: "empty-tags",
            description: "Post with empty tags",
            tags: [],
            featured: false,
            draft: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockPostsWithEmptyTags);

      const allTags = await getAllTags();
      const taggedPosts = await getPostsByTag("any-tag");

      expect(allTags).toEqual([]);
      expect(taggedPosts).toEqual([]);
    });
  });
});
