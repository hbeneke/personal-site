import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllNotes, getLatestNote, getNotesGroupedByYear } from "@/utils/note";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
	getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockNotesCollectionEntries = [
	{
		id: "notes",
		collection: "notes" as const,
		data: {
			notes: [
				{
					date: "2024-01-15",
					description: "Content 1",
					title: "Note 1",
					slug: "note-1",
					starred: false,
				},
				{
					date: "2024-02-10",
					description: "Content 2",
					title: "Note 2",
					slug: "note-2",
					starred: true,
				},
				{
					date: "2023-12-20",
					description: "Content 3",
					title: "Note 3",
					slug: "note-3",
					starred: false,
				},
			],
		},
	},
];

describe("noteUtils", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetCollection.mockResolvedValue(mockNotesCollectionEntries);
	});

	describe("getAllNotes", () => {
		it("should return all notes sorted by date (newest first) by default", async () => {
			const result = await getAllNotes();

			expect(result).toHaveLength(3);
			expect(result[0].date).toBe("2024-02-10");
			expect(result[1].date).toBe("2024-01-15");
			expect(result[2].date).toBe("2023-12-20");
		});

		it("should return unsorted notes when sorted is false", async () => {
			const result = await getAllNotes(false);

			expect(result).toHaveLength(3);
			expect(result[0].slug).toBe("note-1");
			expect(result[1].slug).toBe("note-2");
			expect(result[2].slug).toBe("note-3");
		});
	});

	describe("getLatestNote", () => {
		it("should return the most recent note", async () => {
			const result = await getLatestNote();

			expect(result).toBeDefined();
			expect(result?.date).toBe("2024-02-10");
			expect(result?.title).toBe("Note 2");
		});

		it("should return undefined when no notes exist", async () => {
			mockGetCollection.mockResolvedValue([]);

			const result = await getLatestNote();

			expect(result).toBeUndefined();
		});
	});

	describe("getNotesGroupedByYear", () => {
		it("should group notes by year and sort them correctly", async () => {
			const result = await getNotesGroupedByYear();

			expect(result).toHaveLength(2);
			expect(result[0][0]).toBe("2024");
			expect(result[1][0]).toBe("2023");

			expect(result[0][1][0].date).toBe("2024-02-10");
			expect(result[1][1][0].date).toBe("2023-12-20");
			expect(result[0][1][1].date).toBe("2024-01-15");
		});

		it("should handle empty notes collection", async () => {
			mockGetCollection.mockResolvedValue([]);

			const result = await getNotesGroupedByYear();

			expect(result).toEqual([]);
		});
	});
});

