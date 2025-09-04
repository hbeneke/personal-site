import type { Honor } from "@types";
import { getCollection } from "astro:content";

async function getHonors(sorted = false): Promise<Honor[]> {
  const honorsCollection = await getCollection("honors");
  const honors: Honor[] = honorsCollection.map((honor) => honor.data);

  if (sorted) {
    honors.sort((a, b) => {
      const getFirstYear = (year: string) => {
        return Number.parseInt(year.split("-")[0]);
      };
      return getFirstYear(b.year) - getFirstYear(a.year);
    });
  }

  return honors;
}

export async function getAllHonors(sorted = false): Promise<Honor[]> {
  return await getHonors(sorted);
}

export async function getAllHonorsGroupByCategory(
  sorted = false,
): Promise<Record<string, Honor[]>> {
  const honors = await getHonors(false);
  const groupedHonors: Record<string, Honor[]> = {};

  for (const honor of honors) {
    if (!groupedHonors[honor.category]) {
      groupedHonors[honor.category] = [];
    }
    groupedHonors[honor.category].push(honor);
  }

  if (sorted) {
    for (const category in groupedHonors) {
      groupedHonors[category].sort((a, b) => {
        const getFirstYear = (year: string) => Number.parseInt(year.split("-")[0]);
        return getFirstYear(b.year) - getFirstYear(a.year);
      });
    }
  }
  return groupedHonors;
}
