import { type CollectionEntry, getCollection } from "astro:content";
import type { TagContent, TagPageData, TagWithCount } from "@types";
import { getAllTags, getPostsByTag, groupPostsByYear } from "@utils/post";
import { getCached } from "./cache";

// Fetches post counts for all tags concurrently.
async function getTagsWithCounts(includeDrafts?: boolean): Promise<TagWithCount[]> {
  const allTags = await getAllTags(includeDrafts || false);

  const tagsWithCounts = await Promise.all(
    allTags.map(async (tag) => {
      const posts = await getPostsByTag(tag, includeDrafts || false);
      return {
        name: tag,
        count: posts.length,
      };
    }),
  );

  return tagsWithCounts.filter((tag) => tag.count > 0);
}

export async function getAllTagsWithCounts(includeDrafts = false): Promise<TagWithCount[]> {
  return await getTagsWithCounts(includeDrafts);
}

export async function getSortedTagsWithCounts(includeDrafts = false): Promise<TagWithCount[]> {
  const tagsWithCounts = await getTagsWithCounts(includeDrafts);
  return tagsWithCounts.sort((a, b) => b.count - a.count);
}

/**
 * Loads editorial content for a tag from the `tags` content collection.
 * Returns `null` if no entry exists for the given tag slug.
 */
export async function getTagContent(tag: string): Promise<TagContent | null> {
  try {
    const tagCollection = await getCached("tags-collection", async () => {
      return await getCollection("tags");
    });

    const tagEntry = tagCollection.find((entry) => entry.id === tag);

    if (tagEntry) {
      return {
        title: tagEntry.data.title,
        description: tagEntry.data.description,
        content: tagEntry.body,
      };
    }
  } catch (error) {
    // Error silently handled in production
    if (import.meta.env.DEV) {
      console.error("Error accessing tag collection:", error);
    }
  }

  return null;
}

export function sortYearsDescending(
  groupedPosts: Record<number, CollectionEntry<"posts">[]>,
): number[] {
  return Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a);
}

export async function getTagPageData(tag: string): Promise<TagPageData> {
  const posts = await getPostsByTag(tag, false);
  const tagContent = await getTagContent(tag);

  const pageTitle = tagContent?.title || `Posts about ${tag}`;
  const pageDescription =
    tagContent?.description ||
    `All blog posts tagged with "${tag}". Explore related content and insights.`;

  const groupedPostsByYear = groupPostsByYear(posts);
  const years = sortYearsDescending(groupedPostsByYear);

  return {
    tag,
    posts,
    tagContent,
    pageTitle,
    pageDescription,
    groupedPostsByYear,
    years,
  };
}

export async function getAllTagPaths(): Promise<string[]> {
  const allTags = await getAllTags(false);
  return allTags;
}
