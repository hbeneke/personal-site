import type { WorkExperience } from "@types";
import { getCollection } from "astro:content";

async function getWorkExperiences(sorted = false): Promise<WorkExperience[]> {
	const resumeCollection = await getCollection("resume");
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

export async function getWorkExperienceYears(): Promise<{ start: string; end: string }> {
	const workExperiences = await getWorkExperiences(true);

	if (workExperiences.length === 0) {
		return { start: "", end: "" };
	}

	return {
		start: workExperiences[workExperiences.length - 1].start_date,
		end: workExperiences[0].end_date,
	};
}
