import { type CollectionEntry, getCollection } from "astro:content";
import type { TagContent, TagPageData, TagWithCount } from "@types";
import { getAllPosts, getAllTags, getPostsByTag, groupPostsByYear } from "@utils/post";

// Single-pass tag count: iterates posts once, accumulating counts in a Map.
async function getTagsWithCounts(includeDrafts?: boolean): Promise<TagWithCount[]> {
  const posts = await getAllPosts(false, includeDrafts || false);
  const counts = new Map<string, number>();

  for (const post of posts) {
    if (post.data.tags) {
      for (const tag of post.data.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(counts, ([name, count]) => ({ name, count }));
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
    const tagCollection = await getCollection("tags");

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
