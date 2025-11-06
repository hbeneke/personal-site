import { type CollectionEntry, getCollection } from "astro:content";
import { getCached } from "./cache";

async function getRawPosts(): Promise<CollectionEntry<"posts">[]> {
  return getCached("posts-collection", async () => {
    const postsCollection = await getCollection("posts");
    return postsCollection;
  });
}

export async function getAllPosts(
  sorted = true,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.data.draft);
  }

  if (sorted) {
    posts = posts.sort(
      (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
    );
  }

  return posts;
}

export async function getLatestPost(): Promise<CollectionEntry<"posts"> | null> {
  const posts = await getRawPosts();
  const filteredPosts = posts.filter((post) => !post.data.draft);
  const sortedPosts = filteredPosts.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );
  return sortedPosts.length > 0 ? sortedPosts[0] : null;
}

export async function getLatestPosts(
  count = 1,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.data.draft);
  }

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );
  return sortedPosts.length > 0 ? sortedPosts.slice(0, count) : [];
}

export async function getFeaturedPosts(includeDrafts = false): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.data.draft);
  }

  return posts.filter((post) => post.data.featured);
}

export async function getPostsByTag(
  tag: string,
  includeDrafts = false,
): Promise<CollectionEntry<"posts">[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.data.draft);
  }

  return posts.filter((post) => post.data.tags?.includes(tag));
}

export async function getAllTags(includeDrafts = false): Promise<string[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.data.draft);
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
    posts = posts.filter((post) => !post.data.draft);
  }

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );

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
