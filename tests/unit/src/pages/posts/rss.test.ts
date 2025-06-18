import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/pages/posts/rss.xml";
import type { RssItem } from "@/types";

// Mock modules
vi.mock("@/utils/post", () => ({
  getLatestPosts: vi.fn(),
}));

vi.mock("@/site.config", () => ({
  siteConfig: {
    siteTitle: "Test Site",
    authorName: "Test Author",
    jobTitle: "Developer",
    siteUrl: "https://example.com",
  },
}));

vi.mock("@astrojs/rss", () => ({
  default: vi.fn((options) => ({
    body: `<?xml version="1.0" encoding="UTF-8"?><rss><title>${options.title}</title></rss>`,
    headers: { "Content-Type": "application/xml" },
  })),
}));

// Import mocked modules
const { getLatestPosts } = await import("@/utils/post");
const rss = (await import("@astrojs/rss")).default;

describe("Posts RSS Feed", () => {
  // Mock data
  const mockPosts = [
    {
      title: "First Blog Post",
      description: "This is the first blog post",
      publishDate: "2024-01-01T00:00:00.000Z",
      slug: "first-blog-post",
      content: "Full content of the first blog post with markdown and details.",
      tags: ["javascript", "tutorial"],
      featured: true,
      draft: false,
    },
    {
      title: "Advanced TypeScript Tips",
      description: "Learn advanced TypeScript techniques",
      publishDate: "2024-01-15T00:00:00.000Z",
      slug: "advanced-typescript-tips",
      content: "Detailed content about TypeScript advanced features.",
      tags: ["typescript", "advanced", "tips"],
      featured: false,
      draft: false,
    },
    {
      title: "Web Performance Optimization",
      description: "How to optimize your web applications",
      publishDate: "2024-02-01T00:00:00.000Z",
      slug: "web-performance-optimization",
      content: "Complete guide to web performance optimization techniques.",
      tags: ["performance", "optimization", "web"],
      featured: true,
      draft: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getLatestPosts).mockResolvedValue(mockPosts);
  });

  describe("RSS generation", () => {
    it("should generate RSS feed with correct title and description", async () => {
      await GET();

      expect(rss).toHaveBeenCalledWith({
        title: "Test Site - Posts",
        description:
          "Latest blog posts from Test Author, Developer. Insights on web development, programming, and technology.",
        site: "https://example.com",
        items: expect.any(Array),
        customData: "<language>en-us</language>",
      });
    });

    it("should return RSS response with correct format", async () => {
      const result = await GET();

      expect(result).toEqual({
        body: expect.stringContaining('<?xml version="1.0" encoding="UTF-8"?>'),
        headers: { "Content-Type": "application/xml" },
      });
    });
  });

  describe("Data fetching", () => {
    it("should fetch latest 20 posts", async () => {
      await GET();

      expect(getLatestPosts).toHaveBeenCalledWith(20);
    });

    it("should handle empty posts array", async () => {
      vi.mocked(getLatestPosts).mockResolvedValue([]);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      expect(rssCall.items).toHaveLength(0);
    });
  });

  describe("Posts formatting", () => {
    it("should format posts correctly for RSS items", async () => {
      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      expect(items).toHaveLength(3);
      expect(items[0]).toEqual({
        title: "First Blog Post",
        description: "This is the first blog post",
        content: "Full content of the first blog post with markdown and details.",
        pubDate: new Date("2024-01-01T00:00:00.000Z"),
        link: "/posts/first-blog-post/",
        categories: ["javascript", "tutorial"],
      });
      expect(items[1]).toEqual({
        title: "Advanced TypeScript Tips",
        description: "Learn advanced TypeScript techniques",
        content: "Detailed content about TypeScript advanced features.",
        pubDate: new Date("2024-01-15T00:00:00.000Z"),
        link: "/posts/advanced-typescript-tips/",
        categories: ["typescript", "advanced", "tips"],
      });
      expect(items[2]).toEqual({
        title: "Web Performance Optimization",
        description: "How to optimize your web applications",
        content: "Complete guide to web performance optimization techniques.",
        pubDate: new Date("2024-02-01T00:00:00.000Z"),
        link: "/posts/web-performance-optimization/",
        categories: ["performance", "optimization", "web"],
      });
    });

    it("should handle posts without content", async () => {
      const mockPostsWithoutContent = [
        {
          title: "Post Without Content",
          description: "Description only post",
          publishDate: "2024-01-01T00:00:00.000Z",
          slug: "post-without-content",
          tags: ["minimal"],
          featured: false,
          draft: false,
        },
      ];

      vi.mocked(getLatestPosts).mockResolvedValue(mockPostsWithoutContent);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        title: "Post Without Content",
        description: "Description only post",
        content: undefined,
        pubDate: new Date("2024-01-01T00:00:00.000Z"),
        link: "/posts/post-without-content/",
        categories: ["minimal"],
      });
    });

    it("should handle posts without tags", async () => {
      const mockPostsWithoutTags = [
        {
          title: "Post Without Tags",
          description: "Description of post without tags",
          publishDate: "2024-01-01T00:00:00.000Z",
          slug: "post-without-tags",
          content: "Content without tags",
          featured: false,
          draft: false,
        },
      ];

      vi.mocked(getLatestPosts).mockResolvedValue(mockPostsWithoutTags);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        title: "Post Without Tags",
        description: "Description of post without tags",
        content: "Content without tags",
        pubDate: new Date("2024-01-01T00:00:00.000Z"),
        link: "/posts/post-without-tags/",
        categories: [],
      });
    });

    it("should handle posts with empty tags array", async () => {
      const mockPostsWithEmptyTags = [
        {
          title: "Post With Empty Tags",
          description: "Description of post with empty tags",
          publishDate: "2024-01-01T00:00:00.000Z",
          slug: "post-with-empty-tags",
          content: "Content with empty tags array",
          tags: [],
          featured: false,
          draft: false,
        },
      ];

      vi.mocked(getLatestPosts).mockResolvedValue(mockPostsWithEmptyTags);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      expect(items).toHaveLength(1);
      expect(items[0].categories).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("should propagate errors from getLatestPosts", async () => {
      vi.mocked(getLatestPosts).mockRejectedValue(new Error("Posts fetch error"));

      await expect(GET()).rejects.toThrow("Posts fetch error");
    });

    it("should handle invalid dates gracefully", async () => {
      const mockPostsWithInvalidDates = [
        {
          title: "Post With Invalid Date",
          description: "Post with invalid date format",
          publishDate: "invalid-date",
          slug: "invalid-date-post",
          content: "Content of post with invalid date",
          tags: ["test"],
          featured: false,
          draft: false,
        },
      ];

      vi.mocked(getLatestPosts).mockResolvedValue(mockPostsWithInvalidDates);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      expect(items).toHaveLength(1);
      expect(items[0].pubDate).toEqual(new Date("invalid-date"));
    });
  });

  describe("RSS metadata", () => {
    it("should include correct RSS metadata", async () => {
      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];

      expect(rssCall.title).toBe("Test Site - Posts");
      expect(rssCall.description).toBe(
        "Latest blog posts from Test Author, Developer. Insights on web development, programming, and technology.",
      );
      expect(rssCall.site).toBe("https://example.com");
      expect(rssCall.customData).toBe("<language>en-us</language>");
    });

    it("should generate correct item links", async () => {
      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      items.forEach((item, index) => {
        expect(item.link).toBe(`/posts/${mockPosts[index].slug}/`);
      });
    });

    it("should include publication dates", async () => {
      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem & { content?: string; categories?: string[] }>;

      items.forEach((item, index) => {
        expect(item.pubDate).toEqual(new Date(mockPosts[index].publishDate));
      });
    });
  });

  describe("Performance and limits", () => {
    it("should limit to 20 posts even if more are available", async () => {
      // Create 25 mock posts
      const manyPosts = Array.from({ length: 25 }, (_, index) => ({
        title: `Post ${index + 1}`,
        description: `Description ${index + 1}`,
        publishDate: `2024-01-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
        slug: `post-${index + 1}`,
        content: `Content ${index + 1}`,
        tags: [`tag-${index + 1}`],
        featured: false,
        draft: false,
      }));

      vi.mocked(getLatestPosts).mockResolvedValue(manyPosts);

      await GET();

      expect(getLatestPosts).toHaveBeenCalledWith(20);
    });

    it("should handle large content efficiently", async () => {
      const largeContentPost = [
        {
          title: "Post With Large Content",
          description: "Post with very large content",
          publishDate: "2024-01-01T00:00:00.000Z",
          slug: "large-content-post",
          content: "a".repeat(10000), // 10KB of content
          tags: ["large", "content"],
          featured: false,
          draft: false,
        },
      ];

      vi.mocked(getLatestPosts).mockResolvedValue(largeContentPost);

      const startTime = Date.now();
      await GET();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
