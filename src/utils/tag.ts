import { type CollectionEntry, getCollection } from "astro:content";
import type { TagContent, TagPageData, TagWithCount } from "@types";
import { getAllTags, getPostsByTag } from "@utils/post";

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
    // Tag collection entry doesn't exist or error accessing it
  }

  return null;
}

export function groupPostsByYear(
  posts: CollectionEntry<"posts">[],
): Record<number, CollectionEntry<"posts">[]> {
  return posts.reduce((acc: Record<number, CollectionEntry<"posts">[]>, post) => {
    const date = new Date(post.data.publishDate);
    if (Number.isNaN(date.getTime())) {
      // Skip posts with invalid dates
      return acc;
    }
    const year = date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});
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