describe("noteUtils - Extended Tests", () => {
	describe("getAllNotes - Edge Cases", () => {
		it("should handle notes with same date", async () => {
			const mockSameDateNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-01-15",
								description: "Content A",
								title: "Note A",
								slug: "note-a",
								starred: false,
							},
							{
								date: "2024-01-15",
								description: "Content B",
								title: "Note B",
								slug: "note-b",
								starred: true,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockSameDateNotes);
			const result = await getAllNotes();

			expect(result).toHaveLength(2);
			expect(result[0].date).toBe("2024-01-15");
			expect(result[1].date).toBe("2024-01-15");
		});

		it("should handle invalid date formats gracefully", async () => {
			const mockInvalidDateNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "invalid-date",
								description: "Content",
								title: "Note",
								slug: "note",
								starred: false,
							},
							{
								date: "2024-01-15",
								description: "Valid Content",
								title: "Valid Note",
								slug: "valid-note",
								starred: false,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockInvalidDateNotes);
			const result = await getAllNotes();

			expect(result).toHaveLength(2);
		});

		it("should handle collection with empty notes array", async () => {
			const mockEmptyNotesArray = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockEmptyNotesArray);
			const result = await getAllNotes();

			expect(result).toEqual([]);
		});

		it("should handle multiple collections with notes", async () => {
			const mockMultipleCollections = [
				{
					id: "notes1",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-01-15",
								description: "Content 1",
								title: "Note 1",
								slug: "note-1",
								starred: false,
							},
						],
					},
				},
				{
					id: "notes2",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-02-15",
								description: "Content 2",
								title: "Note 2",
								slug: "note-2",
								starred: true,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockMultipleCollections);
			const result = await getAllNotes();

			expect(result).toHaveLength(2);
			expect(result[0].date).toBe("2024-02-15");
			expect(result[1].date).toBe("2024-01-15");
		});
	});

	describe("getLatestNote - Edge Cases", () => {
		it("should return latest note when multiple notes have same date", async () => {
			const mockSameDateNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-01-15",
								description: "Content A",
								title: "Note A",
								slug: "note-a",
								starred: false,
							},
							{
								date: "2024-01-15",
								description: "Content B",
								title: "Note B",
								slug: "note-b",
								starred: true,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockSameDateNotes);
			const result = await getLatestNote();

			expect(result).toBeDefined();
			expect(result?.date).toBe("2024-01-15");
		});

		it("should handle collection error gracefully", async () => {
			mockGetCollection.mockRejectedValue(new Error("Collection error"));

			await expect(getLatestNote()).rejects.toThrow("Collection error");
		});
	});

	describe("getNotesGroupedByYear - Edge Cases", () => {
		it("should handle notes spanning multiple decades", async () => {
			const mockMultiDecadeNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "1999-12-31",
								description: "Y2K note",
								title: "Last of 1999",
								slug: "y2k",
								starred: false,
							},
							{
								date: "2000-01-01",
								description: "New millennium",
								title: "First of 2000",
								slug: "millennium",
								starred: true,
							},
							{
								date: "2024-01-15",
								description: "Modern note",
								title: "Modern",
								slug: "modern",
								starred: false,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockMultiDecadeNotes);
			const result = await getNotesGroupedByYear();

			expect(result).toHaveLength(3);
			expect(result[0][0]).toBe("2024");
			expect(result[1][0]).toBe("2000");
			expect(result[2][0]).toBe("1999");
		});

		it("should handle single note per year", async () => {
			const mockSingleNotePerYear = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-06-15",
								description: "2024 note",
								title: "2024",
								slug: "note-2024",
								starred: false,
							},
							{
								date: "2023-03-10",
								description: "2023 note",
								title: "2023",
								slug: "note-2023",
								starred: true,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockSingleNotePerYear);
			const result = await getNotesGroupedByYear();

			expect(result).toHaveLength(2);
			expect(result[0][1]).toHaveLength(1);
			expect(result[1][1]).toHaveLength(1);
		});

		it("should sort notes within same year correctly", async () => {
			const mockSameYearNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-01-01",
								description: "January",
								title: "Jan Note",
								slug: "jan",
								starred: false,
							},
							{
								date: "2024-12-31",
								description: "December",
								title: "Dec Note",
								slug: "dec",
								starred: true,
							},
							{
								date: "2024-06-15",
								description: "June",
								title: "Jun Note",
								slug: "jun",
								starred: false,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockSameYearNotes);
			const result = await getNotesGroupedByYear();

			expect(result).toHaveLength(1);
			expect(result[0][0]).toBe("2024");
			expect(result[0][1]).toHaveLength(3);
			expect(result[0][1][0].date).toBe("2024-12-31");
			expect(result[0][1][1].date).toBe("2024-06-15");
			expect(result[0][1][2].date).toBe("2024-01-01");
		});

		it("should handle leap year dates", async () => {
			const mockLeapYearNotes = [
				{
					id: "notes",
					collection: "notes" as const,
					data: {
						notes: [
							{
								date: "2024-02-29",
								description: "Leap day",
								title: "Leap Year",
								slug: "leap",
								starred: true,
							},
							{
								date: "2023-02-28",
								description: "Regular Feb",
								title: "Regular Year",
								slug: "regular",
								starred: false,
							},
						],
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockLeapYearNotes);
			const result = await getNotesGroupedByYear();

			expect(result).toHaveLength(2);
			expect(result[0][0]).toBe("2024");
			expect(result[1][0]).toBe("2023");
		});
	});

	describe("Error Handling", () => {
		it("should propagate getCollection errors in getAllNotes", async () => {
			mockGetCollection.mockRejectedValue(new Error("Database error"));

			await expect(getAllNotes()).rejects.toThrow("Database error");
		});

		it("should propagate getCollection errors in getNotesGroupedByYear", async () => {
			mockGetCollection.mockRejectedValue(new Error("Network error"));

			await expect(getNotesGroupedByYear()).rejects.toThrow("Network error");
		});
	});
});
