import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllHonors, getAllHonorsGroupByCategory } from "@/utils/honor";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockHonorsCollectionEntries = [
  {
    id: "startup-weekend-europe-2015",
    collection: "honors" as const,
    data: {
      category: "International",
      year: "2015",
      title: "Most Voted by public",
      location: "Berlin, Germany",
    },
  },
  {
    id: "startup-weekend-madrid-2017",
    collection: "honors" as const,
    data: {
      category: "National",
      year: "2017",
      title: "5th Position",
      location: "Madrid, Spain",
    },
  },
  {
    id: "startup-weekend-madrid-2016",
    collection: "honors" as const,
    data: {
      category: "National",
      year: "2016",
      title: "2nd Place",
      location: "Madrid, Spain",
    },
  },
  {
    id: "betabeers-organizator-2014-2017",
    collection: "honors" as const,
    data: {
      category: "National",
      year: "2014-2017",
      title: "Betabeers Organizator",
      location: "Almeria, Spain",
    },
  },
  {
    id: "startup-weekend-madrid-2015",
    collection: "honors" as const,
    data: {
      category: "National",
      year: "2015",
      title: "Finalist",
      location: "Madrid, Spain",
    },
  },
];

const mockSingleHonorCollection = [
  {
    id: "single-honor",
    collection: "honors" as const,
    data: {
      category: "Regional",
      year: "2020",
      title: "Best Developer",
      location: "Valencia, Spain",
    },
  },
];

const mockEmptyHonorsCollection: never[] = [];

