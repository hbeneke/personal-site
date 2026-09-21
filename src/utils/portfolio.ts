import { getCollection } from "astro:content";
import type { ActivityPoint, Project } from "@types";

/**
 * Fetches projects and applies a composite sort based on the flag combination:
 * - `sortByFeatured && sorted` → featured first, then by `order` ascending within each group
 * - `sortByFeatured` only → featured first, relative order of the rest preserved
 * - `sorted` only → all projects by `order` ascending
 * - neither → collection order
 */
async function getProjects(sorted = false, sortByFeatured = false): Promise<Project[]> {
  try {
    const portfolioCollection = await getCollection("portfolioProjects");

    const projects: Project[] = portfolioCollection.map((entry) => entry.data);

    let sortedProjects = [...projects];

    if (sortByFeatured && sorted) {
      sortedProjects = sortedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        return (a.order ?? 0) - (b.order ?? 0);
      });
    } else if (sortByFeatured) {
      sortedProjects = sortedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    } else if (sorted) {
      sortedProjects = sortedProjects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return sortedProjects;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error fetching portfolio collection:", error);
    }
    return [];
  }
}

export async function getAllProjects(sorted = true, sortByFeatured = false): Promise<Project[]> {
  return await getProjects(sorted, sortByFeatured);
}

/**
 * Maps a project's changelog to activity points, weighting each release by its number of changes
 * and labelling it with its version
 *
 * @param project - Project whose changelog is converted
 * @returns One point per changelog entry in release order, or an empty array when there is no changelog
 */
export function getChangelogActivity(project: Project): ActivityPoint[] {
  return [...(project.changelog ?? [])]
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime() ||
        a.version.localeCompare(b.version, undefined, { numeric: true }),
    )
    .map((entry) => ({
      date: entry.date,
      value: entry.changes.length,
      label: `v${entry.version}`,
    }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}
