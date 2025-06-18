import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllNotes, getLatestNote, getLatestNotes, getNotesGroupedByYear } from "@/utils/note";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockNotesCollectionEntries = [
  {
    id: "note-1",
    collection: "notes" as const,
    data: {
      title: "Note 1",
      publishDate: "2024-01-15",
      slug: "note-1",
      description: "Content 1",
      starred: false,
    },
  },
  {
    id: "note-2",
    collection: "notes" as const,
    data: {
      title: "Note 2",
      publishDate: "2024-02-10",
      slug: "note-2",
      description: "Content 2",
      starred: true,
    },
  },
  {
    id: "note-3",
    collection: "notes" as const,
    data: {
      title: "Note 3",
      publishDate: "2023-12-20",
      slug: "note-3",
      description: "Content 3",
      starred: false,
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
      expect(result[0].publishDate).toBe("2024-02-10");
      expect(result[1].publishDate).toBe("2024-01-15");
      expect(result[2].publishDate).toBe("2023-12-20");
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
      expect(result?.publishDate).toBe("2024-02-10");
      expect(result?.title).toBe("Note 2");
    });

    it("should return null when no notes exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getLatestNote();

      expect(result).toBeNull();
    });
  });

  describe("getLatestNotes", () => {
    it("should return the most recent note when count is 1", async () => {
      const result = await getLatestNotes(1);

      expect(result).toHaveLength(1);
      expect(result[0].publishDate).toBe("2024-02-10");
      expect(result[0].title).toBe("Note 2");
    });

    it("should return multiple notes when count is greater than 1", async () => {
      const result = await getLatestNotes(2);

      expect(result).toHaveLength(2);
      expect(result[0].publishDate).toBe("2024-02-10");
      expect(result[1].publishDate).toBe("2024-01-15");
    });

    it("should return all notes when count exceeds available notes", async () => {
      const result = await getLatestNotes(10);

      expect(result).toHaveLength(3);
      expect(result[0].publishDate).toBe("2024-02-10");
      expect(result[1].publishDate).toBe("2024-01-15");
      expect(result[2].publishDate).toBe("2023-12-20");
    });

    it("should return empty array when no notes exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getLatestNotes(5);

      expect(result).toEqual([]);
    });

    it("should use default count of 1 when no parameter provided", async () => {
      const result = await getLatestNotes();

      expect(result).toHaveLength(1);
      expect(result[0].publishDate).toBe("2024-02-10");
    });

    it("should handle count of 0", async () => {
      const result = await getLatestNotes(0);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getLatestNotes(3)).rejects.toThrow("Collection error");
    });
  });

  describe("getNotesGroupedByYear", () => {
    it("should group notes by year and sort them correctly", async () => {
      const result = await getNotesGroupedByYear();

      expect(result).toHaveLength(2);
      expect(result[0][0]).toBe("2024");
      expect(result[1][0]).toBe("2023");

      expect(result[0][1][0].publishDate).toBe("2024-02-10");
      expect(result[1][1][0].publishDate).toBe("2023-12-20");
      expect(result[0][1][1].publishDate).toBe("2024-01-15");
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
          id: "note-a",
          collection: "notes" as const,
          data: {
            title: "Note A",
            publishDate: "2024-01-15",
            slug: "note-a",
            description: "Content A",
            starred: false,
          },
        },
        {
          id: "note-b",
          collection: "notes" as const,
          data: {
            title: "Note B",
            publishDate: "2024-01-15",
            slug: "note-b",
            description: "Content B",
            starred: true,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockSameDateNotes);
      const result = await getAllNotes();

      expect(result).toHaveLength(2);
      expect(result[0].publishDate).toBe("2024-01-15");
      expect(result[1].publishDate).toBe("2024-01-15");
    });

    it("should handle invalid date formats gracefully", async () => {
      const mockInvalidDateNotes = [
        {
          id: "invalid-note",
          collection: "notes" as const,
          data: {
            title: "Note",
            publishDate: "invalid-date",
            slug: "note",
            description: "Content",
            starred: false,
          },
        },
        {
          id: "valid-note",
          collection: "notes" as const,
          data: {
            title: "Valid Note",
            publishDate: "2024-01-15",
            slug: "valid-note",
            description: "Valid Content",
            starred: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockInvalidDateNotes);
      const result = await getAllNotes();

      expect(result).toHaveLength(2);
    });

    it("should handle collection with empty notes array", async () => {
      mockGetCollection.mockResolvedValue([]);
      const result = await getAllNotes();

      expect(result).toEqual([]);
    });

    it("should handle multiple collections with notes", async () => {
      const mockMultipleCollections = [
        {
          id: "note-1",
          collection: "notes" as const,
          data: {
            title: "Note 1",
            publishDate: "2024-01-15",
            slug: "note-1",
            description: "Content 1",
            starred: false,
          },
        },
        {
          id: "note-2",
          collection: "notes" as const,
          data: {
            title: "Note 2",
            publishDate: "2024-02-15",
            slug: "note-2",
            description: "Content 2",
            starred: true,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockMultipleCollections);
      const result = await getAllNotes();

      expect(result).toHaveLength(2);
      expect(result[0].publishDate).toBe("2024-02-15");
      expect(result[1].publishDate).toBe("2024-01-15");
    });
  });

  describe("getLatestNote - Edge Cases", () => {
    it("should return latest note when multiple notes have same date", async () => {
      const mockSameDateNotes = [
        {
          id: "note-a",
          collection: "notes" as const,
          data: {
            title: "Note A",
            publishDate: "2024-01-15",
            slug: "note-a",
            description: "Content A",
            starred: false,
          },
        },
        {
          id: "note-b",
          collection: "notes" as const,
          data: {
            title: "Note B",
            publishDate: "2024-01-15",
            slug: "note-b",
            description: "Content B",
            starred: true,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockSameDateNotes);
      const result = await getLatestNote();

      expect(result).toBeDefined();
      expect(result?.publishDate).toBe("2024-01-15");
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
          id: "y2k",
          collection: "notes" as const,
          data: {
            title: "Last of 1999",
            publishDate: "1999-12-31",
            slug: "y2k",
            description: "Y2K note",
            starred: false,
          },
        },
        {
          id: "millennium",
          collection: "notes" as const,
          data: {
            title: "First of 2000",
            publishDate: "2000-01-01",
            slug: "millennium",
            description: "New millennium",
            starred: true,
          },
        },
        {
          id: "modern",
          collection: "notes" as const,
          data: {
            title: "Modern",
            publishDate: "2024-01-15",
            slug: "modern",
            description: "Modern note",
            starred: false,
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
          id: "note-2024",
          collection: "notes" as const,
          data: {
            title: "2024",
            publishDate: "2024-06-15",
            slug: "note-2024",
            description: "2024 note",
            starred: false,
          },
        },
        {
          id: "note-2023",
          collection: "notes" as const,
          data: {
            title: "2023",
            publishDate: "2023-03-10",
            slug: "note-2023",
            description: "2023 note",
            starred: true,
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
          id: "jan",
          collection: "notes" as const,
          data: {
            title: "Jan Note",
            publishDate: "2024-01-01",
            slug: "jan",
            description: "January",
            starred: false,
          },
        },
        {
          id: "dec",
          collection: "notes" as const,
          data: {
            title: "Dec Note",
            publishDate: "2024-12-31",
            slug: "dec",
            description: "December",
            starred: true,
          },
        },
        {
          id: "jun",
          collection: "notes" as const,
          data: {
            title: "Jun Note",
            publishDate: "2024-06-15",
            slug: "jun",
            description: "June",
            starred: false,
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockSameYearNotes);
      const result = await getNotesGroupedByYear();

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe("2024");
      expect(result[0][1]).toHaveLength(3);
      expect(result[0][1][0].publishDate).toBe("2024-12-31");
      expect(result[0][1][1].publishDate).toBe("2024-06-15");
      expect(result[0][1][2].publishDate).toBe("2024-01-01");
    });

    it("should handle leap year dates", async () => {
      const mockLeapYearNotes = [
        {
          id: "leap",
          collection: "notes" as const,
          data: {
            title: "Leap Year",
            publishDate: "2024-02-29",
            slug: "leap",
            description: "Leap day",
            starred: true,
          },
        },
        {
          id: "regular",
          collection: "notes" as const,
          data: {
            title: "Regular Year",
            publishDate: "2023-02-28",
            slug: "regular",
            description: "Regular Feb",
            starred: false,
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
