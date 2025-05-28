import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/pages/notes/rss.xml";
import type { RssItem } from "@/types";
import type { APIContext, AstroCookies } from "astro";

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
			date: "2024-01-01",
			slug: "test-note-1",
			starred: false,
		},
		{
			title: "Test Note 2",
			description: "Second test note",
			date: "2024-01-02",
			slug: "test-note-2",
			starred: false,
		},
	];

	// Mock context setup
	const mockCookies = {
		get: vi.fn(),
		has: vi.fn(),
		set: vi.fn(),
		delete: vi.fn(),
		merge: vi.fn(),
		headers: new Headers(),
	} as unknown as AstroCookies;

	const mockContext = {
		site: new URL("https://example.com"),
		request: new Request("https://example.com/notes/rss.xml"),
		url: new URL("https://example.com/notes/rss.xml"),
		params: {},
		props: {},
		redirect: vi.fn(),
		rewrite: vi.fn(),
		generator: "Astro v4.0.0",
		locals: {},
		preferredLocale: "en",
		preferredLocaleList: ["en"],
		currentLocale: "en",
		clientAddress: "127.0.0.1",
		cookies: mockCookies,
		isPrerendered: false,
		routePattern: "",
		originPathname: "",
		getActionResult: vi.fn(),
		callAction: vi.fn(),
	} as APIContext;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getLatestNotes).mockResolvedValue(mockNotes);
	});

	describe("RSS generation", () => {
		it("should generate RSS feed with correct title and description", async () => {
			await GET(mockContext);

			expect(rss).toHaveBeenCalledWith({
				title: "Test Site - Notes",
				description: "Quick notes and updates from Test Author, Developer",
				site: "https://example.com",
				items: expect.any(Array),
				customData: "<language>en-us</language>",
			});
		});

		it("should return RSS response with correct format", async () => {
			const result = await GET(mockContext);

			expect(result).toEqual({
				body: expect.stringContaining('<?xml version="1.0" encoding="UTF-8"?>'),
				headers: { "Content-Type": "application/xml" },
			});
		});
	});

	describe("Data fetching", () => {
		it("should fetch latest 10 notes", async () => {
			await GET(mockContext);

			expect(getLatestNotes).toHaveBeenCalledWith(10);
		});

		it("should handle empty notes array", async () => {
			vi.mocked(getLatestNotes).mockResolvedValue([]);

			await GET(mockContext);

			const rssCall = vi.mocked(rss).mock.calls[0][0];
			expect(rssCall.items).toHaveLength(0);
		});
	});

	describe("Notes formatting", () => {
		it("should format notes correctly for RSS items", async () => {
			await GET(mockContext);

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
