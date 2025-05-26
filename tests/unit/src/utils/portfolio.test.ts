import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllProjects, getFeaturedProjects } from "@/utils/portfolio";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
	getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockPortfolioCollectionEntries = [
	{
		id: "portfolio",
		collection: "portfolioProjects" as const,
		data: {
			projects: [
				{
					title: "Project A",
					date: "2024-01-15",
					description: "Description A",
					featured: true,
					order: 2,
					technologies: ["React", "TypeScript"],
					github: "https://github.com/user/project-a",
					demo: "https://project-a.com",
				},
				{
					title: "Project B",
					date: "2024-02-10",
					description: "Description B",
					featured: false,
					order: 1,
					technologies: ["Vue", "JavaScript"],
					github: "https://github.com/user/project-b",
				},
				{
					title: "Project C",
					date: "2024-03-05",
					description: "Description C",
					featured: true,
					order: 3,
					technologies: ["Astro", "Tailwind"],
					demo: "https://project-c.com",
				},
			],
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
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Project X",
								date: "2024-01-01",
								description: "Description X",
								featured: false,
								order: 1,
								technologies: ["React"],
							},
						],
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
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Project No Order",
								date: "2024-01-01",
								description: "No order defined",
								featured: false,
								technologies: ["HTML"],
							},
							{
								title: "Project With Order",
								date: "2024-01-02",
								description: "Has order",
								featured: true,
								order: 5,
								technologies: ["CSS"],
							},
						],
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
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Project A",
								date: "2024-01-01",
								description: "First project",
								featured: false,
								order: 1,
								technologies: ["React"],
							},
							{
								title: "Project B",
								date: "2024-01-02",
								description: "Second project",
								featured: true,
								order: 1,
								technologies: ["Vue"],
							},
						],
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
			const mockEmptyProjectsArray = [
				{
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockEmptyProjectsArray);
			const result = await getAllProjects();

			expect(result).toEqual([]);
		});

		it("should handle multiple collections with projects", async () => {
			const mockMultipleCollections = [
				{
					id: "portfolio1",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Collection 1 Project",
								date: "2024-01-01",
								description: "From first collection",
								featured: true,
								order: 2,
								technologies: ["Astro"],
							},
						],
					},
				},
				{
					id: "portfolio2",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Collection 2 Project",
								date: "2024-01-02",
								description: "From second collection",
								featured: false,
								order: 1,
								technologies: ["Svelte"],
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockMultipleCollections);
			const result = await getAllProjects();

			expect(result).toHaveLength(2);
			expect(result[0].order).toBe(1);
			expect(result[1].order).toBe(2);
			expect(result[0].title).toBe("Collection 2 Project");
			expect(result[1].title).toBe("Collection 1 Project");
		});

		it("should handle negative order values", async () => {
			const mockNegativeOrderProjects = [
				{
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Negative Order",
								date: "2024-01-01",
								description: "Has negative order",
								featured: false,
								order: -1,
								technologies: ["JavaScript"],
							},
							{
								title: "Positive Order",
								date: "2024-01-02",
								description: "Has positive order",
								featured: true,
								order: 1,
								technologies: ["TypeScript"],
							},
						],
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
	});

	describe("getFeaturedProjects - Edge Cases", () => {
		it("should handle projects with mixed featured values", async () => {
			const mockMixedFeaturedProjects = [
				{
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Featured Project 1",
								date: "2024-01-01",
								description: "First featured",
								featured: true,
								order: 1,
								technologies: ["React"],
							},
							{
								title: "Non-Featured Project",
								date: "2024-01-02",
								description: "Not featured",
								featured: false,
								order: 2,
								technologies: ["Vue"],
							},
							{
								title: "Featured Project 2",
								date: "2024-01-03",
								description: "Second featured",
								featured: true,
								order: 3,
								technologies: ["Astro"],
							},
						],
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
					id: "portfolio",
					collection: "portfolioProjects" as const,
					data: {
						projects: [
							{
								title: "Last Featured",
								date: "2024-01-01",
								description: "Should appear last",
								featured: true,
								order: 3,
								technologies: ["Svelte"],
							},
							{
								title: "First Featured",
								date: "2024-01-02",
								description: "Should appear first",
								featured: true,
								order: 1,
								technologies: ["React"],
							},
							{
								title: "Not Featured",
								date: "2024-01-03",
								description: "Should not appear",
								featured: false,
								order: 2,
								technologies: ["Vue"],
							},
						],
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
