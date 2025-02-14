import { describe, it, expect, vi } from "vitest";
import { getCollection } from "astro:content";
import { calculateDuration } from "@/utils/dateUtils";

vi.mock("astro:content", async () => ({
  getCollection: async (collectionName) => {
    if (collectionName === "resume") {
      return [
        {
          data: {
            work_experience: [
              {
                start_date: "2018-01",
                end_date: "2020-01",
                position: "Developer",
                company: "Company A",
                company_url: "https://companya.com",
                location: "Location A",
                description: "Worked on multiple projects",
                responsibilities: ["Development", "Testing"],
              },
            ],
          },
        },
      ];
    }
    return [];
  },
}));

describe("Resume Page", () => {
  it("Work Experience content is loaded", async () => {
    const resumeCollection = await getCollection("resume");
    expect(resumeCollection).toHaveLength(1);
    expect(resumeCollection[0].data.work_experience[0].position).toBe(
      "Developer"
    );
  });

  describe("Calculate Duration function", () => {
    it("Only years", async () => {
      const result = calculateDuration("2018-01", "2020-01");
      expect(result).toBe("2 years");
    });

    it("Only Months", async () => {
      const result = calculateDuration("2018-01", "2018-03");
      expect(result).toBe("2 months");
    });

    it("Years and Months", async () => {
      const result = calculateDuration("2018-01", "2020-03");
      expect(result).toBe("2 years 2 months");
    });
  });
});
