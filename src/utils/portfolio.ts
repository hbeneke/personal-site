import type { Project } from "@types";
import { getCollection } from "astro:content";

async function getProjects(sorted = false): Promise<Project[]> {
  const portfolioCollection = await getCollection("portfolioProjects");
  const projects: Project[] = portfolioCollection.map((entry) => entry.data);

  if (sorted) {
    return projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  return projects;
}

export async function getAllProjects(sorted = true): Promise<Project[]> {
  return await getProjects(sorted);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}
