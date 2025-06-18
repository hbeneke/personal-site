import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/pages/notes/rss.xml";
import type { RssItem } from "@/types";

// Mock modules
vi.mock("@/utils/note", () => ({
  getLatestNotes: vi.fn(),
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
const { getLatestNotes } = await import("@/utils/note");
const rss = (await import("@astrojs/rss")).default;

describe("RSS Feed", () => {
  // Mock data
  const mockNotes = [
    {
      title: "Test Note 1",
      description: "First test note",
      publishDate: "2024-01-01",
      slug: "test-note-1",
      starred: false,
    },
    {
      title: "Test Note 2",
      description: "Second test note",
      publishDate: "2024-01-02",
      slug: "test-note-2",
      starred: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getLatestNotes).mockResolvedValue(mockNotes);
  });

  describe("RSS generation", () => {
    it("should generate RSS feed with correct title and description", async () => {
      await GET();

      expect(rss).toHaveBeenCalledWith({
        title: "Test Site - Notes",
        description: "Quick notes and updates from Test Author, Developer",
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
    it("should fetch latest 10 notes", async () => {
      await GET();

      expect(getLatestNotes).toHaveBeenCalledWith(10);
    });

    it("should handle empty notes array", async () => {
      vi.mocked(getLatestNotes).mockResolvedValue([]);

      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      expect(rssCall.items).toHaveLength(0);
    });
  });

  describe("Notes formatting", () => {
    it("should format notes correctly for RSS items", async () => {
      await GET();

      const rssCall = vi.mocked(rss).mock.calls[0][0];
      const items = rssCall.items as Array<RssItem>;

      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({
        title: "Test Note 1",
        description: "First test note",
        pubDate: new Date("2024-01-01"),
        link: "/notes/test-note-1/",
      });
      expect(items[1]).toEqual({
        title: "Test Note 2",
        description: "Second test note",
        pubDate: new Date("2024-01-02"),
        link: "/notes/test-note-2/",
      });
    });
  });
});
