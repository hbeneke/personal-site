import { getCollection } from "astro:content";
import type { Skill } from "@types";
import { getCached } from "./cache";

async function getSkills(): Promise<Skill[]> {
  const skillCollection = await getCached("skills-collection", async () => {
    return await getCollection("skills");
  });

  const skills: Skill[] = skillCollection.map((entry) => entry.data);

  return skills;
}

export async function getAllSkills(): Promise<Skill[]> {
  return await getSkills();
}
