import type { Post } from "@types";
import { getCollection } from "astro:content";

async function getPosts(sorted = false, includeDrafts = false): Promise<Post[]> {
  const postsCollection = await getCollection("posts");
  let allPosts: Post[] = postsCollection.map((entry) => ({
    title: entry.data.title,
    publishDate: entry.data.publishDate,
    slug: entry.data.slug,
    description: entry.data.description,
    content: entry.data.content,
    tags: entry.data.tags,
    featured: entry.data.featured,
    draft: entry.data.draft,
  }));

  if (!includeDrafts) {
    allPosts = allPosts.filter((post) => !post.draft);
  }

  if (sorted) {
    return allPosts.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
  }

  return allPosts;
}

export async function getAllPosts(sorted = true, includeDrafts = false): Promise<Post[]> {
  return await getPosts(sorted, includeDrafts);
}

export async function getLatestPost(): Promise<Post | null> {
  const sortedPosts: Post[] = await getPosts(true, false);
  return sortedPosts.length > 0 ? sortedPosts[0] : null;
}

export async function getLatestPosts(count = 1, includeDrafts = false): Promise<Post[]> {
  const sortedPosts: Post[] = await getPosts(true, includeDrafts);
  return sortedPosts.length > 0 ? sortedPosts.slice(0, count) : [];
}

export async function getFeaturedPosts(includeDrafts = false): Promise<Post[]> {
  const posts = await getPosts(false, includeDrafts);
  return posts.filter((post) => post.featured);
}

export async function getPostsByTag(tag: string, includeDrafts = false): Promise<Post[]> {
  const posts = await getPosts(false, includeDrafts);
  return posts.filter((post) => post.tags?.includes(tag));
}

export async function getAllTags(includeDrafts = false): Promise<string[]> {
  const posts = await getPosts(false, includeDrafts);
  const tags = new Set<string>();

  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }
  }

  return Array.from(tags).sort();
}