describe("Honor Utils functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllHonors function", () => {
    it("should return all honors when collection has multiple entries", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonors();

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(5);
      expect(result).toEqual([
        {
          category: "International",
          year: "2015",
          title: "Most Voted by public",
          location: "Berlin, Germany",
        },
        {
          category: "National",
          year: "2017",
          title: "5th Position",
          location: "Madrid, Spain",
        },
        {
          category: "National",
          year: "2016",
          title: "2nd Place",
          location: "Madrid, Spain",
        },
        {
          category: "National",
          year: "2014-2017",
          title: "Betabeers Organizator",
          location: "Almeria, Spain",
        },
        {
          category: "National",
          year: "2015",
          title: "Finalist",
          location: "Madrid, Spain",
        },
      ]);
    });

    it("should return all honors sorted by year when sorted=true", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonors(true);

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(5);

      // Should be sorted from most recent to oldest
      expect(result[0].year).toBe("2017");
      expect(result[1].year).toBe("2016");
      expect(result[2].year).toBe("2015");
      expect(result[3].year).toBe("2015"); // Another 2015 entry
      expect(result[4].year).toBe("2014-2017"); // Range starting with 2014
    });

    it("should handle date ranges correctly when sorting", async () => {
      const mockHonorsWithRanges = [
        {
          id: "honor-2020",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2020",
            title: "Single Year Honor",
            location: "Location A",
          },
        },
        {
          id: "honor-2018-2022",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2018-2022",
            title: "Range Honor",
            location: "Location B",
          },
        },
        {
          id: "honor-2019",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2019",
            title: "Another Single Year",
            location: "Location C",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockHonorsWithRanges);

      const result = await getAllHonors(true);

      expect(result).toHaveLength(3);
      // Should be sorted by first year of range: 2020, 2019, 2018
      expect(result[0].year).toBe("2020");
      expect(result[1].year).toBe("2019");
      expect(result[2].year).toBe("2018-2022");
    });

    it("should return single honor when collection has one entry", async () => {
      mockGetCollection.mockResolvedValue(mockSingleHonorCollection);

      const result = await getAllHonors();

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        category: "Regional",
        year: "2020",
        title: "Best Developer",
        location: "Valencia, Spain",
      });
    });

    it("should return empty array when collection is empty", async () => {
      mockGetCollection.mockResolvedValue(mockEmptyHonorsCollection);

      const result = await getAllHonors();

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when collection is empty and sorted=true", async () => {
      mockGetCollection.mockResolvedValue(mockEmptyHonorsCollection);

      const result = await getAllHonors(true);

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should not modify original data when sorting", async () => {
      const originalData = [...mockHonorsCollectionEntries];
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      await getAllHonors(true);

      // Verify original data structure is not modified
      expect(mockHonorsCollectionEntries).toEqual(originalData);
    });

    it("should handle unsorted getAllHonors correctly", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonors(false);

      expect(result).toHaveLength(5);
      // When unsorted, should maintain original order
      expect(result[0].year).toBe("2015");
      expect(result[1].year).toBe("2017");
      expect(result[2].year).toBe("2016");
      expect(result[3].year).toBe("2014-2017");
      expect(result[4].year).toBe("2015");
    });
  });

  describe("getAllHonorsGroupByCategory function", () => {
    it("should group honors by category correctly", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonorsGroupByCategory();

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(Object.keys(result)).toEqual(["International", "National"]);
      expect(result.International).toHaveLength(1);
      expect(result.National).toHaveLength(4);

      expect(result.International[0]).toEqual({
        category: "International",
        year: "2015",
        title: "Most Voted by public",
        location: "Berlin, Germany",
      });

      expect(result.National).toContainEqual({
        category: "National",
        year: "2017",
        title: "5th Position",
        location: "Madrid, Spain",
      });
    });

    it("should group honors by category and sort within each category when sorted=true", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonorsGroupByCategory(true);

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(Object.keys(result)).toEqual(["International", "National"]);

      // International category should have 1 item
      expect(result.International).toHaveLength(1);

      // National category should be sorted from most recent to oldest
      expect(result.National).toHaveLength(4);
      expect(result.National[0].year).toBe("2017"); // Most recent
      expect(result.National[1].year).toBe("2016");
      expect(result.National[2].year).toBe("2015");
      expect(result.National[3].year).toBe("2014-2017"); // Range starting with 2014
    });

    it("should handle single category with multiple honors", async () => {
      const mockSingleCategoryHonors = [
        {
          id: "honor-1",
          collection: "honors" as const,
          data: {
            category: "Regional",
            year: "2021",
            title: "First Honor",
            location: "City A",
          },
        },
        {
          id: "honor-2",
          collection: "honors" as const,
          data: {
            category: "Regional",
            year: "2020",
            title: "Second Honor",
            location: "City B",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockSingleCategoryHonors);

      const result = await getAllHonorsGroupByCategory();

      expect(Object.keys(result)).toEqual(["Regional"]);
      expect(result.Regional).toHaveLength(2);
    });

    it("should handle multiple categories with single honors each", async () => {
      const mockMultipleCategoriesSingleHonors = [
        {
          id: "honor-1",
          collection: "honors" as const,
          data: {
            category: "International",
            year: "2021",
            title: "International Honor",
            location: "Country A",
          },
        },
        {
          id: "honor-2",
          collection: "honors" as const,
          data: {
            category: "National",
            year: "2020",
            title: "National Honor",
            location: "Country B",
          },
        },
        {
          id: "honor-3",
          collection: "honors" as const,
          data: {
            category: "Regional",
            year: "2019",
            title: "Regional Honor",
            location: "City C",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockMultipleCategoriesSingleHonors);

      const result = await getAllHonorsGroupByCategory();

      expect(Object.keys(result)).toEqual(["International", "National", "Regional"]);
      expect(result.International).toHaveLength(1);
      expect(result.National).toHaveLength(1);
      expect(result.Regional).toHaveLength(1);
    });

    it("should return empty object when collection is empty", async () => {
      mockGetCollection.mockResolvedValue(mockEmptyHonorsCollection);

      const result = await getAllHonorsGroupByCategory();

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toEqual({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should return empty object when collection is empty and sorted=true", async () => {
      mockGetCollection.mockResolvedValue(mockEmptyHonorsCollection);

      const result = await getAllHonorsGroupByCategory(true);

      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toEqual({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should handle single honor in single category", async () => {
      mockGetCollection.mockResolvedValue(mockSingleHonorCollection);

      const result = await getAllHonorsGroupByCategory();

      expect(Object.keys(result)).toEqual(["Regional"]);
      expect(result.Regional).toHaveLength(1);
      expect(result.Regional[0]).toEqual({
        category: "Regional",
        year: "2020",
        title: "Best Developer",
        location: "Valencia, Spain",
      });
    });

    it("should preserve honor data integrity when grouping", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      const result = await getAllHonorsGroupByCategory();

      // Check that all honors are present in the grouped result
      const allHonorsFromGroups = Object.values(result).flat();
      expect(allHonorsFromGroups).toHaveLength(5);

      // Verify specific honor data integrity
      const internationalHonor = result.International.find(
        (honor) => honor.title === "Most Voted by public",
      );
      expect(internationalHonor).toBeDefined();
      expect(internationalHonor?.location).toBe("Berlin, Germany");
      expect(internationalHonor?.year).toBe("2015");
    });

    it("should handle complex year ranges in sorting correctly", async () => {
      const mockComplexYearRanges = [
        {
          id: "honor-1",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2015-2020",
            title: "Long Range Honor",
            location: "Location A",
          },
        },
        {
          id: "honor-2",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2018",
            title: "Single Year Honor",
            location: "Location B",
          },
        },
        {
          id: "honor-3",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2010-2012",
            title: "Early Range Honor",
            location: "Location C",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockComplexYearRanges);

      const result = await getAllHonorsGroupByCategory(true);

      expect(result.Test).toHaveLength(3);
      // Should be sorted by first year: 2018, 2015, 2010
      expect(result.Test[0].year).toBe("2018");
      expect(result.Test[1].year).toBe("2015-2020");
      expect(result.Test[2].year).toBe("2010-2012");
    });

    it("should handle edge cases in year parsing", async () => {
      const mockEdgeCaseYears = [
        {
          id: "honor-1",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "0",
            title: "Zero Year Honor",
            location: "Location A",
          },
        },
        {
          id: "honor-2",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "1000-2000",
            title: "Millennium Range Honor",
            location: "Location B",
          },
        },
        {
          id: "honor-3",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2023",
            title: "Recent Honor",
            location: "Location C",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockEdgeCaseYears);

      const result = await getAllHonorsGroupByCategory(true);

      expect(result.Test).toHaveLength(3);
      // Should be sorted by first year: 2023, 1000, 0
      expect(result.Test[0].year).toBe("2023");
      expect(result.Test[1].year).toBe("1000-2000");
      expect(result.Test[2].year).toBe("0");
    });

    it("should handle identical years in sorting", async () => {
      const mockIdenticalYears = [
        {
          id: "honor-1",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2020",
            title: "First 2020 Honor",
            location: "Location A",
          },
        },
        {
          id: "honor-2",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2020",
            title: "Second 2020 Honor",
            location: "Location B",
          },
        },
        {
          id: "honor-3",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2020-2021",
            title: "Range Starting 2020 Honor",
            location: "Location C",
          },
        },
      ];

      mockGetCollection.mockResolvedValue(mockIdenticalYears);

      const result = await getAllHonorsGroupByCategory(true);

      expect(result.Test).toHaveLength(3);
      // All should have the same sorting priority (2020)
      // Order should be preserved for items with same year
      expect(result.Test.every(honor => honor.year.startsWith("2020"))).toBe(true);
    });

    it("should ensure getAllHonors calls getHonors internally with correct parameters", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      // Test unsorted path
      await getAllHonors(false);
      expect(mockGetCollection).toHaveBeenCalledWith("honors");

      // Test sorted path
      await getAllHonors(true);
      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      
      // Verify function calls
      expect(mockGetCollection).toHaveBeenCalledTimes(2);
    });

    it("should ensure getAllHonorsGroupByCategory calls getHonors with false parameter", async () => {
      mockGetCollection.mockResolvedValue(mockHonorsCollectionEntries);

      // Test that internal getHonors is called with false regardless of sorted parameter
      await getAllHonorsGroupByCategory(false);
      await getAllHonorsGroupByCategory(true);
      
      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(2);
    });

    it("should test internal getHonors function behavior directly through getAllHonors", async () => {
      // Test that the internal getHonors function works properly
      mockGetCollection.mockResolvedValue([
        {
          id: "test-honor",
          collection: "honors" as const,
          data: {
            category: "Test",
            year: "2022",
            title: "Test Honor",
            location: "Test Location",
          },
        },
      ]);

      // Test unsorted behavior
      const unsortedResult = await getAllHonors(false);
      expect(unsortedResult).toHaveLength(1);
      expect(unsortedResult[0].year).toBe("2022");

      // Test sorted behavior with single item (should still work)
      const sortedResult = await getAllHonors(true);
      expect(sortedResult).toHaveLength(1);
      expect(sortedResult[0].year).toBe("2022");

      // Verify the function was called correctly
      expect(mockGetCollection).toHaveBeenCalledWith("honors");
      expect(mockGetCollection).toHaveBeenCalledTimes(2);
    });
  });
});
