import { getCollection } from "astro:content";
import type { Honor } from "@types";

// Year field may be a range (e.g. "2021-2023"); sorting uses the first year only.
function compareByFirstYearDesc(a: Honor, b: Honor): number {
  const firstYear = (year: string) => Number.parseInt(year.split("-")[0], 10);
  return firstYear(b.year) - firstYear(a.year);
}

export async function getAllHonors(sorted = false): Promise<Honor[]> {
  const honorsCollection = await getCollection("honors");
  const honors: Honor[] = honorsCollection.map((honor) => honor.data);

  if (sorted) {
    honors.sort(compareByFirstYearDesc);
  }

  return honors;
}

export async function getAllHonorsGroupByCategory(
  sorted = false,
): Promise<Record<string, Honor[]>> {
  const honors = await getAllHonors(false);
  const groupedHonors: Record<string, Honor[]> = {};

  for (const honor of honors) {
    if (!groupedHonors[honor.category]) {
      groupedHonors[honor.category] = [];
    }
    groupedHonors[honor.category].push(honor);
  }

  if (sorted) {
    for (const category of Object.values(groupedHonors)) {
      category.sort(compareByFirstYearDesc);
    }
  }

  return groupedHonors;
}
