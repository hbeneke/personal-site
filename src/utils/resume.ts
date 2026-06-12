import { getCollection } from "astro:content";
import type { WorkExperience } from "@types";

function compareByStartDateDesc(a: WorkExperience, b: WorkExperience): number {
  return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
}

export async function getAllWorkExperiences(sorted = true): Promise<WorkExperience[]> {
  const resumeCollection = await getCollection("resume");
  const workExperiences: WorkExperience[] = resumeCollection.map((entry) => entry.data);

  if (sorted) {
    workExperiences.sort(compareByStartDateDesc);
  }

  return workExperiences;
}

/**
 * Returns the earliest and latest dates across all work experiences.
 *
 * `start` is the oldest `start_date` and `end` is the most recent `end_date`
 * (which may be `"present"`). Useful for displaying the total career span.
 */
export async function getWorkExperienceYears(): Promise<{ start: string; end: string }> {
  const sortedExperiences = await getAllWorkExperiences(true);

  if (sortedExperiences.length === 0) {
    return { start: "", end: "" };
  }

  return {
    start: sortedExperiences[sortedExperiences.length - 1].start_date,
    end: sortedExperiences[0].end_date,
  };
}
