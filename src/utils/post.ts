import { type CollectionEntry, getCollection } from "astro:content";
import { getCached } from "./cache";

/**
 * Filters out draft posts from an array
 * @param posts - Array of posts to filter
 * @returns Filtered array without draft posts
 */
function filterDrafts(posts: CollectionEntry<"posts">[]): CollectionEntry<"posts">[] {
  return posts.filter((post) => !post.data.draft);
}

/**
 * Sorts posts by publish date in descending order (newest first)
 * @param posts - Array of posts to sort
 * @returns Sorted array of posts
 */
function sortByDate(posts: CollectionEntry<"posts">[]): CollectionEntry<"posts">[] {
  return posts.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );
}

async function getRawPosts(): Promise<CollectionEntry<"posts">[]> {
  try {
    return await getCached("posts-collection", async () => {
      const postsCollection = await getCollection("posts");
      return postsCollection;
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error fetching posts collection:", error);
    }
    return [];
  }
}

export async function getAllPosts(
  sorted = true,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  if (sorted) {
    posts = sortByDate(posts);
  }

  return posts;
}

export async function getLatestPost(): Promise<CollectionEntry<"posts"> | null> {
  const posts = await getRawPosts();
  const filteredPosts = filterDrafts(posts);
  const sortedPosts = sortByDate(filteredPosts);
  return sortedPosts.length > 0 ? sortedPosts[0] : null;
}

export async function getLatestPosts(
  count = 1,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  const sortedPosts = sortByDate(posts);
  return sortedPosts.length > 0 ? sortedPosts.slice(0, count) : [];
}

export async function getFeaturedPosts(includeDrafts = false): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  return posts.filter((post) => post.data.featured);
}

export async function getPostsByTag(
  tag: string,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  return posts.filter((post) => post.data.tags?.includes(tag));
}

export async function getAllTags(includeDrafts = false): Promise<string[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  const tags = new Set<string>();

  for (const post of posts) {
    if (post.data.tags) {
      for (const tag of post.data.tags) {
        tags.add(tag);
      }
    }
  }

  return Array.from(tags).sort();
}

export async function getPostsGroupedByYear(
  includeDrafts = false,
): Promise<Record<number, CollectionEntry<"posts">[]>> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = filterDrafts(posts);
  }

  const sortedPosts = sortByDate(posts);

  const groupedPosts: Record<number, CollectionEntry<"posts">[]> = {};

  for (const post of sortedPosts) {
    const year = new Date(post.data.publishDate).getFullYear();

    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }

    groupedPosts[year].push(post);
  }

  return groupedPosts;
}
