import { getCollection } from "astro:content";
import type { Project } from "@types";
import { getCached } from "./cache";

async function getProjects(sorted = false, sortByFeatured = false): Promise<Project[]> {
  try {
    const portfolioCollection = await getCached("portfolio-collection", async () => {
      return await getCollection("portfolioProjects");
    });

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

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}
