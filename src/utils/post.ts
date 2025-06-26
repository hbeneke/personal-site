import type { Post } from "@types";
import { getCollection } from "astro:content";

async function getRawPosts(): Promise<Post[]> {
  const postsCollection = await getCollection("posts");
  return postsCollection.map((entry) => ({
    title: entry.data.title,
    publishDate: entry.data.publishDate,
    slug: entry.data.slug,
    description: entry.data.description,
    content: entry.data.content,
    tags: entry.data.tags,
    featured: entry.data.featured,
    draft: entry.data.draft,
  }));
}

export async function getAllPosts(sorted = true, includeDrafts = false): Promise<Post[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

  if (sorted) {
    posts = posts.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
  }

  return posts;
}

export async function getLatestPost(): Promise<Post | null> {
  const posts = await getRawPosts();
  const filteredPosts = posts.filter((post) => !post.draft);
  const sortedPosts = filteredPosts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
  return sortedPosts.length > 0 ? sortedPosts[0] : null;
}

export async function getLatestPosts(count = 1, includeDrafts = false): Promise<Post[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
  return sortedPosts.length > 0 ? sortedPosts.slice(0, count) : [];
}

export async function getFeaturedPosts(includeDrafts = false): Promise<Post[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

  return posts.filter((post) => post.featured);
}

export async function getPostsByTag(tag: string, includeDrafts = false): Promise<Post[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

  return posts.filter((post) => post.tags?.includes(tag));
}

export async function getAllTags(includeDrafts = false): Promise<string[]> {
  let posts = await getRawPosts();

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

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
