import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllNotes, getLatestNote, getLatestNotes, getNotesGroupedByYear } from "@/utils/note";
import { getCollection } from "astro:content";
import { clearCache } from "@/utils/cache";

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
    clearCache(); // Clear the cache before each test
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
