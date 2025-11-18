import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllWorkExperiences, getWorkExperienceYears } from "@/utils/resume";
import { getCollection } from "astro:content";
import { clearCache } from "@/utils/cache";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockResumeCollectionEntries = [
  {
    id: "ineco",
    collection: "resume" as const,
    data: {
      company: "Ineco",
      company_url: "https://www.ineco.com/ineco/",
      startup: false,
      location: "Madrid, Spain",
      position: "Senior Front-end Developer",
      start_date: "July. 2024",
      end_date: "Present",
      description: "Current position description",
      responsibilities: ["Current responsibility 1", "Current responsibility 2"],
    },
  },
  {
    id: "deutsche-bank",
    collection: "resume" as const,
    data: {
      company: "Deutsche Bank",
      company_url: "https://www.deutsche-bank.es/",
      startup: false,
      location: "Madrid, Spain",
      position: "Tech Lead",
      start_date: "Jun. 2021",
      end_date: "Apr. 2024",
      description: "Previous position description",
      responsibilities: ["Previous responsibility 1", "Previous responsibility 2"],
    },
  },
  {
    id: "telecoming",
    collection: "resume" as const,
    data: {
      company: "Telecoming",
      company_url: "https://www.telecoming.com/",
      startup: false,
      location: "Madrid, Spain",
      position: "Frontend Developer",
      start_date: "Sep. 2014",
      end_date: "Oct. 2015",
      description: "Older position description",
      responsibilities: ["Older responsibility 1", "Older responsibility 2"],
    },
  },
];

describe("resumeUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCache();
    mockGetCollection.mockResolvedValue(mockResumeCollectionEntries);
  });

  describe("getAllWorkExperiences", () => {
    it("should return all work experiences sorted by start date (newest first) by default", async () => {
      const result = await getAllWorkExperiences();

      expect(result).toHaveLength(3);
      expect(result[0].company).toBe("Ineco");
      expect(result[1].company).toBe("Deutsche Bank");
      expect(result[2].company).toBe("Telecoming");
      expect(result[0].start_date).toBe("July. 2024");
      expect(result[1].start_date).toBe("Jun. 2021");
      expect(result[2].start_date).toBe("Sep. 2014");
    });

    it("should return unsorted work experiences when sorted is false", async () => {
      const result = await getAllWorkExperiences(false);

      expect(result).toHaveLength(3);
      expect(result[0].company).toBe("Ineco");
      expect(result[1].company).toBe("Deutsche Bank");
      expect(result[2].company).toBe("Telecoming");
    });

    it("should return empty array when no work experiences exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getAllWorkExperiences();

      expect(result).toEqual([]);
    });

    it("should handle collection with single work experience", async () => {
      const singleExperience = [mockResumeCollectionEntries[0]];
      mockGetCollection.mockResolvedValue(singleExperience);

      const result = await getAllWorkExperiences();

      expect(result).toHaveLength(1);
      expect(result[0].company).toBe("Ineco");
    });

    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Collection error"));

      await expect(getAllWorkExperiences()).rejects.toThrow("Collection error");
    });
  });

  describe("getWorkExperienceYears", () => {
    it("should return correct start and end years from work experiences", async () => {
      const result = await getWorkExperienceYears();

      expect(result.start).toBe("Sep. 2014");
      expect(result.end).toBe("Present");
    });

    it("should return empty strings when no work experiences exist", async () => {
      mockGetCollection.mockResolvedValue([]);

      const result = await getWorkExperienceYears();

      expect(result).toEqual({ start: "", end: "" });
    });

    it("should handle single work experience correctly", async () => {
      const singleExperience = [mockResumeCollectionEntries[1]];
      mockGetCollection.mockResolvedValue(singleExperience);

      const result = await getWorkExperienceYears();

      expect(result.start).toBe("Jun. 2021");
      expect(result.end).toBe("Apr. 2024");
    });

    it("should propagate getCollection errors", async () => {
      mockGetCollection.mockRejectedValue(new Error("Network error"));

      await expect(getWorkExperienceYears()).rejects.toThrow("Network error");
    });
  });
});