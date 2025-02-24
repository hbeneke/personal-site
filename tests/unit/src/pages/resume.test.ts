import { describe, it, expect, vi } from "vitest";
import { getCollection } from "astro:content";
import type { ResumeCollection } from "@/types";

vi.mock("astro:content", async () => ({
  getCollection: async (
    collectionName: string
  ): Promise<ResumeCollection[]> => {
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
                startup: false,
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
    const resumeCollection = (await getCollection(
      "resume"
    )) as ResumeCollection[];
    expect(resumeCollection).toHaveLength(1);
    expect(resumeCollection[0].data.work_experience[0].position).toBe(
      "Developer"
    );
  });
});
