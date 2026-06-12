import { type CollectionEntry, getCollection } from "astro:content";
import { isValidDate } from "./date";

/**
 * Filters out draft posts from an array.
 *
 * @param posts - Array of posts to filter.
 * @returns A new array containing only published (non-draft) posts.
 */
function filterDrafts(posts: CollectionEntry<"posts">[]): CollectionEntry<"posts">[] {
  return posts.filter((post) => !post.data.draft);
}

function sortByDate(posts: CollectionEntry<"posts">[]): CollectionEntry<"posts">[] {
  return [...posts].sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );
}

async function getRawPosts(): Promise<CollectionEntry<"posts">[]> {
  try {
    return await getCollection("posts");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error fetching posts collection:", error);
    }
    return [];
  }
}

// Shared by every public getter so the draft-filtering rule lives in one place.
async function getPublishablePosts(includeDrafts: boolean): Promise<CollectionEntry<"posts">[]> {
  const posts = await getRawPosts();
  return includeDrafts ? posts : filterDrafts(posts);
}

export async function getAllPosts(
  sorted = true,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  const posts = await getPublishablePosts(includeDrafts);
  return sorted ? sortByDate(posts) : posts;
}

export async function getLatestPosts(
  count = 1,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  const posts = await getAllPosts(true, includeDrafts);
  return posts.slice(0, count);
}

export async function getLatestPost(): Promise<CollectionEntry<"posts"> | null> {
  const [latest] = await getLatestPosts(1);
  return latest ?? null;
}

export async function getFeaturedPosts(includeDrafts = false): Promise<CollectionEntry<"posts">[]> {
  const posts = await getPublishablePosts(includeDrafts);
  return posts.filter((post) => post.data.featured);
}

export async function getPostsByTag(
  tag: string,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  const posts = await getPublishablePosts(includeDrafts);
  return posts.filter((post) => post.data.tags?.includes(tag));
}

export async function getAllTags(includeDrafts = false): Promise<string[]> {
  const posts = await getPublishablePosts(includeDrafts);
  const tags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}

/**
 * Groups posts by their publish year. Posts with invalid dates are silently skipped.
 *
 * @param posts - Posts to group; order within each year is preserved.
 * @returns Posts keyed by publish year.
 *
 * @example
 * groupPostsByYear(posts); // { 2024: [post, post], 2025: [post] }
 */
export function groupPostsByYear(
  posts: CollectionEntry<"posts">[],
): Record<number, CollectionEntry<"posts">[]> {
  return posts.reduce((acc: Record<number, CollectionEntry<"posts">[]>, post) => {
    const date = new Date(post.data.publishDate);
    if (!isValidDate(date)) {
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

export async function getPostsGroupedByYear(
  includeDrafts = false,
): Promise<Record<number, CollectionEntry<"posts">[]>> {
  const posts = await getAllPosts(true, includeDrafts);
  return groupPostsByYear(posts);
}
