import type { CollectionEntry } from "astro:content";

export interface TagWithCount {
  name: string;
  count: number;
}

export interface TagContent {
  title?: string;
  description?: string;
  content?: string;
}

export interface TagPageData {
  tag: string;
  posts: CollectionEntry<"posts">[];
  tagContent: TagContent | null;
  pageTitle: string;
  pageDescription: string;
  groupedPostsByYear: Record<number, CollectionEntry<"posts">[]>;
  years: number[];
}
