import type { Post } from "@/types/Post.type";

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
  posts: Post[];
  tagContent: TagContent | null;
  pageTitle: string;
  pageDescription: string;
  groupedPostsByYear: Record<number, Post[]>;
  years: number[];
}
