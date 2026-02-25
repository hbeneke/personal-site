import { getCollection } from "astro:content";
import type { WorkExperience } from "@types";
import { getCached } from "./cache";

async function getWorkExperiences(sorted = false): Promise<WorkExperience[]> {
  const resumeCollection = await getCached("resume-collection", async () => {
    return await getCollection("resume");
  });

  const workExperiences: WorkExperience[] = resumeCollection.map((entry) => entry.data);

  if (sorted) {
    return workExperiences.sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  return workExperiences;
}

export async function getAllWorkExperiences(sorted = true): Promise<WorkExperience[]> {
  return await getWorkExperiences(sorted);
}

/**
 * Returns the earliest and latest dates across all work experiences.
 *
 * `start` is the oldest `start_date` and `end` is the most recent `end_date`
 * (which may be `"present"`). Useful for displaying the total career span.
 */
export async function getWorkExperienceYears(): Promise<{ start: string; end: string }> {
  const workExperiences = await getWorkExperiences();

  if (workExperiences.length === 0) {
    return { start: "", end: "" };
  }

  const sortedExperiences = workExperiences.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB.getTime() - dateA.getTime();
  });

  return {
    start: sortedExperiences[sortedExperiences.length - 1].start_date,
    end: sortedExperiences[0].end_date,
  };
}
